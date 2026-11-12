"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  FileText,
  Globe,
  GraduationCap,
  Link2,
  MapPin,
  Search,
  Wrench,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import type { CmsLink } from "@/lib/page-content";

interface FeatureIconListItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
}

interface FeatureIconListProps {
  heading: string;
  description?: string;
  features?: FeatureIconListItem[];
  className?: string;
}

// A card from the CMS; `icon` is a key of ICONS.
interface Feature278Item {
  title: string;
  description?: string | null;
  href?: string | null;
  icon?: string | null;
}

interface Feature278Props extends FeatureIconListProps {
  // Cards from the CMS, replacing the default ones. Their hrefs go through
  // hiddenHrefs / localizedHrefs like the defaults.
  items?: Feature278Item[];
  // The "view all services" link under the cards.
  viewAll?: CmsLink;
  // Default feature hrefs whose page isn't translated into the current
  // locale; those cards link to the services list instead.
  hiddenHrefs?: string[];
  // English href → href with the slug it has in the current locale.
  localizedHrefs?: Record<string, string>;
}
type Props = Partial<Feature278Props>;

// The icons a card can use, by the name stored in the CMS.
const ICONS = {
  Search,
  Wrench,
  FileText,
  Globe,
  Bot,
  Link2,
  BarChart3,
  MapPin,
  GraduationCap,
};

// Default copy lives in the `Feature278` messages, keyed like the icons.
const DEFAULT_FEATURES = [
  { key: "ongoingSeo", icon: "Search", href: "/services/ongoing-seo-management" },
  { key: "technicalSeo", icon: "Wrench", href: "/services/technical-seo" },
  { key: "contentStrategy", icon: "FileText", href: "/services/content-strategy-and-copywriting" },
  { key: "internationalSeo", icon: "Globe", href: "/services/international-seo" },
  { key: "aiSearch", icon: "Bot", href: "/services/ai-search-optimization" },
  { key: "digitalPr", icon: "Link2", href: "/services/link-building-and-digital-pr" },
  { key: "audits", icon: "BarChart3", href: "/services/seo-audit" },
  { key: "localSeo", icon: "MapPin", href: "/services/local-seo" },
  { key: "training", icon: "GraduationCap", href: "/services/organic-search-training" },
] as const;

const MAX_FEATURES = 9;

const COLORS = [
  { color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { color: "text-green-500", bgColor: "bg-green-500/10" },
  { color: "text-sky-500", bgColor: "bg-sky-500/10" },
  { color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { color: "text-teal-500", bgColor: "bg-teal-500/10" },
  { color: "text-red-500", bgColor: "bg-red-500/10" },
  { color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
];

const Feature278 = (props: Props) => {
  const t = useTranslations("Feature278");
  const {
    heading = t("heading"),
    description = t("description"),
    hiddenHrefs = [],
    localizedHrefs = {},
    items: cmsItems,
    viewAll,
    className,
  } = props;
  const cards: Feature278Item[] =
    cmsItems && cmsItems.length > 0
      ? cmsItems
      : DEFAULT_FEATURES.map(({ key, icon, href }) => ({
          icon,
          href,
          title: t(`features.${key}.title`),
          description: t(`features.${key}.description`),
        }));
  const features =
    props.features ??
    cards.map(({ title, description, href, icon }): FeatureIconListItem => {
      const Icon = ICONS[icon as keyof typeof ICONS];
      return {
        title,
        description: description ?? "",
        icon: Icon && <Icon className="size-5" />,
        href: !href || hiddenHrefs.includes(href) ? undefined : (localizedHrefs[href] ?? href),
      };
    });
  const items = (features ?? []).slice(0, MAX_FEATURES);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <h2 className="relative z-20 mx-auto max-w-3xl py-2 text-center text-3xl font-semibold tracking-tight sm:text-4xl md:py-7 md:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="relative z-20 mx-auto max-w-2xl text-center text-muted-foreground lg:text-lg">
              {description}
            </p>
          )}

          <div className="relative grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => {
              const { color, bgColor } = COLORS[idx % COLORS.length];
              return (
                <Link
                  key={idx}
                  href={item.href ?? "/services"}
                  className="group relative block h-full w-full p-2"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {hoveredIndex === idx && (
                      <motion.span
                        className={cn(
                          "absolute inset-0 block h-full w-full rounded-2xl",
                          bgColor,
                        )}
                        layoutId="hoverBackground"
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "relative z-20 flex h-full flex-col items-start justify-start gap-2 rounded-3xl bg-background p-5",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-12 flex size-15 items-center justify-center rounded-2xl bg-background",
                        color,
                        bgColor,
                      )}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            href={viewAll?.href || "/services"}
            className="mt-10 flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
          >
            {viewAll?.label || t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export { Feature278 };
