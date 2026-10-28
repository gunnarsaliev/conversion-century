import {
  Blocks,
  Briefcase,
  Globe,
  GraduationCap,
  Layers,
  Palette,
  Plane,
  Rocket,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";

interface FeatureCardListItem {
  title: string;
  description: string;
  image: Image;
  href?: string;
  icon?: React.ReactNode;
  label?: string;
}
interface Image {
  src: string;
  alt: string;
  srcDark?: string;
}

interface FeatureCardListProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  features?: FeatureCardListItem[];
  className?: string;
}

interface Feature13Props extends FeatureCardListProps {
  // Default feature hrefs whose page isn't translated into the current
  // locale; those cards link to the industries list instead.
  hiddenHrefs?: string[];
  // Published industries by href (e.g. "/industries/b2b"). When given, only
  // default cards for these industries — and translated into the current
  // locale — are shown, with the industry's image where it has one.
  industries?: { href: string; image?: string }[];
}
type Props = Partial<Feature13Props>;

// Default copy lives in the `Feature13` messages (`features.<key>`).
const DEFAULT_FEATURES = [
  { key: "b2b", icon: <Zap className="size-5" />, image: "saas-card-detail-1-4x3.svg", href: "/industries/b2b" },
  { key: "ecommerce", icon: <Palette className="size-5" />, image: "saas-card-detail-2-4x3.svg", href: "/industries/ecommerce" },
  { key: "professionalServices", icon: <Layers className="size-5" />, image: "saas-card-detail-3-4x3.svg", href: "/industries/professional-services" },
  { key: "financialServices", icon: <Rocket className="size-5" />, image: "saas-card-detail-4-4x3.svg", href: "/industries/financial-sector" },
  { key: "realEstate", icon: <Blocks className="size-5" />, image: "saas-card-detail-5-4x3.svg", href: "/industries/real-estate" },
  { key: "healthcare", icon: <Globe className="size-5" />, image: "saas-card-detail-6-4x3.svg", href: "/industries/healthcare" },
  { key: "legal", icon: <Briefcase className="size-5" />, image: "saas-card-detail-1-4x3.svg", href: "/industries" },
  { key: "travel", icon: <Plane className="size-5" />, image: "saas-card-detail-2-4x3.svg", href: "/industries" },
  { key: "education", icon: <GraduationCap className="size-5" />, image: "saas-card-detail-3-4x3.svg", href: "/industries" },
] as const;

const IMAGE_BASE =
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/";

const Feature13 = (props: Props) => {
  const t = useTranslations("Feature13");
  const {
    eyebrow = t("eyebrow"),
    heading = t("heading"),
    description = t("description"),
    hiddenHrefs = [],
    industries,
    features = DEFAULT_FEATURES.flatMap(({ key, icon, image, href }): FeatureCardListItem[] => {
      const industry = industries?.find((item) => item.href === href);
      if (industries && (!industry || hiddenHrefs.includes(href))) return [];
      return [
        {
          icon,
          href: hiddenHrefs.includes(href) ? "/industries" : href,
          title: t(`features.${key}.title`),
          description: t(`features.${key}.description`),
          image: { src: industry?.image ?? IMAGE_BASE + image, alt: t(`features.${key}.title`) },
        },
      ];
    }),
    className,
  } = props;

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        {(eyebrow || heading || description) && (
          <div className="mx-auto mb-9 max-w-5xl text-center lg:mb-14">
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold tracking-wide text-primary uppercase">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-lg bg-muted"
            >
              <div className="flex justify-between gap-10 border-b">
                <div className="flex flex-col justify-start gap-8 py-6 pl-4 md:gap-14 md:py-10 md:pl-8 lg:justify-normal">
                  <span className="font-mono text-xs text-muted-foreground">
                    {feature.label}
                  </span>
                  <Link href={feature.href ?? "#"}>
                    <h3 className="text-2xl font-semibold tracking-tight transition-all hover:text-primary hover:opacity-80 sm:text-3xl lg:text-4xl">
                      {feature.title}
                    </h3>
                  </Link>
                </div>
                <div className="w-2/5 shrink-0 rounded-r-lg border-l md:w-1/3">
                  <Link href={feature.href ?? "#"}>
                    <img
                      src={feature.image.src}
                      alt={feature.image.alt}
                      className="aspect-4/3 h-full w-full rounded-t-lg object-cover object-top transition-opacity hover:opacity-80"
                    />
                  </Link>
                </div>
              </div>
              <p className="p-4 text-muted-foreground md:p-8">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature13 };
