import { getLocale, getTranslations } from "next-intl/server";

import type { Hero104Props } from "@/components/hero104";
import hero104Data from "@/data/hero104.json";
import { cmsImage, getHomePage } from "@/lib/page-content";

// Props for the home page Hero104 (also reused for the social proof row on
// service pages): the Hero tab of the `home-page` collection. Whatever is
// empty there falls back to the `Home.hero` messages and data/hero104.json.
export async function getHomeHero(): Promise<Hero104Props> {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("Home.hero"),
    getTranslations("Common"),
    getLocale(),
  ]);
  const hero = (await getHomePage(locale))?.hero;

  const avatars = (hero?.avatars ?? []).flatMap((avatar) => {
    const image = cmsImage(avatar.image, avatar.alt || t("avatarAlt"));
    return image ? [image] : [];
  });
  const highlights = (hero?.highlights ?? []).map((item) => item.text);

  return {
    heading: hero?.heading || t("heading"),
    description: hero?.description || t("description"),
    secondaryDescription: hero?.secondaryDescription || t("secondaryDescription"),
    primaryCta: {
      label: hero?.primaryCta?.label || tCommon("bookConsultation"),
      href: hero?.primaryCta?.href || hero104Data.primaryCtaHref,
    },
    secondaryCta: {
      label: hero?.secondaryCta?.label || t("secondaryCta"),
      href: hero?.secondaryCta?.href || hero104Data.secondaryCtaHref,
    },
    avatars:
      avatars.length > 0
        ? avatars
        : hero104Data.avatars.map((src) => ({ src, alt: t("avatarAlt") })),
    socialProof: hero?.socialProof || t("socialProof"),
    highlights:
      highlights.length > 0
        ? highlights
        : [
            t("highlights.founded"),
            t("highlights.relationships"),
            t("highlights.international"),
          ],
    image: cmsImage(hero?.image, hero?.imageAlt) ?? { src: hero104Data.image, alt: "" },
  };
}
