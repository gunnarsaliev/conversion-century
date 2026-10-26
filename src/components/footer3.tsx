import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import { Logo, LogoImage } from "@/components/shadcnblocks/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { FooterLanguageSwitcher } from "@/components/footer-language-switcher";
import { SeoCta } from "./cta-seo";

// Link text lives in the `Footer` messages, keyed by section and link.
const sections = [
  {
    key: "services",
    links: [
      { key: "ongoingSeoManagement", href: "/services/ongoing-seo-management" },
      { key: "aiSearchOptimization", href: "/services/ai-search-optimization" },
      { key: "seoAudit", href: "/services/seo-audit" },
      { key: "internationalSeo", href: "/services/international-seo" },
      { key: "localSeo", href: "/services/local-seo" },
      { key: "technicalSeo", href: "/services/technical-seo" },
      { key: "contentStrategy", href: "/services/content-strategy-and-copywriting" },
      { key: "linkBuilding", href: "/services/link-building-and-digital-pr" },
      { key: "organicSearchTraining", href: "/services/organic-search-training" },
    ],
  },
  {
    key: "solutions",
    links: [
      { key: "growOrganicRevenue", href: "/solutions/grow-organic-revenue" },
      { key: "enterNewMarkets", href: "/solutions/enter-new-markets" },
      { key: "recoverLostTraffic", href: "/solutions/recover-lost-traffic" },
      { key: "migrateWithoutLosingSeo", href: "/solutions/migrate-without-losing-seo" },
      { key: "improveVisibilityInAi", href: "/solutions/improve-visibility-in-ai" },
      { key: "outsourcedSeoDepartment", href: "/solutions/build-an-outsourced-seo-department" },
      { key: "reduceAdDependence", href: "/solutions/reduce-dependence-on-ads" },
      { key: "launchSeoReadyWebsite", href: "/solutions/launch-an-seo-ready-website" },
    ],
  },
  {
    key: "industries",
    links: [
      { key: "b2b", href: "/industries/b2b" },
      { key: "ecommerce", href: "/industries/ecommerce" },
      { key: "professionalServices", href: "/industries/professional-services" },
      { key: "financialSector", href: "/industries/financial-sector" },
      { key: "realEstate", href: "/industries/real-estate" },
      { key: "healthcare", href: "/industries/healthcare" },
    ],
  },
  {
    key: "proof",
    links: [
      { key: "clients", href: "/clients" },
      { key: "caseStudies", href: "/case-studies" },
      { key: "reviews", href: "/reviews" },
    ],
  },
  {
    key: "about",
    links: [
      { key: "ourStory", href: "/about" },
      { key: "career", href: "/open-positions" },
    ],
  },
  {
    key: "insights",
    links: [
      { key: "blog", href: "/blog" },
      { key: "checklists", href: "/docs/getting-started" },
      { key: "eventsAndMedia", href: "/events-and-media" },
    ],
  },
] as const;

interface Footer3Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
}
const Footer3 = ({
  logo = {
    url: "/",
    src: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/conversion-century-logo.svg",
    alt: "Conversion Century",
    title: "Conversion Century",
  },
  className,
}: Footer3Props) => {
  const t = useTranslations("Footer");

  return (
    <section
      className={cn(
        // The before: layer copies the section's background out to the viewport edges.
        "relative isolate bg-yellow-50 py-32 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-inherit",
        className,
      )}
    >
     <SeoCta />
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <footer>
          <Logo url={logo.url}>
            <LogoImage
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-10"
            />
          </Logo>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <div key={section.key}>
                <h3 className="mb-4 font-bold">{t(`${section.key}.title`)}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link) => (
                    <li
                      key={link.key}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.href}>
                        {t(`${section.key}.links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="sm:col-span-2">
              <ul className="mb-10 flex items-center gap-2 text-muted-foreground">
                <li className="font-medium">
                  <a
                    href="https://www.facebook.com/people/Conversion-Century-Ltd/100086510380518/"
                    target="_blank"
                    rel={EXTERNAL_LINK_REL}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                      <FaFacebookF className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a
                    href="https://www.instagram.com/conversioncentury/"
                    target="_blank"
                    rel={EXTERNAL_LINK_REL}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                      <FaInstagram className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a
                    href="https://www.linkedin.com/company/conversion-century/"
                    target="_blank"
                    rel={EXTERNAL_LINK_REL}
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                      <FaLinkedin className="size-6" />
                    </span>
                  </a>
                </li>
              </ul>
              <NewsletterForm />
            </div>
          </div>
          <div className="mt-24 flex flex-col flex-wrap justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <span>{t("copyright", { year: new Date().getFullYear() })}</span>
            <FooterLanguageSwitcher label={t("language")} />
            <ul className="flex gap-4">
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/legal/terms-and-conditions">{t("terms")}</Link>
              </li>
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/legal/privacy-policy">{t("privacy")}</Link>
              </li>
              <li className="whitespace-nowrap underline hover:text-primary">
                <Link href="/legal/cookie-policy">{t("cookies")}</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer3 };
