import type { Offer, OfferStatic } from "@/types/offer";
import { GroupedLists, OfferSection } from "./offer-ui";

// Replaces `{blogArticles}`-style placeholders with the offer's quantities.
const fill = (text: string, values: Record<string, number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );

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
    items: group.items.map((item) => fill(item, offer.content)),
  }));

  return (
    <OfferSection id="content" heading={contentStrategy.header}>
      <GroupedLists groups={groups} />
    </OfferSection>
  );
}
