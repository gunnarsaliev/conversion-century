import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";

export type ClientLogo = { name: string; src: string };

// Logos of clients marked `showOnWebsite`, for logo strips like Logos35.
// Only the name and logo URL are selected; everything else on a client is
// admin-only CRM data. Cached across requests, so several components on
// one page share a single query.
export async function getClientLogos(): Promise<ClientLogo[]> {
  "use cache";
  cmsCache("clients", "media");
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "clients",
    where: {
      showOnWebsite: { equals: true },
      logo: { exists: true },
    },
    select: { companyName: true, logo: true },
    // The media doc is populated in full on purpose: its `url` is built
    // from `filename`/`prefix` by the R2 storage adapter, so selecting
    // only `url` comes back empty.
    depth: 1,
    limit: 50,
  });

  return docs.flatMap((client) =>
    typeof client.logo === "object" && client.logo?.url
      ? [{ name: client.companyName, src: client.logo.url }]
      : [],
  );
}
