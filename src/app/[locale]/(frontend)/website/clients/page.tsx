import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Integration37, type Integration37Pill } from "@/components/integration37";
import type { Industry, Media } from "../../../../../../payload-types";
import { Hero237 } from "@/components/hero237";
import { ChartCard5, type ChartCard5Item } from "@/components/chart-card5";
import { TrustStrip4 } from "@/components/trust-strip4";

// `fallbackPercent` is shown until clients have a business size set.
const BUSINESS_SIZES = [
  { value: "small-business", label: "Small business", fallbackPercent: 19.44 },
  { value: "midmarket", label: "Midmarket", fallbackPercent: 48.15 },
  { value: "enterprise", label: "Enterprise", fallbackPercent: 32.41 },
] as const;

// Categorical slots in fixed order — colour follows the slice's rank here,
// so an industry past the sixth folds into "Other".
const SERIES_COLORS = [1, 2, 3, 4, 5, 6].map((n) => `var(--series-${n})`);

const formatPercent = (value: number, decimals: number) =>
  `${value.toFixed(decimals)}%`;

export default async function ClientsPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

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
      industries: { title: true },
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
      if (typeof industry !== "object") continue;
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
    where: { status: { not_equals: "lead" } },
    depth: 1,
    pagination: false,
    select: {
      businessSize: true,
      industries: true,
    },
    populate: {
      industries: { title: true },
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
      name: size.label,
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
      if (typeof industry !== "object") continue;
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
            "Other",
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
    <div className="py-32">
      <div className="container mx-auto mb-12">
      </div>
      <Hero237 icons={heroLogos} />
      <TrustStrip4 />
      <div className="container mx-auto grid max-w-5xl gap-6 py-16 md:grid-cols-2">
        <ChartCard5
          title="Our experience by business size"
          description="Share of the clients we've worked with"
          centerValue={largestSize?.displayValue}
          centerLabel={largestSize?.name}
          data={sizeData}
        />
        {industryData.length > 0 && (
          <ChartCard5
            title="Our experience by industry"
            description="Share of the clients we've worked with"
            centerValue={industryCounts.size.toLocaleString(locale)}
            centerLabel="Industries"
            data={industryData}
          />
        )}
      </div>
      {industries.length === 0 ? (
        <p className="container mx-auto max-w-5xl text-muted-foreground">
          No clients to show yet.
        </p>
      ) : (
        industries.map(([title, pills]) => (
          <Integration37
            key={title}
            label="Industry"
            heading={title}
            pills={pills}
          />
        ))
      )}
    </div>
  );
}
