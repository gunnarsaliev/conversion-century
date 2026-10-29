import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { CaseStudies13, type CaseStudies13Item } from "@/components/case-studies13";
import type { Media } from "../../../../../payload-types";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { translated } from "@/utilities/findByLocalizedSlug";

export async function generateMetadata() {
  return staticPageMetadata("industries");
}

// Cached across requests; refreshed when the collection changes.
async function getIndustries(locale: string) {
  "use cache";
  cmsCache("industries", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "industries",
    locale: locale as "en" | "bg",
    where: { _status: { equals: "published" }, ...translated },
    depth: 1,
    limit: 100,
    sort: "title",
    select: {
      title: true,
      slug: true,
      image: true,
      meta: true,
    },
  });
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("IndustriesPage");

  const { docs: industries } = await getIndustries(locale);

  const items: CaseStudies13Item[] = industries.map((industry) => {
    const image =
      industry.image && typeof industry.image === "object"
        ? (industry.image as Media)
        : null;

    return {
      title: industry.title,
      overview: industry.meta?.description ?? undefined,
      image: image?.url ?? undefined,
      href: `/industries/${industry.slug ?? industry.id}`,
    };
  });

  return (
    <>
      <StaticPageJsonLd
        page="industries"
        items={industries.map((industry) => ({
          name: industry.title,
          path: `/industries/${industry.slug ?? industry.id}`,
        }))}
      />
      <CaseStudies13
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        cases={items}
        imageClassName="aspect-square"
      />
    </>
  );
}
