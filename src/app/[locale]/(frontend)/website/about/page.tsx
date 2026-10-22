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
  const members = await getTeamMembers();

  return (
    <>
      <StaticPageJsonLd page="about" />
      <AboutHero />
      <AboutStory />
      <AboutPeople members={members} />
      <FounderLetter
        className="border-t border-border"
        eyebrow="Leadership"
        heading="Led by Maria Sivkova"
        intro={
          "Maria joined Conversion Century in 2020 and became its owner in 2022. With more than eight years of experience across HR, marketing and digital, she brings an understanding of both people and business to her leadership.\n\n" +
          "Today, she leads the agency’s strategy and development, supports the team’s growth and stays closely involved in client relationships."
        }
        role="Owner & Managing Director"
        ctaText=""
      />
      <AboutMarkets />
      <AboutCollaboration />
      <AboutMission />
      <AboutPrinciples />
    </>
  );
}
