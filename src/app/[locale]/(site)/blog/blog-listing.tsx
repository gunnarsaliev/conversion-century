import { Suspense } from "react";
import { preload } from "react-dom";
import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { BlogGridSkeleton, PageHeaderSkeleton } from "@/components/skeletons";
import { Blog28, type Blog28Post } from "@/components/blog28";
import { BlogCategoryFilter } from "@/components/blog-category-filter";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { BLOG_CATEGORIES, blogCategoryPath, type BlogCategory } from "@/lib/blog-categories";
import { BLOG_FEATURED_IMAGE_SIZES } from "@/lib/blog-image";
import { PAGE_SIZE, getPage, paginatedMetadata, type PageSearchParams } from "@/lib/pagination";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSeoLocale, pageBreadcrumbs, staticPageMetadata } from "@/lib/seo/pages";
import { graph } from "@/lib/seo/schema";
import { translated } from "@/utilities/findByLocalizedSlug";
import type { Media, User } from "../../../../../payload-types";

// The blog listing, shared by /blog and the category pages /blog/<category>
// (served by blog/[slug], since categories and posts share that segment).

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "";
  // Sofia time, matching the calendar ribbon on the card (blog28.tsx).
  return new Intl.DateTimeFormat(locale, {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

const authorAvatar = (author: number | User | null | undefined) => {
  if (!author || typeof author !== "object") return undefined;
  const image = author.profileImage;
  return image && typeof image === "object" ? ((image as Media).url ?? undefined) : undefined;
};

const authorName = (author: number | User | null | undefined) => {
  if (!author || typeof author !== "object") return "";
  return [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email;
};

export async function blogListingMetadata(
  page: number,
  category?: BlogCategory,
): Promise<Metadata> {
  const t = await getTranslations("Pagination");
  let metadata = await staticPageMetadata("blog");
  if (category) {
    const tCategories = await getTranslations("BlogCategories");
    const label = tCategories(category);
    metadata = buildMetadata({
      title: typeof metadata.title === "string" ? `${label} – ${metadata.title}` : label,
      description: metadata.description ?? undefined,
      path: blogCategoryPath(category),
      locale: await getSeoLocale(),
    });
  }
  return paginatedMetadata(metadata, page, t("page", { page }));
}

// The listing with its ?page= read per request: the layout and this
// skeleton are prerendered, and the (cached) posts stream in. The category
// pills don't depend on the page, so they're prerendered as-is rather
// than skeletoned.
export async function SuspendedBlogListing(props: {
  locale: string;
  searchParams: PageSearchParams;
  category?: BlogCategory;
}) {
  const [categories, { posts }] = await Promise.all([
    getBlogCategories(props.locale),
    getBlogListing(props.locale, 1, props.category),
  ]);

  // The posts stream in after the shell, so the browser would only find the
  // featured (LCP) image late. Preload it from the shell instead. It's page 1's
  // image because the shell can't read ?page=, which is a small waste on later
  // pages. Same cached query as page 1 below, so no extra database read.
  const featured = posts[0]?.featuredImage;
  const featuredUrl = featured && typeof featured === "object" ? (featured as Media).url : null;
  if (featuredUrl) {
    const { props: image } = getImageProps({
      src: featuredUrl,
      alt: "",
      fill: true,
      sizes: BLOG_FEATURED_IMAGE_SIZES,
    });
    preload(image.src, {
      as: "image",
      imageSrcSet: image.srcSet,
      imageSizes: image.sizes,
      fetchPriority: "high",
    });
  }

  return (
    <Suspense
      fallback={
        <div className="py-32" aria-busy="true">
          <PageHeaderSkeleton />
          <BlogCategoryFilter
            categories={categories}
            active={props.category}
            className="mt-12"
          />
          <BlogGridSkeleton />
        </div>
      }
    >
      <BlogListingPage {...props} />
    </Suspense>
  );
}

async function BlogListingPage({
  searchParams,
  ...props
}: {
  locale: string;
  searchParams: PageSearchParams;
  category?: BlogCategory;
}) {
  return <BlogListing {...props} page={await getPage(searchParams)} />;
}

// Local API bypasses access control, so filter out drafts explicitly.
const published = { ...translated, _status: { equals: "published" } } satisfies Where;

// Every category with at least one post in this locale, for the filter.
// Cached across requests; refreshed when a post changes.
export async function getBlogCategories(locale: string) {
  "use cache";
  cmsCache("blog");
  const payload = await getPayload({ config });
  const { docs: categorized } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: { ...published, categories: { exists: true } },
    depth: 0,
    pagination: false,
    select: { categories: true },
  });
  const used = new Set(categorized.flatMap((post) => post.categories ?? []));
  return BLOG_CATEGORIES.filter((c) => used.has(c));
}

// Cached across requests; refreshed when a post changes.
async function getBlogListing(locale: string, page: number, category?: BlogCategory) {
  "use cache";
  cmsCache("blog", "users", "media");
  const payload = await getPayload({ config });

  const { docs: posts, totalPages } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: category ? { ...published, categories: { in: [category] } } : published,
    // depth 2 so the author's profile image comes back as a Media doc for
    // the card avatar; populate keeps the author to the fields cards use.
    depth: 2,
    populate: {
      users: { firstName: true, lastName: true, email: true, profileImage: true },
    },
    // Cards never show the post body, the largest column in the database.
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      featuredImage: true,
      author: true,
      categories: true,
    },
    limit: PAGE_SIZE,
    page,
    sort: "-publishedAt",
  });

  return { posts, totalPages };
}

export async function BlogListing({
  locale,
  page,
  category,
}: {
  locale: string;
  page: number;
  category?: BlogCategory;
}) {
  const tCategories = await getTranslations("BlogCategories");
  const tDescriptions = await getTranslations("BlogCategoryDescriptions");
  const tBlog = await getTranslations("Blog28");
  const [categories, { posts, totalPages }] = await Promise.all([
    getBlogCategories(locale),
    getBlogListing(locale, page, category),
  ]);

  if (page > 1 && page > totalPages) notFound();

  const items: Blog28Post[] = posts.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === "object"
        ? (post.featuredImage as Media)
        : null;

    return {
      date: formatDate(post.publishedAt, locale),
      publishedAt: post.publishedAt ?? undefined,
      author: authorName(post.author),
      authorAvatar: authorAvatar(post.author),
      title: post.title,
      image: image?.url ?? "",
      link: `/blog/${post.slug ?? post.id}`,
      description: post.excerpt ?? "",
      categories: (post.categories ?? []).map((c) => tCategories(c)),
    };
  });

  const seoLocale = await getSeoLocale();

  return (
    <>
      {category ? (
        <JsonLd
          data={graph(
            await pageBreadcrumbs(seoLocale, [
              "blog",
              { name: tCategories(category), path: blogCategoryPath(category) },
            ]),
          )}
        />
      ) : (
        <StaticPageJsonLd
          page="blog"
          items={posts.map((post) => ({
            name: post.title,
            path: `/blog/${post.slug ?? post.id}`,
          }))}
        />
      )}
      <Blog28
        // Category pages get their own h1 instead of the generic "Blog".
        heading={category ? tCategories(category) : undefined}
        description={category ? tDescriptions(category) : tBlog("description")}
        posts={items}
        filters={<BlogCategoryFilter categories={categories} active={category} />}
      >
        <PaginationNav
          basePath={category ? blogCategoryPath(category) : "/blog"}
          page={page}
          totalPages={totalPages}
        />
      </Blog28>
    </>
  );
}
