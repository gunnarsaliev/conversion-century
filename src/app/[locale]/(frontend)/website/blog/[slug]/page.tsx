import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Blogpost5 } from "@/components/blogpost5";
import type { Media } from "../../../../../../../payload-types";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
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

  const post = docs[0] ?? null;

  if (!post) {
    notFound();
  }

  const featuredImage =
    post.featuredImage && typeof post.featuredImage === "object"
      ? (post.featuredImage as Media)
      : null;

  const author =
    post.author && typeof post.author === "object" ? post.author : null;

  const authorName = author
    ? [author.firstName, author.lastName].filter(Boolean).join(" ") ||
      author.email
    : undefined;

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

  return (
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
  );
}
