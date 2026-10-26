import { cache } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { buildMetadata } from "./metadata";
import { breadcrumbSchema, type Crumb } from "./schema";
import { STATIC_PAGES, type SeoPageKey, type StaticPageKey } from "./page-keys";
import { toLocale, type Locale, type LocalizedPath } from "./site";

export { SEO_PAGES, STATIC_PAGES, type SeoPageKey, type StaticPageKey } from "./page-keys";

export async function getSeoLocale(): Promise<Locale> {
  return toLocale(await getLocale());
}

// Overrides saved in Dashboard → SEO → Meta data (the `page-meta`
// collection), keyed by page. Cached per request. If the lookup fails (e.g.
// the migration hasn't run yet) pages fall back to their defaults instead of
// erroring.
export const getPageMetaOverrides = cache(async (locale: Locale) => {
  const payload = await getPayload({ config });
  try {
    const { docs } = await payload.find({
      collection: "page-meta",
      locale,
      depth: 0,
      pagination: false,
      select: { page: true, title: true, description: true },
    });
    return new Map(docs.map((doc) => [doc.page as SeoPageKey, doc]));
  } catch (error) {
    payload.logger.error({ err: error, msg: "page-meta lookup failed; using default metadata" });
    return new Map<SeoPageKey, { title?: string | null; description?: string | null }>();
  }
});

// Title/description for a page: the dashboard override, else the default
// from messages/{locale}.json → Metadata.
async function seoPageText(key: SeoPageKey, locale: Locale) {
  const [t, overrides] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getPageMetaOverrides(locale),
  ]);
  const override = overrides.get(key);
  return {
    title: override?.title || t(`${key}.title`),
    description: override?.description || t(`${key}.description`),
  };
}

// generateMetadata for a static page.
export async function staticPageMetadata(key: StaticPageKey): Promise<Metadata> {
  const locale = await getSeoLocale();
  return buildMetadata({
    ...(await seoPageText(key, locale)),
    path: STATIC_PAGES[key],
    locale,
  });
}

// generateMetadata for a docs page: title/description only. The docs area is
// internal and stays noindex (see docs/layout.tsx), so no canonical/hreflang.
export async function docsPageMetadata(key: Exclude<SeoPageKey, StaticPageKey>): Promise<Metadata> {
  return seoPageText(key, await getSeoLocale());
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
// Returns `{ bg: '/blog/<bg-slug>', en: '/blog/<en-slug>' }`.
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
