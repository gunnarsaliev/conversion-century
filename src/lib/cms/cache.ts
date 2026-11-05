import { cacheLife, cacheTag } from "next/cache";

// Payload collections the public site reads. Each one is also the cache tag
// that src/lib/cms/revalidate.ts expires when a doc in it changes.
export type CmsCollection =
  | "blog"
  | "case-studies"
  | "clients"
  | "contacts"
  | "events"
  | "industries"
  | "job-listings"
  | "media"
  | "page-meta"
  | "services"
  | "solutions"
  | "testimonials"
  | "users";

// Call first thing inside a `'use cache'` function that reads Payload, with
// every collection it reads. Results stay cached across requests and are
// refreshed in the background when one of those collections changes (see
// revalidate.ts). The weekly lifetime is only a safety net for edits that
// bypass the deployed app's hooks (scripts, direct database writes,
// migrations); those show up after the next deploy or within a week. It is
// long on purpose: each re-render reads Neon, whose free plan allows 5 GB of
// network transfer a month, and crawlers would re-render every page hourly.
export function cmsCache(...collections: CmsCollection[]) {
  cacheLife("weeks");
  cacheTag("cms", ...collections);
}
