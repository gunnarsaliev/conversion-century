import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { CaseStudies13, type CaseStudies13Item } from "@/components/case-studies13";
import type { Media } from "../../../../../../payload-types";

export default async function IndustriesPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: industries } = await payload.find({
    collection: "industries",
    locale: locale as "en" | "bg",
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

  const items: CaseStudies13Item[] = industries.map((industry) => {
    const image =
      industry.image && typeof industry.image === "object"
        ? (industry.image as Media)
        : null;

    return {
      title: industry.title,
      overview: industry.meta?.description ?? undefined,
      image: image?.url ?? undefined,
      href: `/website/industries/${industry.slug ?? industry.id}`,
    };
  });

  return (
    <CaseStudies13
      eyebrow="Industries"
      heading="Explore solutions tailored to your industry"
      cases={items}
    />
  );
}
