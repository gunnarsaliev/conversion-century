import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Blog28, type Blog28Post } from "@/components/blog28";
import { PaginationNav } from "@/components/pagination-nav";
import type { Media, User } from "../../../../../payload-types";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import {
  PAGE_SIZE,
  getPage,
  paginatedMetadata,
  type PageSearchParams,
} from "@/lib/pagination";
import { translated } from "@/utilities/findByLocalizedSlug";

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

type BlogPageProps = {
  searchParams: PageSearchParams;
};

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const page = await getPage(searchParams);
  const t = await getTranslations("Pagination");
  return paginatedMetadata(await staticPageMetadata("blog"), page, t("page", { page }));
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = await getPage(searchParams);
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: posts, totalPages } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: translated,
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
    };
  });

  return (
    <>
      <StaticPageJsonLd page="blog" />
      <Blog28 posts={items}>
        <PaginationNav basePath="/blog" page={page} totalPages={totalPages} />
      </Blog28>
    </>
  );
}
