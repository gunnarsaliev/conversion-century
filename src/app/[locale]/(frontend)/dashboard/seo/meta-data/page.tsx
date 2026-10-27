import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import {
  MetaDataEditor,
  type MetaEntry,
  type MetaGroup,
} from "@/components/dashboard/meta-data-editor";
import { SeoPageHeader } from "@/components/dashboard/seo-page-header";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardLocale, getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdminOrEditor } from "@/lib/roles";
import { SEO_COLLECTIONS, SEO_COLLECTION_SLUGS } from "@/lib/seo/collection-meta";
import { SEO_PAGES, SEO_PAGE_KEYS } from "@/lib/seo/page-keys";
import { docPathFromSlugs } from "@/lib/seo/pages";
import { SITE_NAME, SITE_URL, type Locale } from "@/lib/seo/site";

// ---------------------------------------------------------------------------
// SEO → Meta data
// ---------------------------------------------------------------------------
//
// Meta title/description in both languages for:
// - static and docs pages (`page-meta` overrides; empty = the default from
//   messages/<locale>.json → Metadata, shown as the placeholder), and
// - collection detail pages, editing each doc's existing `meta` group in
//   place (empty = the page's own title/summary fallback).
// Saved through ./actions. Admins and editors only.

const LOCALES: Locale[] = ["en", "bg"];

// `{ en, bg }` → string per locale, for fields read with `locale: "all"`.
const perLocale = (value: unknown, locale: Locale) =>
  value && typeof value === "object"
    ? String((value as Record<string, unknown>)[locale] ?? "")
    : "";

// The public URL of a path in a locale (en is unprefixed).
const localeHref = (path: string, locale: Locale) =>
  locale === "en" ? path : `/bg${path === "/" ? "" : path}`;

export default async function MetaDataPage() {
  const user = await requireDashboardUser();
  if (!isAdminOrEditor(user)) notFound();

  const t = await getDashboardTranslations("Seo.metaData");
  const dashboardLocale = await getDashboardLocale();
  const payload = await getPayload({ config });

  const [tNames, tEn, tBg, pageMeta, collectionDocs] = await Promise.all([
    getTranslations({ locale: dashboardLocale, namespace: "Metadata" }),
    getTranslations({ locale: "en", namespace: "Metadata" }),
    getTranslations({ locale: "bg", namespace: "Metadata" }),
    payload.find({ collection: "page-meta", locale: "all", depth: 0, pagination: false }),
    Promise.all(
      SEO_COLLECTION_SLUGS.map((slug) =>
        payload.find({
          collection: slug,
          locale: "all",
          depth: 0,
          pagination: false,
          sort: "-updatedAt",
          select: { [SEO_COLLECTIONS[slug].titleField]: true, slug: true, meta: true },
        }),
      ),
    ),
  ]);
  const defaults = { en: tEn, bg: tBg };
  const savedPages = new Map(pageMeta.docs.map((doc) => [doc.page, doc]));

  const pages: MetaEntry[] = SEO_PAGE_KEYS.map((key) => {
    const saved = savedPages.get(key);
    return {
      id: `page:${key}`,
      target: { kind: "page", page: key },
      label: tNames(`${key}.name`),
      href: { en: localeHref(SEO_PAGES[key], "en"), bg: localeHref(SEO_PAGES[key], "bg") },
      values: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          {
            title: perLocale(saved?.title, locale),
            description: perLocale(saved?.description, locale),
          },
        ]),
      ) as MetaEntry["values"],
      placeholders: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          {
            title: defaults[locale](`${key}.title`),
            description: defaults[locale](`${key}.description`),
          },
        ]),
      ) as MetaEntry["placeholders"],
    };
  });

  const collections: MetaGroup[] = SEO_COLLECTION_SLUGS.map((slug, index) => {
    const { titleField, basePath } = SEO_COLLECTIONS[slug];
    return {
      slug,
      label: t(`collectionNames.${slug}`),
      entries: collectionDocs[index].docs.map((doc) => {
        const record = doc as unknown as Record<string, unknown> & {
          id: number;
          meta?: { title?: unknown; description?: unknown };
        };
        const paths = docPathFromSlugs(basePath, record.slug, record.id);
        const titles = Object.fromEntries(
          LOCALES.map((locale) => [locale, perLocale(record[titleField], locale)]),
        ) as Record<Locale, string>;
        return {
          id: `${slug}:${record.id}`,
          target: { kind: "collection", collection: slug, id: record.id },
          label: titles[dashboardLocale] || titles.en || titles.bg || t("untitled"),
          // Untranslated docs have no path in that locale; link the
          // other locale's slug so editors still see where it would go.
          href: {
            en: localeHref(paths.en ?? paths.bg!, "en"),
            bg: localeHref(paths.bg ?? paths.en!, "bg"),
          },
          values: Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              {
                title: perLocale(record.meta?.title, locale),
                description: perLocale(record.meta?.description, locale),
              },
            ]),
          ) as MetaEntry["values"],
          placeholders: Object.fromEntries(
            LOCALES.map((locale) => [locale, { title: titles[locale] }]),
          ) as MetaEntry["placeholders"],
        };
      }),
    };
  });

  return (
    <>
      <SeoPageHeader title={t("title")} description={t("description")} />
      <MetaDataEditor
        groups={[{ slug: "pages", label: t("pagesTab"), entries: pages }, ...collections]}
        siteUrl={SITE_URL}
        siteName={SITE_NAME}
      />
    </>
  );
}
