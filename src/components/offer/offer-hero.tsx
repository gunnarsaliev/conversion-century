import { Logo } from "@/components/Logo";
import type { Offer, OfferStatic } from "@/types/offer";
import { LogoOrName, formatDate } from "./offer-ui";

export function OfferHero({
  offer,
  brand,
}: {
  offer: Offer;
  brand: OfferStatic["brand"];
}) {
  return (
    <section className="flex flex-col items-center py-32 text-center">
      <div className="mb-10 flex items-center justify-center gap-6">
        <Logo alt={brand.name} width={142} height={48} className="h-12 w-auto" />
        <span aria-hidden="true" className="text-2xl text-muted-foreground">
          ×
        </span>
        <LogoOrName
          name={offer.client.name}
          logo={offer.client.logo}
          className="h-12 w-auto dark:invert-0"
        />
      </div>
      <h1 className="mx-auto mb-8 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:mb-10 md:text-6xl md:leading-snug">
        {offer.service} на <span className="text-primary">{offer.client.name}</span>
      </h1>
      <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-4 text-pretty text-muted-foreground md:text-lg">
        {brand.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-sm text-muted-foreground md:text-base">
        <p>
          Изготвено от:{" "}
          <a
            href={`https://${brand.website}`}
            className="font-medium text-foreground hover:underline"
          >
            {brand.website}
          </a>
        </p>
        <p>
          {formatDate(offer.date)} · Валидна до {formatDate(offer.validUntil)}
        </p>
      </div>
    </section>
  );
}
