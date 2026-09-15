import { getPayload } from "payload";
import config from "@payload-config";

import { Hero104 } from "@/components/hero104";
import { Logos35 } from "@/components/logos35";
import type { Media } from "../../../../../payload-types";

export default async function WebsitePage() {
  const payload = await getPayload({ config });
  const { docs: clients } = await payload.find({
    collection: "clients",
    where: {
      showOnWebsite: { equals: true },
      logo: { exists: true },
    },
    depth: 1,
    limit: 50,
  });

  const clientLogos = clients
    .filter(
      (client): client is typeof client & { logo: Media } =>
        typeof client.logo === "object" && client.logo !== null && !!client.logo.url,
    )
    .map((client) => ({
      name: client.companyName,
      src: client.logo.url as string,
    }));

  return (
    <div>
      <Hero104 />
      <Logos35 logos={clientLogos.length > 0 ? clientLogos : undefined} />
    </div>
  );
}