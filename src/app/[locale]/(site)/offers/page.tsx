import type { Metadata } from "next";
import Link from "next/link";

import { formatAmount, formatDate, LogoOrName, packageTotal } from "@/components/offer/offer-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOffers, type OfferListItem } from "@/lib/offers";

// Offers are private, so keep them out of search and the sitemap.
export const metadata: Metadata = {
  title: "Оферти",
  robots: { index: false, follow: false },
};

const STATUS: Record<
  OfferListItem["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Чернова", variant: "outline" },
  sent: { label: "Изпратена", variant: "secondary" },
  accepted: { label: "Приета", variant: "default" },
  declined: { label: "Отказана", variant: "destructive" },
};

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-bold">Оферти</h1>
          <Link href="/offers/new" className={buttonVariants()}>
            Нова оферта
          </Link>
        </div>
        <p className="mb-10 text-muted-foreground">
          Индивидуални оферти за клиенти. Управляват се от колекцията „Offers“ в админ панела.
        </p>

        {offers.length === 0 ? (
          <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            Все още няма оферти.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map(({ id, status, offer }) => {
              const recommended =
                offer.packages.find((pkg) => pkg.recommended) ?? offer.packages[0];
              return (
                <li key={id}>
                  <Link href={`/offers/${id}`} className="group block h-full">
                    <Card className="h-full transition-colors group-hover:border-primary">
                      <CardContent className="flex h-full flex-col gap-4 pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <LogoOrName
                            name={offer.client.name}
                            logo={offer.client.logo}
                            className="h-10 w-28 object-left"
                          />
                          <Badge variant={STATUS[status].variant}>
                            {STATUS[status].label}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-semibold">{offer.client.name}</p>
                          <p className="text-sm text-muted-foreground">{offer.service}</p>
                        </div>
                        <div className="mt-auto flex items-end justify-between gap-4 border-t pt-4 text-sm">
                          <span className="text-muted-foreground">
                            Валидна до {formatDate(offer.validUntil)}
                          </span>
                          {recommended && (
                            <span className="font-semibold tabular-nums">
                              {formatAmount(packageTotal(recommended))} €
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
