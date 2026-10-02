import { cache } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { buildMetadata } from "./metadata";
import { breadcrumbSchema, type Crumb } from "./schema";
import { toLocale, type Locale, type LocalizedPath } from "./site";

// Static public pages: href + key into the `Metadata` messages namespace.
export const STATIC_PAGES = {
  home: "/website",
  about: "/website/about",
  services: "/website/services",
  solutions: "/website/solutions",
  industries: "/website/industries",
  caseStudies: "/website/case-studies",
  blog: "/website/blog",
  team: "/website/team",
  clients: "/website/clients",
  reviews: "/website/reviews",
  openPositions: "/website/open-positions",
  bookAConsultation: "/website/book-a-consultation",
  eventsAndMedia: "/website/events-and-media",
} as const;

export type StaticPageKey = keyof typeof STATIC_PAGES;

export async function getSeoLocale(): Promise<Locale> {
  return toLocale(await getLocale());
}

// generateMetadata for a static page, from messages/{locale}.json.
export async function staticPageMetadata(key: StaticPageKey): Promise<Metadata> {
  const locale = await getSeoLocale();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildMetadata({
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    path: STATIC_PAGES[key],
    locale,
  });
}

// BreadcrumbList for a page: Home › (sections…) › (current page).
// `trail` entries are either a static page key or an explicit crumb.
export async function pageBreadcrumbs(
  locale: Locale,
  trail: Array<StaticPageKey | Crumb>,
) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return breadcrumbSchema(
    locale,
    t("home.name"),
    trail.map((item) =>
      typeof item === "string"
        ? { name: t(`${item}.name`), path: STATIC_PAGES[item] }
        : item,
    ),
  );
}

type SluggedCollection =
  | "blog"
  | "services"
  | "solutions"
  | "industries"
  | "case-studies"
  | "events"
  | "job-listings";

// Slugs are localized, so a detail page has a different URL per locale.
// Returns `{ bg: '/website/blog/<bg-slug>', en: '/website/blog/<en-slug>' }`.
// Cached per request: generateMetadata and the page both need it.
export const localizedDocPath = cache(async (
  collection: SluggedCollection,
  id: number | string,
  basePath: string,
): Promise<LocalizedPath> => {
  const payload = await getPayload({ config });
  const doc = await payload.findByID({
    collection,
    id,
    locale: "all",
    depth: 0,
    select: { slug: true },
  });
  return docPathFromSlugs(basePath, (doc as { slug?: unknown }).slug, id);
});

export function docPathFromSlugs(
  basePath: string,
  slugs: unknown,
  id: number | string,
): Record<Locale, string> {
  const map = (slugs && typeof slugs === "object" ? slugs : {}) as Partial<
    Record<Locale, string | null>
  >;
  const fallback = map.bg || map.en || String(id);
  return {
    bg: `${basePath}/${map.bg || fallback}`,
    en: `${basePath}/${map.en || fallback}`,
  };
}
