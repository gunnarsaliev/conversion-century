import { notFound, permanentRedirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import { blogCategoryPath, isBlogCategory } from "@/lib/blog-categories";
import { getPage, type PageSearchParams } from "@/lib/pagination";
import { toLocale } from "@/lib/seo/site";
import { BlogListing, blogListingMetadata } from "./blog-listing";

type BlogPageProps = {
  searchParams: PageSearchParams;
};

export async function generateMetadata({ searchParams }: BlogPageProps) {
  return blogListingMetadata(await getPage(searchParams));
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Categories used to be `?category=`; they now live at /blog/<category>.
  const { category } = await searchParams;
  if (category !== undefined) {
    if (!isBlogCategory(category)) notFound();
    const page = await getPage(searchParams);
    const pathname = getPathname({
      href: blogCategoryPath(category),
      locale: toLocale(await getLocale()),
    });
    permanentRedirect(page > 1 ? `${pathname}?page=${page}` : pathname);
  }

  return <BlogListing page={await getPage(searchParams)} />;
}
