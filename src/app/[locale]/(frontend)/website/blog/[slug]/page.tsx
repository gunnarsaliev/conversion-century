import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Blogpost5 } from "@/components/blogpost5";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { blogPostingSchema, graph, personSchema } from "@/lib/seo/schema";
import { toLocale } from "@/lib/seo/site";
import type { Media } from "../../../../../../../payload-types";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

// Shared by generateMetadata and the page so the lookup runs once per
// request.
const getPost = cache(async (slug: string, locale: string) => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    // Local API bypasses access control; the collection's own `read`
    // access already restricts logged-out visitors to published posts.
  });

  return docs[0] ?? null;
});

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPost(slug, locale);

  if (!post) return {};

  return buildMetadata({
    title: post.meta?.title || post.title,
    description: post.meta?.description || truncate(post.excerpt),
    path: await localizedDocPath("blog", post.id, "/website/blog"),
    locale: toLocale(locale),
    image: mediaImage(post.featuredImage),
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
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

  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : undefined;

  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("blog", post.id, "/website/blog");

  return (
    <>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ["blog", { name: post.title, path }]),
          blogPostingSchema({
            locale: seoLocale,
            path,
            headline: post.title,
            description: post.meta?.description || post.excerpt,
            image: featuredImage?.url,
            datePublished: post.publishedAt ?? post.createdAt,
            dateModified: post.updatedAt,
            author:
              author && authorFullName
                ? personSchema({
                    locale: seoLocale,
                    id: author.id,
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
        authorId={author?.id}
        dateLabel={dateLabel}
        featuredImage={featuredImage?.url ?? undefined}
        content={post.content ?? undefined}
        locale={locale as "en" | "bg"}
      />
    </>
  );
}
