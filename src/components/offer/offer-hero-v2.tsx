import { Hero232 } from "@/components/hero232";
import { Logo } from "@/components/Logo";
import type { Offer, OfferStatic } from "@/types/offer";
import { LogoOrName, formatDate } from "./offer-ui";

// Same content as OfferHero, laid out with the Hero232 block.
export function OfferHeroV2({
  offer,
  brand,
}: {
  offer: Offer;
  brand: OfferStatic["brand"];
}) {
  return (
    <Hero232
      // Break out of the layout's max-w-7xl container to span the viewport.
      className="ml-[calc(50%-50vw)] w-screen"
      logos={
        <div className="flex items-center justify-center gap-6">
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
      }
      eyebrow="Специална оферта"
      titleBefore={`${offer.service} на`}
      titleHighlight={offer.client.name}
      titleAfter=""
      actions={
        <p className="text-sm text-muted-foreground md:text-base">
          {`Валидна до ${formatDate(offer.validUntil)}`}
        </p>
      }
    />
  );
}
