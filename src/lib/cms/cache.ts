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
// revalidate.ts). The hourly lifetime is only a safety net for edits that
// bypass Payload's hooks, e.g. direct database writes or migrations.
export function cmsCache(...collections: CmsCollection[]) {
  cacheLife("hours");
  cacheTag("cms", ...collections);
}
