import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";
import { translated } from "@/utilities/findByLocalizedSlug";
import type { Media, User } from "../../payload-types";

const WORDS_PER_MINUTE = 200;

const authorName = (author: number | User | null | undefined) => {
  if (!author || typeof author !== "object") return "";
  return [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email;
};

const authorAvatar = (author: number | User | null | undefined) => {
  if (!author || typeof author !== "object") return undefined;
  return typeof author.profileImage === "object" && author.profileImage?.url
    ? author.profileImage.url
    : undefined;
};

// The latest published posts as Blog12 cards (home page, end of each post),
// optionally leaving one post out. Read times are returned in minutes and
// formatted by the caller. Cached across requests.
export async function getLatestBlogPosts(
  locale: string,
  { limit = 3, excludeId }: { limit?: number; excludeId?: number } = {},
) {
  "use cache";
  cmsCache("blog", "users", "media");
  const payload = await getPayload({ config });

  const where: Where = { ...translated, _status: { equals: "published" } };
  if (excludeId !== undefined) where.id = { not_equals: excludeId };

  const { docs } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    // Local API bypasses access control, so filter out drafts explicitly.
    where,
    // depth: 2 so post.author.profileImage resolves to a Media object
    // (not just an ID) for the author avatar.
    depth: 2,
    limit,
    sort: "-publishedAt",
  });

  return docs.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === "object"
        ? (post.featuredImage as Media)
        : null;
    const wordCount = richTextToPlainText(post.content).split(/\s+/).filter(Boolean).length;

    return {
      title: post.title,
      description: post.excerpt ?? "",
      image: image?.url ?? undefined,
      author: authorName(post.author),
      authorAvatar: authorAvatar(post.author),
      readMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
      link: `/blog/${post.slug ?? post.id}`,
    };
  });
}
