import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ClientLogo } from "@/components/dashboard/client-logo";
import { formatAmount, formatDate, packageTotal } from "@/components/offer/offer-ui";
import { Badge } from "@/components/ui/badge";
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

const OfferCard = ({ item }: { item: OfferListItem }) => {
  const { offer } = item;
  // After discount.
  const pkg = offer.packages[0];
  const price = pkg ? packageTotal(pkg) : undefined;

  return (
    <Link
      href={`/website/offers/${item.id}`}
      className="group flex h-full min-h-48 w-full flex-col gap-3 rounded-lg border bg-white dark:bg-gray-800 p-4 text-left outline-none transition-all hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-4">
        <ClientLogo companyName={offer.client.name} logoUrl={offer.client.logo || null} size={48} />
        <div className="flex shrink-0 items-center gap-2">
          <Badge className={statusBadgeClassName[item.status]}>
            <span className="capitalize">{item.status}</span>
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
          Valid until {formatDate(offer.validUntil)}
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

const OfferList = ({ offers }: { offers: OfferListItem[] }) => {
  if (offers.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No offers yet.</p>;
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {offers.map((item) => (
        <li key={item.id} className="min-w-0">
          <OfferCard item={item} />
        </li>
      ))}
    </ul>
  );
};

export { OfferList };
