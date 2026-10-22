import { ChevronRight, LayoutDashboard } from "lucide-react";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { PriceList } from "@/components/dashboard/price-list";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdmin } from "@/lib/roles";

// Every service with its hourly rate (Services.price), the only thing
// editable here. Offers are priced as hours × these rates.
export default async function PriceListPage() {
  const payload = await getPayload({ config });
  const t = await getDashboardTranslations("PriceList");
  const tCommon = await getDashboardTranslations("Common");
  const { user } = await payload.auth({ headers: await getHeaders() });

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
      <section className="pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>{tCommon("overview")}</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{t("title")}</span>
        </div>
        <div className="mt-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
            <span className="ml-2 text-lg font-normal text-muted-foreground">
              ({services.length})
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </section>

      <PriceList services={services} canEdit={isAdmin(user)} />
    </>
  );
}
