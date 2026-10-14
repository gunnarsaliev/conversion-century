import type { Offer, OfferStatic } from "@/types/offer";
import { GroupedLists, OfferSection, fillPlaceholders } from "./offer-ui";

export function OfferContent({
  offer,
  contentStrategy,
}: {
  offer: Offer;
  contentStrategy: OfferStatic["contentStrategy"];
}) {
  if (!offer.packages.some((pkg) => pkg.includesContent)) return null;

  const groups = contentStrategy.groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      label: fillPlaceholders(item.label, offer.content),
      text: fillPlaceholders(item.text, offer.content),
    })),
  }));

  return (
    <OfferSection
      id="content"
      heading={`${contentStrategy.header} ${offer.siteType}`}
      description={contentStrategy.description}
    >
      <GroupedLists groups={groups} />
    </OfferSection>
  );
}
