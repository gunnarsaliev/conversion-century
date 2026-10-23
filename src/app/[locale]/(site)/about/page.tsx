import { getTranslations } from "next-intl/server";

import {
  AboutCollaboration,
  AboutHero,
  AboutMarkets,
  AboutMission,
  AboutPeople,
  AboutPrinciples,
  AboutStory,
} from "@/components/about-us";
import { FounderLetter } from "@/components/founder-letter";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { getTeamMembers } from "@/lib/team-members";

export async function generateMetadata() {
  return staticPageMetadata("about");
}

export default async function AboutPage() {
  const members = await getTeamMembers(undefined, true);
  const t = await getTranslations("About.leadership");

  return (
    <>
      <StaticPageJsonLd page="about" />
      <AboutHero />
      <AboutStory />
      <AboutPeople members={members} />
      <FounderLetter
        className="border-t border-border"
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        intro={t("intro")}
        role={t("role")}
        ctaText=""
      />
      <AboutMarkets />
      <AboutCollaboration />
      <AboutMission />
      <AboutPrinciples />
    </>
  );
}
