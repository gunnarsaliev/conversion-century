import { Plus } from "lucide-react";
import Link from "next/link";

import { OfferList } from "@/components/dashboard/offer-list";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { getOffers } from "@/lib/offers";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { PageHeaderBanner, bannerPrimaryActionClassName } from "@/components/dashboard/page-header-banner";

export default async function OffersPage() {
  await requireDashboardUser();
  const offers = await getOffers();
  const t = await getDashboardTranslations("Offers");

  return (
    <>
      <PageHeaderBanner
        title={t("title")}
        count={offers.length}
        description={t("description")}
        actions={
          // Offers are edited in the admin panel.
          <Link href="/offers/new" className={bannerPrimaryActionClassName}>
            <Plus className="size-4" aria-hidden="true" />
            {t("new")}
          </Link>
        }
      />

      <OfferList offers={offers} />
    </>
  );
}
