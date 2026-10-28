import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const PAGE_SIZE = 12;

export type PageSearchParams = Promise<{ page?: string | string[] }>;

// `?page=N` → N. Missing means page 1; anything that isn't a positive
// integer 404s rather than silently showing page 1 under another URL.
export async function getPage(searchParams: PageSearchParams) {
  const { page } = await searchParams;
  if (page === undefined) return 1;
  if (typeof page !== "string" || !/^[1-9]\d*$/.test(page)) notFound();
  return Number(page);
}

// Pages after the first get a self-referencing canonical and a distinct
// title. hreflang is dropped: the other locale's page N can hold different
// items, or not exist at all.
export function paginatedMetadata(
  metadata: Metadata,
  page: number,
  pageLabel: string,
): Metadata {
  if (page <= 1) return metadata;
  const canonical = metadata.alternates?.canonical;
  const url = typeof canonical === "string" ? `${canonical}?page=${page}` : undefined;
  return {
    ...metadata,
    title:
      typeof metadata.title === "string"
        ? `${metadata.title} – ${pageLabel}`
        : metadata.title,
    alternates: { canonical: url },
    openGraph: { ...metadata.openGraph, ...(url && { url }) },
  };
}
