"use client";

import {
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

interface Feature278Props extends FeatureIconListProps {}
type Props = Partial<Feature278Props>;

// Default copy lives in the `Feature278` messages, keyed like the icons.
const DEFAULT_FEATURES = [
  { key: "ongoingSeo", icon: <Search className="size-5" /> },
  { key: "technicalSeo", icon: <Wrench className="size-5" /> },
  { key: "contentStrategy", icon: <FileText className="size-5" /> },
  { key: "internationalSeo", icon: <Globe className="size-5" /> },
  { key: "aiSearch", icon: <Bot className="size-5" /> },
  { key: "digitalPr", icon: <Link2 className="size-5" /> },
  { key: "audits", icon: <BarChart3 className="size-5" /> },
  { key: "localSeo", icon: <MapPin className="size-5" /> },
  { key: "training", icon: <GraduationCap className="size-5" /> },
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
    features = DEFAULT_FEATURES.map(({ key, icon }) => ({
      icon,
      title: t(`features.${key}.title`),
      description: t(`features.${key}.description`),
    })),
    className,
  } = props;
  const items = (features ?? []).slice(0, MAX_FEATURES);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col items-center justify-center">
          <h2 className="relative z-20 mx-auto max-w-3xl py-2 text-center text-5xl font-semibold tracking-tight md:py-7">
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
                <div
                  key={idx}
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature278 };
