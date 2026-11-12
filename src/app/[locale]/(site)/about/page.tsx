import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  AboutCollaboration,
  AboutHero,
  AboutMarkets,
  AboutMission,
  AboutPartners,
  AboutPeople,
  AboutPrinciples,
  AboutStory,
} from "@/components/about-us";
import { FounderLetter } from "@/components/founder-letter";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { cmsImage, filled, getAboutPage } from "@/lib/page-content";
import { getTeamMembers } from "@/lib/team-members";

export async function generateMetadata() {
  return staticPageMetadata("about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [members, t, about] = await Promise.all([
    getTeamMembers(undefined, true),
    getTranslations("About.leadership"),
    // Section copy and images (the `about-page` collection); each section
    // falls back to the `About` messages for whatever is empty there.
    getAboutPage(locale),
  ]);
  const leadership = about?.leadership;

  return (
    <>
      <StaticPageJsonLd page="about" />
      <AboutHero content={about?.hero} />
      <AboutStory content={about?.story} />
      <AboutPeople members={members} content={about?.people} />
      <FounderLetter
        className="border-t border-border"
        eyebrow={leadership?.eyebrow || t("eyebrow")}
        heading={leadership?.heading || t("heading")}
        intro={leadership?.intro || t("intro")}
        portrait={cmsImage(leadership?.portrait, leadership?.portraitAlt)}
        quote={leadership?.quote || t("quote")}
        name={filled(leadership?.name)}
        role={leadership?.role || t("role")}
        ctaText=""
      />
      <AboutMarkets content={about?.markets} />
      <AboutPartners content={about?.partners} />
      <AboutCollaboration content={about?.collaboration} />
      <AboutMission content={about?.mission} />
      <AboutPrinciples content={about?.principles} />
    </>
  );
}
