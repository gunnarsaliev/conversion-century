import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import {
  STATIC_PAGES,
  getSeoLocale,
  pageBreadcrumbs,
  type StaticPageKey,
} from "@/lib/seo/pages";
import {
  collectionPageSchema,
  graph,
  organizationSchema,
  websiteSchema,
  type Crumb,
} from "@/lib/seo/schema";

// Home carries the Organization + WebSite nodes; every other static page
// gets its breadcrumb trail. Index pages pass the `items` they list, which
// adds a CollectionPage + ItemList node.
export async function StaticPageJsonLd({
  page,
  items,
}: {
  page: StaticPageKey;
  items?: Crumb[];
}) {
  const locale = await getSeoLocale();

  if (page === "home") {
    const t = await getTranslations({ locale, namespace: "LocaleLayout" });
    return (
      <JsonLd
        data={graph(organizationSchema(locale, t("description")), websiteSchema(locale))}
      />
    );
  }

  const breadcrumbs = await pageBreadcrumbs(locale, [page]);
  if (!items?.length) return <JsonLd data={graph(breadcrumbs)} />;

  const t = await getTranslations({ locale, namespace: "Metadata" });
  return (
    <JsonLd
      data={graph(
        breadcrumbs,
        collectionPageSchema({
          locale,
          path: STATIC_PAGES[page],
          name: t(`${page}.name`),
          items,
        }),
      )}
    />
  );
}
