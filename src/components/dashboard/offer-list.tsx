import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ClientLogo } from "@/components/dashboard/client-logo";
import { formatAmount, packageTotal } from "@/components/offer/offer-ui";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardLocale,
  getDashboardTranslations,
  type DashboardTranslator,
} from "@/lib/dashboard-locale";
import { formatDashboardDate } from "@/lib/dashboard-locale-shared";
import type { OfferListItem } from "@/lib/offers";

// ---------------------------------------------------------------------------
// Offer list (card grid)
// ---------------------------------------------------------------------------
//
// Same card grid as ClientList: each offer shows its client's logo, the
// services, price and expiry, and links through to the offer page.

const statusBadgeClassName: Record<OfferListItem["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

type Translator = DashboardTranslator;

const OfferCard = ({ item, t, locale }: { item: OfferListItem; t: Translator; locale: string }) => {
  const { offer } = item;
  // After discount.
  const pkg = offer.packages[0];
  const price = pkg ? packageTotal(pkg) : undefined;

  return (
    <Link
      href={`/offers/${item.id}`}
      className="group flex h-full min-h-48 w-full flex-col gap-3 rounded-lg border bg-white dark:bg-gray-800 p-4 text-left outline-none transition-all hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-4">
        <ClientLogo companyName={offer.client.name} logoUrl={offer.client.logo || null} size={48} />
        <div className="flex shrink-0 items-center gap-2">
          <Badge className={statusBadgeClassName[item.status]}>
            {t(`status.${item.status}`)}
          </Badge>
          <div className="opacity-0 group-hover:opacity-100">
            <ArrowRight className="size-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1 text-base">
        <p className="truncate font-medium">{offer.client.name}</p>
        {offer.service ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{offer.service}</p>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-3 border-t pt-3 text-sm">
        <span className="min-w-0 text-muted-foreground">
          {t("validUntil", { date: formatDashboardDate(offer.validUntil, locale) })}
        </span>
        {price ? (
          <span className="shrink-0 font-medium whitespace-nowrap tabular-nums">
            {formatAmount(price)} €
          </span>
        ) : null}
      </div>
    </Link>
  );
};

const OfferList = async ({ offers }: { offers: OfferListItem[] }) => {
  const t = await getDashboardTranslations("Offers");
  const locale = await getDashboardLocale();

  if (offers.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {offers.map((item) => (
        <li key={item.id} className="min-w-0">
          <OfferCard item={item} t={t} locale={locale} />
        </li>
      ))}
    </ul>
  );
};

export { OfferList };
