import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Blog28, type Blog28Post } from "@/components/blog28";
import type { Media, User } from "../../../../../../payload-types";

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

export default async function BlogPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: posts } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    depth: 1,
    limit: 100,
    sort: "-publishedAt",
    // Local API calls bypass access control by default; the collection's
    // own `read` access already restricts logged-out visitors to
    // published posts, so this still only ever serves public content.
  });

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
      link: `/website/blog/${post.slug ?? post.id}`,
      description: post.excerpt ?? "",
    };
  });

  return <Blog28 posts={items} />;
}
