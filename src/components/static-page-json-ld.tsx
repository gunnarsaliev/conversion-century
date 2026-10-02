import { JsonLd } from "@/components/json-ld";
import { getSeoLocale, pageBreadcrumbs, type StaticPageKey } from "@/lib/seo/pages";
import { graph, organizationSchema, websiteSchema } from "@/lib/seo/schema";

// Home carries the Organization + WebSite nodes; every other static page
// gets its breadcrumb trail.
export async function StaticPageJsonLd({ page }: { page: StaticPageKey }) {
  const locale = await getSeoLocale();

  if (page === "home") {
    return <JsonLd data={graph(organizationSchema(locale), websiteSchema(locale))} />;
  }

  return <JsonLd data={graph(await pageBreadcrumbs(locale, [page]))} />;
}
