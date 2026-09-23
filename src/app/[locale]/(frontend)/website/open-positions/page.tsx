import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Careers2, type Careers2Job } from "@/components/careers2";

const typeLabels = {
  "part-time": "Part-time",
  "full-time": "Full-time",
} as const;

export default async function OpenPositionsPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: listings } = await payload.find({
    collection: "job-listings",
    locale: locale as "en" | "bg",
    depth: 0,
    limit: 100,
    sort: "-createdAt",
    select: { title: true, slug: true, type: true, location: true },
  });

  const jobs: Careers2Job[] = listings.map((listing) => ({
    title: listing.title,
    type: typeLabels[listing.type],
    location: listing.location,
    link: `/website/careers/${listing.slug ?? listing.id}`,
  }));

  return <Careers2 jobs={jobs} />;
}
