import { Eye, Handshake, Lightbulb, Repeat } from "lucide-react";

import { Feature97 } from "@/components/feature97";
import type { OfferStatic } from "@/types/offer";

// One icon per pillar, in the order they appear in static.json:
// Иновация, Прозрачност, Колаборация, Постоянство.
const PILLAR_ICONS = [Lightbulb, Eye, Handshake, Repeat];

export function OfferAgency({ agency }: { agency: OfferStatic["agency"] }) {
  return (
    <Feature97
      heading={agency.header}
      description={agency.description}
      features={agency.pillars.map((pillar, i) => {
        const Icon = PILLAR_ICONS[i];
        return {
          ...pillar,
          icon: Icon ? <Icon className="mx-auto h-auto w-7" /> : undefined,
        };
      })}
    />
  );
}
