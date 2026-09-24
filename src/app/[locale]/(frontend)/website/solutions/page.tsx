import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { CaseStudies13, type CaseStudies13Item } from "@/components/case-studies13";
import type { Media } from "../../../../../../payload-types";

export default async function SolutionsPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: solutions } = await payload.find({
    collection: "solutions",
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

  const items: CaseStudies13Item[] = solutions.map((solution) => {
    const image =
      solution.image && typeof solution.image === "object"
        ? (solution.image as Media)
        : null;

    return {
      title: solution.title,
      overview: solution.meta?.description ?? undefined,
      image: image?.url ?? undefined,
      href: `/website/solutions/${solution.slug ?? solution.id}`,
    };
  });

  return (
    <CaseStudies13
      eyebrow="Solutions"
      heading="Explore our solutions"
      cases={items}
    />
  );
}
