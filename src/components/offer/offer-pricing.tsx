import { Check } from "lucide-react";
import { cn } from "cn";

import type { Offer, OfferStatic } from "@/types/offer";
import { OfferSection, formatPrice } from "./offer-ui";

export function OfferPricing({
  offer,
  pricing,
}: {
  offer: Offer;
  pricing: OfferStatic["pricing"];
}) {
  return (
    <OfferSection id="pricing" heading={`${pricing.header} ${offer.siteType}`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <h3 className="mb-4 font-semibold">{pricing.summaryHeader}</h3>
          <ul className="flex flex-col gap-3 text-sm">
            {offer.scopeSummary.map((item) => (
              <li key={item.label} className="flex gap-2">
                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <strong className="font-semibold">{item.label}:</strong>{" "}
                  <span className="text-muted-foreground">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {offer.packages.map((pkg) => (
            <div
              key={pkg.name}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6",
                pkg.recommended ? "border-primary ring-1 ring-primary" : "border-border",
              )}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <h4 className="font-semibold">{pkg.name}</h4>
                {pkg.recommended && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    {pricing.recommendedLabel}
                  </span>
                )}
              </div>
              <p className="text-4xl font-semibold tabular-nums">
                {formatPrice(pkg.price, pkg.currency)}
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                {pkg.hours !== undefined && `${pkg.hours} ${pricing.hoursLabel}`}
              </p>
              <ul className="flex flex-col gap-2 text-sm">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs text-muted-foreground sm:col-span-2">{pricing.vatNote}</p>
        </div>
      </div>
    </OfferSection>
  );
}
