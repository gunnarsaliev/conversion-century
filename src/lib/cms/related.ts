import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { translated } from "@/utilities/findByLocalizedSlug";
import type { Media } from "../../../payload-types";

export interface RelatedItem {
  title: string;
  href: string;
  image?: string;
  description?: string;
}

type RelatedCollection = "industries" | "services" | "solutions";

// Three random docs from `collection` other than `excludeId`, for the
// "Check other …" section at the end of a detail page. The pick is made
// inside the cache, so it stays the same until the collection changes (or
// the cache expires) rather than changing on every request — which keeps
// the detail pages prerendered.
export async function getRelated(
  collection: RelatedCollection,
  locale: string,
  excludeId: number,
): Promise<RelatedItem[]> {
  "use cache";
  cmsCache(collection, "media");
  const payload = await getPayload({ config });

  // Local API bypasses access control, so hide industry drafts explicitly.
  const where: Where = { ...translated, id: { not_equals: excludeId } };
  if (collection === "industries") where._status = { equals: "published" };

  const { docs } = await payload.find({
    collection,
    locale: locale as "en" | "bg",
    where,
    depth: 1,
    pagination: false,
  });

  // Fisher–Yates shuffle, then take the first three.
  for (let i = docs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [docs[i], docs[j]] = [docs[j], docs[i]];
  }

  return docs.slice(0, 3).map((doc) => ({
    title: "title" in doc ? doc.title : doc.name,
    href: `/${collection}/${doc.slug ?? doc.id}`,
    image:
      doc.image && typeof doc.image === "object"
        ? ((doc.image as Media).url ?? undefined)
        : undefined,
    description: doc.meta?.description ?? undefined,
  }));
}
