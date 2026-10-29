import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { Blogpost5, type RelatedPost } from "@/components/blogpost5";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { blogPostingSchema, graph, personSchema } from "@/lib/seo/schema";
import { authorPath, toLocale } from "@/lib/seo/site";
import { findByLocalizedSlug, translated } from "@/utilities/findByLocalizedSlug";
import { BLOG_CATEGORIES, blogCategoryPath, isBlogCategory } from "@/lib/blog-categories";
import { getPage, type PageSearchParams } from "@/lib/pagination";
import { SuspendedBlogListing, blogListingMetadata, getBlogCategories } from "../blog-listing";
import { Blog12, type Blog12Post } from "@/components/blog12";
import { getLatestBlogPosts } from "@/lib/latest-blog-posts";
import type { Media } from "../../../../../../payload-types";

const RELATED_COUNT = 4;

// Up to RELATED_COUNT other posts, newest first: same-category posts first,
// topped up with the latest posts from any category. Cached across requests.
async function getRelatedPosts(
  post: { id: number; categories?: string[] | null },
  locale: string,
): Promise<RelatedPost[]> {
  "use cache";
  cmsCache("blog", "media");
  const payload = await getPayload({ config });
  const base: Where = {
    ...translated,
    // Local API bypasses access control, so filter out drafts explicitly.
    _status: { equals: "published" },
    id: { not_equals: post.id },
  };
  const find = (where: Where, limit: number) =>
    payload.find({
      collection: "blog",
      locale: locale as "en" | "bg",
      where,
      depth: 1,
      limit,
      sort: "-publishedAt",
      select: { title: true, slug: true, publishedAt: true, featuredImage: true },
    });

  const related: Awaited<ReturnType<typeof find>>["docs"] = [];
  if (post.categories?.length) {
    const { docs } = await find(
      { ...base, categories: { in: post.categories } },
      RELATED_COUNT,
    );
    related.push(...docs);
  }
  if (related.length < RELATED_COUNT) {
    const { docs } = await find(
      { ...base, id: { not_in: [post.id, ...related.map((doc) => doc.id)] } },
      RELATED_COUNT - related.length,
    );
    related.push(...docs);
  }

  const dateFormat = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return related.map((doc) => {
    const image =
      doc.featuredImage && typeof doc.featuredImage === "object"
        ? (doc.featuredImage as Media)
        : null;
    return {
      title: doc.title,
      href: `/blog/${doc.slug ?? doc.id}`,
      image: image?.url ?? undefined,
      dateLabel: doc.publishedAt ? dateFormat.format(new Date(doc.publishedAt)) : undefined,
    };
  });
}

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: PageSearchParams;
};

// Shared by generateMetadata and the page; findByLocalizedSlug is cached.
// Local API bypasses access control, so hide drafts explicitly.
const getPost = async (slug: string, locale: string) => {
  // depth 2 so the author's profileImage comes back as a Media doc (avatar).
  const post = await findByLocalizedSlug("blog", slug, locale, { depth: 2 });
  return post?._status === "published" ? post : null;
};

// Category pages and every published post are prerendered at build time;
// posts published later render on first visit and are then cached.
export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return [
    ...BLOG_CATEGORIES.map((slug) => ({ slug })),
    ...(await getPostSlugs(params.locale)).map((slug) => ({ slug })),
  ];
}

async function getPostSlugs(locale: string) {
  "use cache";
  cmsCache("blog");
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: { ...translated, _status: { equals: "published" } },
    depth: 0,
    pagination: false,
    select: { slug: true },
  });
  return docs.flatMap((doc) => (doc.slug ? [doc.slug] : []));
}

export async function generateMetadata({
  params,
  searchParams,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  // /blog/<category> is the blog listing filtered to that category.
  if (isBlogCategory(slug)) {
    return blogListingMetadata(await getPage(searchParams), slug);
  }
  const post = await getPost(slug, locale);

  if (!post) return {};

  return buildMetadata({
    title: post.meta?.title || post.title,
    description: post.meta?.description || truncate(post.excerpt),
    path: await localizedDocPath("blog", post.id, "/blog"),
    locale: toLocale(locale),
    image: mediaImage(post.meta?.image) ?? mediaImage(post.featuredImage),
    noindex: post.meta?.noindex,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({
  params,
  searchParams,
}: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (isBlogCategory(slug)) {
    return <SuspendedBlogListing locale={locale} searchParams={searchParams} category={slug} />;
  }
  const post = await getPost(slug, locale);

  if (!post) {
    notFound();
  }

  const featuredImage =
    post.featuredImage && typeof post.featuredImage === "object"
      ? (post.featuredImage as Media)
      : null;

  const author =
    post.author && typeof post.author === "object" ? post.author : null;

  // Name without the email fallback, for public structured data.
  const authorFullName = author
    ? [author.firstName, author.lastName].filter(Boolean).join(" ")
    : "";

  const authorName = authorFullName || author?.email;

  const authorAvatar =
    author?.profileImage && typeof author.profileImage === "object"
      ? (author.profileImage as Media).url ?? undefined
      : undefined;

  const dateFormat = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateLabel = post.publishedAt
    ? dateFormat.format(new Date(post.publishedAt))
    : undefined;
  // A visible "Updated" date (a freshness signal for search and AI answers),
  // only when the post changed on a later day than it was published.
  const updatedLabel =
    post.publishedAt &&
    dateFormat.format(new Date(post.updatedAt)) !== dateLabel &&
    new Date(post.updatedAt) > new Date(post.publishedAt)
      ? dateFormat.format(new Date(post.updatedAt))
      : undefined;

  const tCategories = await getTranslations("BlogCategories");
  // The first category stands in for the post in the breadcrumb trail.
  const primaryCategory = post.categories?.[0];
  const categories = (post.categories ?? []).map((category) => ({
    label: tCategories(category),
    href: blogCategoryPath(category),
  }));

  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("blog", post.id, "/blog");
  const [relatedPosts, usedCategories, latest, tCommon] = await Promise.all([
    getRelatedPosts({ id: post.id, categories: post.categories }, locale),
    getBlogCategories(locale),
    getLatestBlogPosts(locale, { excludeId: post.id }),
    getTranslations("Common"),
  ]);
  const tPost = await getTranslations("Blogpost5");
  // Every category with posts in this locale, for the sidebar.
  const allCategories = usedCategories.map((category) => ({
    label: tCategories(category),
    href: blogCategoryPath(category),
  }));
  const latestPosts: Blog12Post[] = latest.map(({ readMinutes, ...latestPost }) => ({
    ...latestPost,
    readTime: tCommon("readTime", { minutes: readMinutes }),
  }));

  return (
    <>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, [
            "blog",
            ...(primaryCategory
              ? [{ name: tCategories(primaryCategory), path: blogCategoryPath(primaryCategory) }]
              : []),
            { name: post.title, path },
          ]),
          blogPostingSchema({
            locale: seoLocale,
            path,
            headline: post.title,
            description: post.meta?.description || post.excerpt,
            image: featuredImage?.url,
            datePublished: post.publishedAt ?? post.createdAt,
            dateModified: post.updatedAt,
            articleSection: categories.map((category) => category.label),
            author:
              author && authorFullName
                ? personSchema({
                    locale: seoLocale,
                    id: author.id,
                    slug: author.slug,
                    name: authorFullName,
                    jobTitle: author.jobTitle,
                    image: authorAvatar,
                  })
                : null,
          }),
        )}
      />
      <Blogpost5
        title={post.title}
        authorName={authorName}
        authorAvatar={authorAvatar}
        authorHref={author ? authorPath(author) : undefined}
        dateLabel={dateLabel}
        publishedAt={post.publishedAt ?? undefined}
        updatedLabel={updatedLabel}
        updatedAt={post.updatedAt}
        categories={categories}
        relatedPosts={relatedPosts}
        allCategories={allCategories}
        featuredImage={featuredImage?.url ?? undefined}
        content={post.content ?? undefined}
        locale={locale as "en" | "bg"}
      />
      {latestPosts.length > 0 && (
        <Blog12 posts={latestPosts} heading={tPost("latest")} className="pt-0" />
      )}
    </>
  );
}
