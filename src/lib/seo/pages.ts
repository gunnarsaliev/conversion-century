import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";

import { buildMetadata } from "./metadata";
import { breadcrumbSchema, type Crumb } from "./schema";
import { STATIC_PAGES, type SeoPageKey, type StaticPageKey } from "./page-keys";
import { toLocale, type Locale, type LocalizedPath } from "./site";

export { SEO_PAGES, STATIC_PAGES, type SeoPageKey, type StaticPageKey } from "./page-keys";

export async function getSeoLocale(): Promise<Locale> {
  return toLocale(await getLocale());
}

// Overrides saved in Dashboard → SEO → Meta data (the `page-meta`
// collection), keyed by page. Cached across requests. If the lookup fails
// (e.g. the migration hasn't run yet) pages fall back to their defaults
// instead of erroring.
async function pageMetaDocs(locale: Locale) {
  "use cache";
  cmsCache("page-meta");
  const payload = await getPayload({ config });
  try {
    const { docs } = await payload.find({
      collection: "page-meta",
      locale,
      depth: 0,
      pagination: false,
      select: { page: true, title: true, description: true },
    });
    return docs;
  } catch (error) {
    payload.logger.error({ err: error, msg: "page-meta lookup failed; using default metadata" });
    return [];
  }
}

export async function getPageMetaOverrides(locale: Locale) {
  const docs: Array<{ page?: unknown; title?: string | null; description?: string | null }> =
    await pageMetaDocs(locale);
  return new Map(docs.map((doc) => [doc.page as SeoPageKey, doc]));
}

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
// Cached across requests: generateMetadata and the page both need it.
export async function localizedDocPath(
  collection: SluggedCollection,
  id: number | string,
  basePath: string,
): Promise<LocalizedPath> {
  "use cache";
  cmsCache(collection);
  const payload = await getPayload({ config });
  const doc = await payload.findByID({
    collection,
    id,
    locale: "all",
    depth: 0,
    select: { slug: true },
  });
  return docPathFromSlugs(basePath, (doc as { slug?: unknown }).slug, id);
}

export function docPathFromSlugs(
  basePath: string,
  slugs: unknown,
  id: number | string,
): Partial<Record<Locale, string>> {
  const map = (slugs && typeof slugs === "object" ? slugs : {}) as Partial<
    Record<Locale, string | null>
  >;
  // Only locales with a slug of their own: the doc isn't translated into the
  // others (see utilities/findByLocalizedSlug). Docs without any slug keep
  // their id-based URL.
  const paths = Object.fromEntries(
    Object.entries(map)
      .filter(([, slug]) => slug)
      .map(([locale, slug]) => [locale, `${basePath}/${slug}`]),
  ) as Partial<Record<Locale, string>>;
  return Object.keys(paths).length
    ? paths
    : { bg: `${basePath}/${id}`, en: `${basePath}/${id}` };
}
