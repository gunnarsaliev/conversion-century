import type { Offer, OfferStatic } from "@/types/offer";
import { GroupedLists, OfferSection } from "./offer-ui";

export function OfferTechnical({
  offer,
  technical,
}: {
  offer: Offer;
  technical: OfferStatic["technical"];
}) {
  // Hreflang only matters for multi-language sites.
  const groups = offer.includeLocalization
    ? technical.groups
    : technical.groups.map((group) => ({
        ...group,
        items: group.items.filter((item) => item !== "Hreflang"),
      }));

  return (
    <OfferSection id="technical" heading={technical.header}>
      <GroupedLists groups={groups} />
    </OfferSection>
  );
}
