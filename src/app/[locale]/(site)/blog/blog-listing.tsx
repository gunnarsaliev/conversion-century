import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Blog28, type Blog28Post } from "@/components/blog28";
import { BlogCategoryFilter } from "@/components/blog-category-filter";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { BLOG_CATEGORIES, blogCategoryPath, type BlogCategory } from "@/lib/blog-categories";
import { PAGE_SIZE, paginatedMetadata } from "@/lib/pagination";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSeoLocale, pageBreadcrumbs, staticPageMetadata } from "@/lib/seo/pages";
import { graph } from "@/lib/seo/schema";
import { translated } from "@/utilities/findByLocalizedSlug";
import type { Media, User } from "../../../../../payload-types";

// The blog listing, shared by /blog and the category pages /blog/<category>
// (served by blog/[slug], since categories and posts share that segment).

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
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

export async function BlogListing({
  page,
  category,
}: {
  page: number;
  category?: BlogCategory;
}) {
  const locale = await getLocale();
  const payload = await getPayload({ config });
  const tCategories = await getTranslations("BlogCategories");

  // Every category with at least one post in this locale, for the filter.
  const { docs: categorized } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: { ...translated, categories: { exists: true } },
    depth: 0,
    pagination: false,
    select: { categories: true },
  });
  const used = new Set(categorized.flatMap((post) => post.categories ?? []));
  const categories = BLOG_CATEGORIES.filter((c) => used.has(c));

  const { docs: posts, totalPages } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: category ? { ...translated, categories: { in: [category] } } : translated,
    depth: 1,
    limit: PAGE_SIZE,
    page,
    sort: "-publishedAt",
    // Local API calls bypass access control by default; the collection's
    // own `read` access already restricts logged-out visitors to
    // published posts, so this still only ever serves public content.
  });

  if (page > 1 && page > totalPages) notFound();

  const items: Blog28Post[] = posts.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === "object"
        ? (post.featuredImage as Media)
        : null;

    return {
      date: formatDate(post.publishedAt, locale),
      author: authorName(post.author),
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
        <StaticPageJsonLd page="blog" />
      )}
      <Blog28
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
