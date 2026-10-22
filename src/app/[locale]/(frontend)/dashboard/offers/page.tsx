import { ChevronRight, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";

import { OfferList } from "@/components/dashboard/offer-list";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { getOffers } from "@/lib/offers";

export default async function OffersPage() {
  const offers = await getOffers();
  const t = await getDashboardTranslations("Offers");
  const tCommon = await getDashboardTranslations("Common");

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>{tCommon("overview")}</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{t("title")}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("title")}
              <span className="ml-2 text-lg font-normal text-muted-foreground">
                ({offers.length})
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
          {/* Offers are edited in the admin panel. */}
          <Link
            href="/offers/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground outline-none transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {t("new")}
          </Link>
        </div>
      </section>

      <OfferList offers={offers} />
    </>
  );
}
