import { getTranslations } from "next-intl/server";

import type { Hero104Props } from "@/components/hero104";
import hero104Data from "@/data/hero104.json";

// Props for the home page Hero104 (also reused by the clients page, and for
// the social proof row on service pages): copy from the `Home.hero` messages,
// images and links from data/hero104.json.
export async function getHomeHero(): Promise<Hero104Props> {
  const t = await getTranslations("Home.hero");
  const tCommon = await getTranslations("Common");

  return {
    heading: t("heading"),
    description: t("description"),
    secondaryDescription: t("secondaryDescription"),
    primaryCta: { label: tCommon("bookConsultation"), href: hero104Data.primaryCtaHref },
    secondaryCta: { label: t("secondaryCta"), href: hero104Data.secondaryCtaHref },
    avatars: hero104Data.avatars.map((src) => ({ src, alt: t("avatarAlt") })),
    socialProof: t("socialProof"),
    highlights: [
      t("highlights.founded"),
      t("highlights.relationships"),
      t("highlights.international"),
    ],
    image: { src: hero104Data.image, alt: "" },
  };
}
