import type { Metadata } from "next";

import { OfferAgency } from "@/components/offer/offer-agency";
import { OfferArchitecture } from "@/components/offer/offer-architecture";
import { OfferAudit } from "@/components/offer/offer-audit";
import { OfferContact } from "@/components/offer/offer-contact";
import { OfferContent } from "@/components/offer/offer-content";
import { OfferHero } from "@/components/offer/offer-hero";
import { OfferPricing } from "@/components/offer/offer-pricing";
import { OfferSocialProof } from "@/components/offer/offer-social-proof";
import { OfferTeam } from "@/components/offer/offer-team";
import { OfferTechnical } from "@/components/offer/offer-technical";
import { OfferTimeline } from "@/components/offer/offer-timeline";
import offerData from "@/data/offers/ayurvedabio-seo-migration.json";
import staticData from "@/data/offers/static.json";
import type { Offer, OfferStatic } from "@/types/offer";
import ayurvedabioLogo from "./Ayurvedabio.png";
import certificationsImage from "./certifivations.png";
import { Feature97 } from "@/components/feature97";

// Static preview of a client offer, fed by JSON fixtures until the dynamic
// `offers/[client]/[offer-id]` route and its Payload collection exist.
// Offers are private, so keep them out of search and the sitemap.
// The fixture has no hosted logo yet, so use the bundled one.
const offer: Offer = {
  ...(offerData as Offer),
  client: { ...offerData.client, logo: ayurvedabioLogo.src },
};
// Badges are one combined image for now, bundled next to the page.
const content: OfferStatic = {
  ...(staticData as OfferStatic),
  socialProof: {
    ...staticData.socialProof,
    badges: [
      {
        name: "Ahrefs Agency Partner, Semrush Certified Agency Partner, Featured on Forbes, Clutch",
        logo: certificationsImage.src,
      },
    ],
  },
};

export const metadata: Metadata = {
  title: `${offer.service} на ${offer.client.name}`,
  robots: { index: false, follow: false },
};

export default function OfferPage() {
  return (
    <main>
      <OfferHero offer={offer} brand={content.brand} />
      {/* <Feature97 /> */}
      <OfferAgency agency={content.agency} />
      <OfferSocialProof socialProof={content.socialProof} />
      <OfferAudit offer={offer} audit={content.audit} />
      <OfferTimeline offer={offer} timeline={content.timeline} />
      <OfferArchitecture offer={offer} architecture={content.architecture} />
      <OfferTechnical offer={offer} technical={content.technical} />
      <OfferContent offer={offer} contentStrategy={content.contentStrategy} />
      <OfferPricing offer={offer} pricing={content.pricing} />
      <OfferTeam offer={offer} team={content.team} />
      <OfferContact trackRecord={content.trackRecord} />
    </main>
  );
}
