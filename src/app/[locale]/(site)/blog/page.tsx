import { setRequestLocale } from "next-intl/server";

import { getPage, type PageSearchParams } from "@/lib/pagination";
import { SuspendedBlogListing, blogListingMetadata } from "./blog-listing";

// The old `?category=` URLs are redirected to /blog/<category> in
// next.config.mjs.

type BlogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: PageSearchParams;
};

export async function generateMetadata({ searchParams }: BlogPageProps) {
  return blogListingMetadata(await getPage(searchParams));
}

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SuspendedBlogListing locale={locale} searchParams={searchParams} />;
}
