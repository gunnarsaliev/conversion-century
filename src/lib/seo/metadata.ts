import type { Metadata } from "next";

import {
  IS_INDEXABLE,
  OG_LOCALES,
  SITE_NAME,
  SITE_URL,
  alternateLanguages,
  localizedUrl,
  type Locale,
  type LocalizedPath,
} from "./site";

type BuildMetadataOptions = {
  title: string;
  description?: string | null;
  path: LocalizedPath;
  locale: Locale;
  image?: { url: string; alt?: string | null; width?: number | null; height?: number | null } | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
};

// Canonical + hreflang, Open Graph, Twitter and robots for a public page.
export function buildMetadata({
  title,
  description,
  path,
  locale,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataOptions): Metadata {
  const url = localizedUrl(path, locale);
  const otherLocale: Locale = locale === "bg" ? "en" : "bg";
  // Always set explicitly: page-level openGraph replaces the parent's, so
  // fall back to the generated default image (src/app/og-default.png).
  const images = image?.url
    ? [
        {
          url: image.url,
          alt: image.alt ?? title,
          width: image.width ?? undefined,
          height: image.height ?? undefined,
        },
      ]
    : [
        {
          url: `${SITE_URL}/og-default.png`,
          alt: SITE_NAME,
          width: 1200,
          height: 630,
        },
      ];

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: url,
      languages: alternateLanguages(path),
    },
    openGraph: {
      title,
      description: description || undefined,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale: OG_LOCALES[otherLocale],
      images,
      ...(type === "article"
        ? {
            type: "article",
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: images.map((i) => i.url),
    },
    robots: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
  };
}

// Picks `{ url, alt, width, height }` out of a populated upload field.
export function mediaImage(value: unknown) {
  if (!value || typeof value !== "object" || !("url" in value)) return null;
  const media = value as {
    url?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  };
  if (!media.url) return null;
  return { url: media.url, alt: media.alt, width: media.width, height: media.height };
}

// Meta descriptions should stay around 155 characters.
export function truncate(text: string | null | undefined, max = 160) {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}
