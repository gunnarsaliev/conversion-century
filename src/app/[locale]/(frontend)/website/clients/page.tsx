import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Integration37, type Integration37Pill } from "@/components/integration37";
import type { Industry, Media } from "../../../../../../payload-types";
import { Hero237 } from "@/components/hero237";

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

  return (
    <div className="py-32">
      <div className="container mx-auto mb-12">
      </div>
      <Hero237 icons={heroLogos} />
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
