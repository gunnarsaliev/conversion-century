import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { CaseStudies13, type CaseStudies13Item } from "@/components/case-studies13";
import type { Client, Media } from "../../../../../../payload-types";

export default async function CaseStudiesPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: caseStudies } = await payload.find({
    collection: "case-studies",
    locale: locale as "en" | "bg",
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
      href: `/website/case-studies/${caseStudy.slug ?? caseStudy.id}`,
    };
  });

  return <CaseStudies13 cases={cases} />;
}
