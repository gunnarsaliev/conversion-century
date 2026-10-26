import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Integration37, type Integration37Pill } from "@/components/integration37";
import type { Industry, Media } from "../../../../../payload-types";
import { Hero237 } from "@/components/hero237";
import { ChartCard5, type ChartCard5Item } from "@/components/chart-card5";
import { TrustStrip4 } from "@/components/trust-strip4";
// import { Hero104 } from "@/components/hero104";
// import { getHomeHero } from "@/lib/home-hero";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { LEAD_STATUSES } from "@/lib/client-status";

// `fallbackPercent` is shown until clients have a business size set.
const BUSINESS_SIZES = [
  { value: "small-business", fallbackPercent: 19.44 },
  { value: "midmarket", fallbackPercent: 48.15 },
  { value: "enterprise", fallbackPercent: 32.41 },
] as const;

// Categorical slots in fixed order — colour follows the slice's rank here,
// so an industry past the sixth folds into "Other".
const SERIES_COLORS = [1, 2, 3, 4, 5, 6].map((n) => `var(--series-${n})`);

const formatPercent = (value: number, decimals: number) =>
  `${value.toFixed(decimals)}%`;

export async function generateMetadata() {
  return staticPageMetadata("clients");
}

export default async function ClientsPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });
  const t = await getTranslations("ClientsPage");
  const tCommon = await getTranslations("Common");

  const { docs: clients } = await payload.find({
    collection: "clients",
    locale: locale as "en" | "bg",
    // Clients without industries are skipped below.
    where: { logo: { exists: true } },
    depth: 1,
    limit: 200,
    sort: "companyName",
    // Clients is admin-only CRM data and the local API bypasses access
    // control, so only select the fields that are meant to appear publicly.
    select: {
      companyName: true,
      logo: true,
      industries: true,
    },
    populate: {
      industries: { title: true, _status: true },
    },
  });

  // Industry title -> its clients. A client with several industries is
  // listed under each of them.
  const groups = new Map<string, Integration37Pill[]>();

  for (const client of clients) {
    const logo =
      client.logo && typeof client.logo === "object"
        ? (client.logo as Media).url
        : null;
    if (!logo) continue;

    for (const industry of client.industries ?? []) {
      // Draft industries aren't public yet, so leave them out.
      if (typeof industry !== "object" || industry._status !== "published") continue;
      const title = (industry as Industry).title;
      const pills = groups.get(title) ?? [];
      pills.push({ name: client.companyName, src: logo });
      groups.set(title, pills);
    }
  }

  const industries = [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b, locale),
  );

  // Hero logos: only clients explicitly flagged as public on the website.
  const { docs: publicClients } = await payload.find({
    collection: "clients",
    where: {
      and: [{ showOnWebsite: { equals: true } }, { logo: { exists: true } }],
    },
    depth: 1,
    limit: 21,
    sort: "companyName",
    select: {
      companyName: true,
      logo: true,
    },
  });

  const heroLogos = publicClients.flatMap((client) => {
    const logo =
      client.logo && typeof client.logo === "object"
        ? (client.logo as Media).url
        : null;
    return logo ? [{ src: logo, alt: client.companyName }] : [];
  });

  // "Our experience" stats: every client we've worked with (not leads).
  // Only aggregate percentages leave the server, never individual records.
  const { docs: pastClients } = await payload.find({
    collection: "clients",
    locale: locale as "en" | "bg",
    where: { status: { not_in: [...LEAD_STATUSES] } },
    depth: 1,
    pagination: false,
    select: {
      businessSize: true,
      industries: true,
    },
    populate: {
      industries: { title: true, _status: true },
    },
  });

  const sizedClients = pastClients.filter((client) => client.businessSize);
  const sizeData: ChartCard5Item[] = BUSINESS_SIZES.map((size, index) => {
    const count = sizedClients.filter(
      (client) => client.businessSize === size.value,
    ).length;
    const percent = sizedClients.length
      ? (count / sizedClients.length) * 100
      : size.fallbackPercent;
    return {
      name: t(`sizes.${size.value}`),
      value: percent,
      color: `var(--tier-${index + 1})`,
      displayValue: formatPercent(percent, 2),
    };
  }).filter((item) => item.value > 0);
  const largestSize = sizeData.reduce<ChartCard5Item | undefined>(
    (largest, item) => (!largest || item.value > largest.value ? item : largest),
    undefined,
  );

  // A client with several industries counts once per industry, so the
  // shares are of all industry assignments and add up to 100%.
  const industryCounts = new Map<string, number>();
  for (const client of pastClients) {
    for (const industry of client.industries ?? []) {
      // Draft industries aren't public yet, so leave them out.
      if (typeof industry !== "object" || industry._status !== "published") continue;
      const title = (industry as Industry).title;
      industryCounts.set(title, (industryCounts.get(title) ?? 0) + 1);
    }
  }
  const industryTotal = [...industryCounts.values()].reduce((a, b) => a + b, 0);
  const rankedIndustries = [...industryCounts.entries()].sort(
    ([, a], [, b]) => b - a,
  );
  const industrySlices =
    rankedIndustries.length > SERIES_COLORS.length
      ? [
          ...rankedIndustries.slice(0, SERIES_COLORS.length - 1),
          [
            t("other"),
            rankedIndustries
              .slice(SERIES_COLORS.length - 1)
              .reduce((sum, [, count]) => sum + count, 0),
          ] as [string, number],
        ]
      : rankedIndustries;
  const industryData: ChartCard5Item[] = industrySlices.map(
    ([title, count], index) => {
      const percent = (count / industryTotal) * 100;
      return {
        name: title,
        value: percent,
        color: SERIES_COLORS[index],
        displayValue: formatPercent(percent, 0),
      };
    },
  );

  return (
    <>
      <StaticPageJsonLd page="clients" />
      <div className="pt-8 pb-32">
        {/* <Hero104 {...await getHomeHero()} containerClassName="lg:px-0" /> */}
        <Hero237
          icons={heroLogos}
          cta={{ text: tCommon("bookConsultation"), href: "/book-a-consultation" }}
        />
        <TrustStrip4 />
        <div className="container mx-auto grid max-w-5xl gap-6 py-16 md:grid-cols-2">
          <ChartCard5
            title={t("bySize")}
            description={t("share")}
            centerValue={largestSize?.displayValue}
            centerLabel={largestSize?.name}
            data={sizeData}
          />
          {industryData.length > 0 && (
            <ChartCard5
              title={t("byIndustry")}
              description={t("share")}
              centerValue={industryCounts.size.toLocaleString(locale)}
              centerLabel={t("industries")}
              data={industryData}
            />
          )}
        </div>
        {industries.length === 0 ? (
          <p className="container mx-auto max-w-5xl text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          industries.map(([title, pills]) => (
            <Integration37
              key={title}
              label={t("industry")}
              heading={title}
              pills={pills}
            />
          ))
        )}
      </div>
    </>
  );
}
