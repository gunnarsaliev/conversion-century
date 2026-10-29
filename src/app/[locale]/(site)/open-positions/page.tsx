import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { Careers2, type Careers2Job } from "@/components/careers2";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { translated } from "@/utilities/findByLocalizedSlug";

export async function generateMetadata() {
  return staticPageMetadata("openPositions");
}

// Cached across requests; refreshed when the collection changes.
async function getJobListings(locale: string) {
  "use cache";
  cmsCache("job-listings");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "job-listings",
    locale: locale as "en" | "bg",
    where: translated,
    depth: 0,
    limit: 100,
    sort: "-createdAt",
    select: { title: true, slug: true, type: true, location: true },
  });
}

export default async function OpenPositionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  const { docs: listings } = await getJobListings(locale);

  const jobs: Careers2Job[] = listings.map((listing) => ({
    title: listing.title,
    type: t(`types.${listing.type}`),
    location: listing.location,
    link: `/careers/${listing.slug ?? listing.id}`,
  }));

  return (
    <>
      <StaticPageJsonLd page="openPositions" />
      <Careers2 jobs={jobs} />
    </>
  );
}
