import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

// Search engines may only index the site once this is explicitly turned on
// (at launch, together with removing `website` from the login gate in
// src/proxy.ts). Until then every page is noindex and robots.txt blocks all.
export const IS_INDEXABLE = process.env.SITE_INDEXABLE === "true";

// Production origin, used for canonical URLs, hreflang, the sitemap and
// JSON-LD ids. NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging domain).
const DEFAULT_SITE_URL = "https://www.cc-hub.online";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/+$/,
  "",
);

export const SITE_NAME = "Conversion Century";

export const ORGANIZATION = {
  name: SITE_NAME,
  // Same asset as the footer logo (src/components/footer3.tsx).
  logo: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/conversion-century-logo.svg",
  sameAs: ["https://www.linkedin.com/company/conversion-century/"],
};

export const OG_LOCALES: Record<Locale, string> = {
  bg: "bg_BG",
  en: "en_US",
};

// A path per locale, or one path shared by both (static pages).
export type LocalizedPath = string | Record<Locale, string>;

export function pathFor(path: LocalizedPath, locale: Locale) {
  return typeof path === "string" ? path : path[locale];
}

// Absolute URL for an internal href (e.g. "/website/blog/foo") in a locale.
// bg is the default locale and has no prefix; en is served under /en.
export function localizedUrl(path: LocalizedPath, locale: Locale) {
  const pathname = getPathname({ href: pathFor(path, locale), locale });
  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}

export function alternateLanguages(path: LocalizedPath) {
  return {
    bg: localizedUrl(path, "bg"),
    en: localizedUrl(path, "en"),
    "x-default": localizedUrl(path, routing.defaultLocale),
  };
}

export function toLocale(locale: string): Locale {
  return locale === "en" ? "en" : "bg";
}
