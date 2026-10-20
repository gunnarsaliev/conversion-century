import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ClientLogo } from "@/components/dashboard/client-logo";
import { formatAmount, formatDate } from "@/components/offer/offer-ui";
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
  const price = offer.packages[0]?.price;

  return (
    <Link
      href={`/website/offers/${item.id}`}
      className="group flex h-48 w-full flex-col gap-4 rounded-lg border bg-white dark:bg-gray-800 p-4 text-left outline-none transition-all hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-4">
        <ClientLogo companyName={offer.client.name} logoUrl={offer.client.logo || null} size={64} />
        <div className="flex items-center gap-2">
          <Badge className={statusBadgeClassName[item.status]}>
            <span className="capitalize">{item.status}</span>
          </Badge>
          <div className="opacity-0 group-hover:opacity-100">
            <ArrowRight className="size-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 text-base">
        <p className="truncate font-medium">{offer.client.name}</p>
        {offer.service ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{offer.service}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">
          Valid until {formatDate(offer.validUntil)}
        </span>
        {price ? <span className="font-medium">{formatAmount(price)} €</span> : null}
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
        <li key={item.id}>
          <OfferCard item={item} />
        </li>
      ))}
    </ul>
  );
};

export { OfferList };
