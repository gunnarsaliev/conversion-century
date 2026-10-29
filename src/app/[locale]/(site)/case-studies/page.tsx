import { setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { CaseStudies13, type CaseStudies13Item } from "@/components/case-studies13";
import type { Client, Media } from "../../../../../payload-types";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { translated } from "@/utilities/findByLocalizedSlug";

export async function generateMetadata() {
  return staticPageMetadata("caseStudies");
}

// Cached across requests; refreshed when the collection changes.
async function getCaseStudies(locale: string) {
  "use cache";
  cmsCache("case-studies", "clients", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "case-studies",
    locale: locale as "en" | "bg",
    where: translated,
    depth: 1,
    limit: 100,
    sort: "-createdAt",
    select: {
      title: true,
      slug: true,
      client: true,
      image: true,
      overview: true,
      achievements: true,
    },
    // Clients is admin-only CRM data and the local API bypasses access
    // control, so only populate the client's public name.
    populate: {
      clients: { companyName: true },
    },
  });
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { docs: caseStudies } = await getCaseStudies(locale);

  const cases: CaseStudies13Item[] = caseStudies.map((caseStudy) => {
    const image =
      caseStudy.image && typeof caseStudy.image === "object"
        ? (caseStudy.image as Media)
        : null;
    const client =
      caseStudy.client && typeof caseStudy.client === "object"
        ? (caseStudy.client as Client)
        : null;
    const topAchievement = caseStudy.achievements?.[0];

    return {
      title: caseStudy.title,
      client: client?.companyName,
      overview: caseStudy.overview ?? undefined,
      metric: topAchievement ? `${topAchievement.number}%` : undefined,
      metricLabel: topAchievement?.metric,
      image: image?.url ?? undefined,
      href: `/case-studies/${caseStudy.slug ?? caseStudy.id}`,
    };
  });

  return (
    <>
      <StaticPageJsonLd
        page="caseStudies"
        items={caseStudies.map((caseStudy) => ({
          name: caseStudy.title,
          path: `/case-studies/${caseStudy.slug ?? caseStudy.id}`,
        }))}
      />
      <CaseStudies13 cases={cases} />
    </>
  );
}
