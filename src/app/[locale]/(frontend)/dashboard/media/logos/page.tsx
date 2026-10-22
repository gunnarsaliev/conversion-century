import { getPayload } from "payload";
import config from "@payload-config";

import { MediaHub } from "@/components/dashboard/media-hub";
import { MediaHubHeader } from "@/components/dashboard/media-hub-header";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { toMediaHubItem } from "@/lib/media-files";
import { requireDashboardUser } from "@/lib/dashboard-auth";

export default async function MediaLogosPage() {
  await requireDashboardUser();
  const payload = await getPayload({ config });
  const t = await getDashboardTranslations("Media.pages");
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
        description={t("logos.description")}
      />
      <MediaHub items={items} emptyMessage={t("logos.empty")} />
    </>
  );
}
