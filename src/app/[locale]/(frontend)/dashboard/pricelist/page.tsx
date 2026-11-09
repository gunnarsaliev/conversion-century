import { getPayload } from "payload";
import config from "@payload-config";

import { PriceList } from "@/components/dashboard/price-list";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdmin } from "@/lib/roles";
import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";

// Every service with its hourly rate (Services.price), the only thing
// editable here. Offers are priced as hours × these rates.
export default async function PriceListPage() {
  const payload = await getPayload({ config });
  const t = await getDashboardTranslations("PriceList");
  const user = await requireDashboardUser();

  const { docs } = await payload.find({
    collection: "services",
    select: { name: true, price: true, image: true },
    sort: "name",
    // 1 so the image media doc (and its `url`) is populated.
    depth: 1,
    pagination: false,
    // `price` is only readable by signed-in users.
    user,
    overrideAccess: false,
  });

  const services = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    image: typeof doc.image === "object" ? (doc.image?.url ?? undefined) : undefined,
    price: doc.price ?? undefined,
  }));

  return (
    <>
      <PageHeaderBanner
        title={t("title")}
        count={services.length}
        description={t("description")}
      />

      <PriceList services={services} canEdit={isAdmin(user)} />
    </>
  );
}
