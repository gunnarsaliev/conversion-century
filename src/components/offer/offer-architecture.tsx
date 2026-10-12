import type { Offer, OfferStatic } from "@/types/offer";
import { OfferSection } from "./offer-ui";

export function OfferArchitecture({
  offer,
  architecture,
}: {
  offer: Offer;
  architecture: OfferStatic["architecture"];
}) {
  return (
    <OfferSection id="architecture" eyebrow={architecture.eyebrow} heading={architecture.header}>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {architecture.steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
            <span className="mb-6 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <h3 className="mb-2 font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <TagList title={architecture.pageTypesHeader} items={offer.pageTypes} />
        {offer.competitors.length > 0 && (
          <TagList title={architecture.competitorsHeader} items={offer.competitors} />
        )}
      </div>
    </OfferSection>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-muted px-3 py-1 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
