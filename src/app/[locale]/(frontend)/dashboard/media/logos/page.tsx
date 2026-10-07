import { getPayload } from "payload";
import config from "@payload-config";

import { MediaHub } from "@/components/dashboard/media-hub";
import { MediaHubHeader } from "@/components/dashboard/media-hub-header";
import { toMediaHubItem } from "@/lib/media-files";

export default async function MediaLogosPage() {
  const payload = await getPayload({ config });
  const clients = await payload.find({
    collection: "clients",
    where: { logo: { exists: true } },
    depth: 1,
    limit: 500,
    sort: "companyName",
    select: { companyName: true, logo: true },
  });

  const items = clients.docs.flatMap((client) =>
    client.logo && typeof client.logo === "object"
      ? [toMediaHubItem(client.logo, client.companyName)]
      : [],
  );

  return (
    <>
      <MediaHubHeader
        active="logos"
        count={items.length}
        description="Download client logos for reports, decks and case studies"
      />
      <MediaHub items={items} emptyMessage="No clients have a logo yet." />
    </>
  );
}
