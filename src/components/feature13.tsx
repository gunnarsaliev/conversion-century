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
import { CmsImage } from "@/components/cms-image";

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

// A card from the CMS; `icon` is a key of ICONS.
interface Feature13Item {
  title: string;
  description?: string | null;
  href?: string | null;
  icon?: string | null;
}

interface Feature13Props extends FeatureCardListProps {
  // Cards from the CMS, replacing the default ones. They are filtered and
  // linked like the defaults (see `industries`).
  items?: Feature13Item[];
  // Default feature hrefs whose page isn't translated into the current
  // locale; those cards link to the industries list instead.
  hiddenHrefs?: string[];
  // English href → href with the slug it has in the current locale.
  localizedHrefs?: Record<string, string>;
  // Published industries by href (e.g. "/industries/b2b"). When given, only
  // default cards for these industries — and translated into the current
  // locale — are shown, with the industry's image where it has one.
  industries?: { href: string; image?: string }[];
}
type Props = Partial<Feature13Props>;

// Default copy lives in the `Feature13` messages (`features.<key>`).
const DEFAULT_FEATURES = [
  { key: "b2b", icon: "Zap", href: "/industries/b2b" },
  { key: "ecommerce", icon: "Palette", href: "/industries/ecommerce" },
  { key: "professionalServices", icon: "Layers", href: "/industries/professional-services" },
  { key: "financialServices", icon: "Rocket", href: "/industries/financial-sector" },
  { key: "realEstate", icon: "Blocks", href: "/industries/real-estate" },
  { key: "healthcare", icon: "Globe", href: "/industries/healthcare" },
  { key: "legal", icon: "Briefcase", href: "/industries" },
  { key: "travel", icon: "Plane", href: "/industries" },
  { key: "education", icon: "GraduationCap", href: "/industries" },
] as const;

// The icons a card can use, by the name stored in the CMS.
const ICONS = { Zap, Palette, Layers, Rocket, Blocks, Globe, Briefcase, Plane, GraduationCap };

// Placeholder images (template art) for cards whose industry has none, by
// card position.
const PLACEHOLDER_IMAGES = [1, 2, 3, 4, 5, 6].map((n) => `saas-card-detail-${n}-4x3.svg`);

const IMAGE_BASE =
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/";

const Feature13 = (props: Props) => {
  const t = useTranslations("Feature13");
  const {
    eyebrow = t("eyebrow"),
    heading = t("heading"),
    description = t("description"),
    hiddenHrefs = [],
    localizedHrefs = {},
    industries,
    items,
    className,
  } = props;
  const cards: Feature13Item[] =
    items && items.length > 0
      ? items
      : DEFAULT_FEATURES.map(({ key, icon, href }) => ({
          icon,
          href,
          title: t(`features.${key}.title`),
          description: t(`features.${key}.description`),
        }));
  const features =
    props.features ??
    cards.flatMap((card, index): FeatureCardListItem[] => {
      const href = card.href || "/industries";
      const industry = industries?.find((item) => item.href === href);
      if (industries && (!industry || hiddenHrefs.includes(href))) return [];
      const Icon = ICONS[card.icon as keyof typeof ICONS];
      return [
        {
          icon: Icon && <Icon className="size-5" />,
          href: hiddenHrefs.includes(href) ? "/industries" : (localizedHrefs[href] ?? href),
          title: card.title,
          description: card.description ?? "",
          image: {
            src:
              industry?.image ??
              IMAGE_BASE + PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
            alt: card.title,
          },
        },
      ];
    });

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
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
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
                    <CmsImage
                      src={feature.image.src}
                      alt={feature.image.alt}
                      sizes="(min-width: 768px) 20vw, 40vw"
                      wrapperClassName="aspect-4/3 h-full w-full rounded-t-lg"
                      className="object-top transition-opacity hover:opacity-80"
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
