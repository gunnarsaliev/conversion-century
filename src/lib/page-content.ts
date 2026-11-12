import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { mediaUrl } from "@/lib/client-testimonials";
import type { AboutPage, HomePage } from "../../payload-types";

// The single documents of the `home-page` and `about-page` collections, in
// the given locale (Payload falls back to English per field). Each tab holds
// the copy and images of one page section; the sections fall back to their
// messages wherever a field is empty, and to them entirely while the
// document doesn't exist. Cached across requests.

export async function getHomePage(locale: string): Promise<HomePage | null> {
  "use cache";
  cmsCache("home-page", "media");
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "home-page",
    locale: locale as "en" | "bg",
    depth: 1,
    limit: 1,
  });
  return docs[0] ?? null;
}

export async function getAboutPage(locale: string): Promise<AboutPage | null> {
  "use cache";
  cmsCache("about-page", "media");
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "about-page",
    locale: locale as "en" | "bg",
    depth: 1,
    limit: 1,
  });
  return docs[0] ?? null;
}

// A section link from the CMS: both parts optional, the section supplies
// its own default for whichever is empty.
export type CmsLink = { label?: string | null; href?: string | null };

// An empty CMS field (null or "") as undefined, so a component's default
// prop value — its messages copy — applies.
export const filled = (value?: string | null) => value || undefined;

// An upload field as an image for a section: undefined until one is set.
export function cmsImage(image: unknown, alt?: string | null) {
  const src = mediaUrl(image);
  return src ? { src, alt: alt ?? "" } : undefined;
}
