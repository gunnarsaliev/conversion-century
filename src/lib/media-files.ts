import type { Media } from "../../payload-types";

// ---------------------------------------------------------------------------
// Media file helpers
// ---------------------------------------------------------------------------
//
// The R2 storage adapter only rewrites the top-level `url` (see
// generateFileURL in payload.config.ts) — `sizes.<name>.url` keeps pointing
// at Payload's local `/api/media/file/:filename` route, which 500s because
// `disableLocalStorage: true`. Build size URLs from the R2 key instead.

export const MEDIA_SIZES = ["original", "card", "thumbnail"] as const;
export type MediaSize = (typeof MEDIA_SIZES)[number];

export type MediaFile = {
  size: MediaSize;
  url: string;
  filename: string;
  width: number | null;
  height: number | null;
  filesize: number | null;
};

export type MediaHubItem = {
  id: number;
  title: string;
  alt: string | null;
  mimeType: string | null;
  createdAt: string;
  previewUrl: string | null;
  files: MediaFile[];
};

const r2Url = (doc: Media, filename: string) => {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) return null;
  const prefix = (doc as Media & { prefix?: string | null }).prefix;
  return `${base}/${prefix ? `${prefix}/${filename}` : filename}`;
};

export const getMediaFiles = (doc: Media): MediaFile[] => {
  const files: MediaFile[] = [];

  if (doc.url && doc.filename) {
    files.push({
      size: "original",
      url: doc.url,
      filename: doc.filename,
      width: doc.width ?? null,
      height: doc.height ?? null,
      filesize: doc.filesize ?? null,
    });
  }

  for (const size of ["card", "thumbnail"] as const) {
    const entry = doc.sizes?.[size];
    if (!entry?.filename) continue;
    const url = r2Url(doc, entry.filename) ?? entry.url;
    if (!url) continue;
    files.push({
      size,
      url,
      filename: entry.filename,
      width: entry.width ?? null,
      height: entry.height ?? null,
      filesize: entry.filesize ?? null,
    });
  }

  return files;
};

export const toMediaHubItem = (doc: Media, title?: string): MediaHubItem => {
  const files = getMediaFiles(doc);
  const preview =
    files.find((file) => file.size === "card") ??
    files.find((file) => file.size === "original");

  return {
    id: doc.id,
    title: title ?? doc.alt ?? doc.filename ?? `Media #${doc.id}`,
    alt: doc.alt ?? null,
    mimeType: doc.mimeType ?? null,
    createdAt: doc.createdAt,
    previewUrl: preview?.url ?? null,
    files,
  };
};
