import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

// Search engines may only index the site once this is explicitly turned on
// at launch. Until then every page is noindex and robots.txt blocks all.
export const IS_INDEXABLE = process.env.SITE_INDEXABLE === "true";

// Production origin, used for canonical URLs, hreflang, the sitemap and
// JSON-LD ids. NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging domain).
const DEFAULT_SITE_URL = "https://www.cc-hub.online";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "Conversion Century";

// Company details as published in the legal pages (src/components/legal).
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "Conversion Century Ltd.",
  vatID: "BG203901347",
  email: "info@conversion-century.com",
  telephone: "+359 896 150 980",
  address: {
    streetAddress: "Yakubitsa 19",
    addressLocality: "Sofia",
    addressCountry: "BG",
  },
  // Same asset as the footer logo (src/components/footer3.tsx).
  logo: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/conversion-century-logo.svg",
  sameAs: ["https://www.linkedin.com/company/conversion-century/"],
};

export const OG_LOCALES: Record<Locale, string> = {
  bg: "bg_BG",
  en: "en_US",
};

// One path shared by both locales (static pages), or a path per locale the
// page exists in (detail pages leave out locales they aren't translated to).
export type LocalizedPath = string | Partial<Record<Locale, string>>;

export function localesOf(path: LocalizedPath): Locale[] {
  return routing.locales.filter((locale) => pathFor(path, locale) !== undefined);
}

function pathFor(path: LocalizedPath, locale: Locale) {
  return typeof path === "string" ? path : path[locale];
}

// Absolute URL for an internal href (e.g. "/blog/foo") in a locale.
// en is the default locale and has no prefix; bg is served under /bg.
// A locale the page doesn't exist in falls back to one it does.
export function localizedUrl(path: LocalizedPath, locale: Locale) {
  const href =
    pathFor(path, locale) ?? pathFor(path, localesOf(path)[0] ?? locale) ?? "/";
  const pathname = getPathname({ href, locale });
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}

// hreflang alternates for the locales the page exists in. x-default is the
// default locale's version, or the only one there is.
export function alternateLanguages(path: LocalizedPath) {
  const locales = localesOf(path);
  const xDefault = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : locales[0];
  return {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizedUrl(path, locale)]),
    ),
    ...(xDefault && { "x-default": localizedUrl(path, xDefault) }),
  };
}

// Author page path: by slug, or by id for users saved before slugs existed.
export function authorPath(author: { id: number | string; slug?: string | null }) {
  return `/authors/${author.slug || author.id}`;
}

export function toLocale(locale: string): Locale {
  return locale === "en" ? "en" : "bg";
}
