import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { translated } from "@/utilities/findByLocalizedSlug";
import { cmsCache } from "./cache";

type SluggedCollection =
  | "blog"
  | "case-studies"
  | "events"
  | "industries"
  | "job-listings"
  | "services"
  | "solutions";

// Collections with drafts enabled; the local API bypasses access control,
// so drafts are filtered out explicitly.
const WITH_DRAFTS = new Set<SluggedCollection>(["blog", "events", "industries"]);

// Slugs of the docs published in `locale`, for a detail route's
// generateStaticParams. Cached across requests.
export async function getPublishedSlugs(collection: SluggedCollection, locale: string) {
  "use cache";
  cmsCache(collection);
  const payload = await getPayload({ config });
  const where: Where = WITH_DRAFTS.has(collection)
    ? { ...translated, _status: { equals: "published" } }
    : translated;
  const { docs } = await payload.find({
    collection,
    locale: locale as "en" | "bg",
    where,
    depth: 0,
    pagination: false,
    select: { slug: true },
  });
  return docs.flatMap((doc) => {
    const slug = (doc as { slug?: string | null }).slug;
    return slug ? [slug] : [];
  });
}

// generateStaticParams for a [slug] route under [locale]. Cache Components
// needs at least one param to validate the route at build time, so a
// collection with no docs yet falls back to a placeholder that 404s.
export function slugStaticParams(collection: SluggedCollection) {
  return async ({ params }: { params: { locale: string } }) => {
    const slugs = await getPublishedSlugs(collection, params.locale);
    return (slugs.length > 0 ? slugs : ["_"]).map((slug) => ({ slug }));
  };
}
