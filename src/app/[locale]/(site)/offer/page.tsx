import type { Metadata } from "next";

import { OfferAgency, PILLAR_ICONS } from "@/components/offer/offer-agency";
import { OfferArchitecture } from "@/components/offer/offer-architecture";
import { OfferAudit } from "@/components/offer/offer-audit";
import { OfferContact } from "@/components/offer/offer-contact";
import { OfferContent } from "@/components/offer/offer-content";
import { OfferHero as OfferHeroV1 } from "@/components/offer/offer-hero";
import { OfferHeroV2 } from "@/components/offer/offer-hero-v2";
import { OfferIntro } from "@/components/offer/offer-intro";
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
import { Incentives6 } from "@/components/incentives6";
import { ChartGroup12 } from "@/components/chart-group12";
import { formatNumber } from "@/components/offer/offer-ui";
import TimelineActivity1 from "@/components/timeline-activity-1";
import { requireDashboardUser } from "@/lib/dashboard-auth";

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

export default async function OfferPage() {
  // proxy.ts only checks for a session cookie; offers are private.
  await requireDashboardUser();
  return (
    <main>
      {/* <OfferHeroV1 offer={offer} brand={content.brand} /> */}
      <OfferHeroV2 offer={offer} brand={content.brand} />
      <OfferIntro brand={content.brand} />
      {/* <Feature97 /> */}
      {/* <OfferAgency agency={content.agency} /> */}
      <Incentives6
        incentives={content.agency.pillars.map((pillar, i) => ({
          title: pillar.title,
          text: pillar.description,
          icon: PILLAR_ICONS[i % PILLAR_ICONS.length],
        }))}
      />
      <OfferSocialProof socialProof={content.socialProof} />
      <ChartGroup12
        domainRating={offer.metrics.domainRating}
        stats={[
          {
            title: content.audit.metricLabels.domainRating,
            value: formatNumber(offer.metrics.domainRating),
            suffix: "от 100",
          },
          {
            title: content.audit.metricLabels.backlinks,
            value: formatNumber(offer.metrics.backlinks),
          },
          {
            title: content.audit.metricLabels.organicKeywords,
            value: formatNumber(offer.metrics.organicKeywords),
          },
          {
            title: content.audit.metricLabels.organicTraffic,
            value: formatNumber(offer.metrics.organicTraffic),
          },
        ]}
      />
      
      <OfferAudit offer={offer} audit={content.audit} />
      <OfferTimeline offer={offer} timeline={content.timeline} />
      <TimelineActivity1
        heading={content.timeline.activityHeader}
        subheading={offer.startLabel}
        events={offer.timeline.map((phase, i) => ({
          id: String(i + 1),
          title: `${String(i + 1).padStart(2, "0")} ${phase.label}`,
          detail: phase.description,
          time:
            phase.startWeek === phase.endWeek
              ? `${content.timeline.weekLabel} ${phase.startWeek}`
              : `${content.timeline.weekLabel} ${phase.startWeek}–${phase.endWeek}`,
        }))}
      />
      <OfferArchitecture offer={offer} architecture={content.architecture} />
      <OfferTechnical offer={offer} technical={content.technical} />
      <OfferContent offer={offer} contentStrategy={content.contentStrategy} />
      <OfferPricing offer={offer} pricing={content.pricing} />
      <OfferTeam offer={offer} team={content.team} />
      <OfferContact trackRecord={content.trackRecord} />
    </main>
  );
}
