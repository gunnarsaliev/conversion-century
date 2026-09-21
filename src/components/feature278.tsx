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

const defaultProps: Feature278Props = {
  heading: "Complete Support for Your Organic Presence",
  description:
    "Organic growth depends on more than one channel or isolated SEO task. We connect strategy, website performance, content, authority and measurement into one coordinated approach.",
  features: [
    {
      icon: <Search className="size-5" />,
      title: "Ongoing SEO Management",
      description:
        "A complete monthly SEO partnership covering research, strategy, implementation, monitoring and continuous improvement.",
    },
    {
      icon: <Wrench className="size-5" />,
      title: "Technical SEO",
      description:
        "Technical analysis and practical implementation support that helps search engines crawl, understand and index your website effectively.",
    },
    {
      icon: <FileText className="size-5" />,
      title: "SEO Content Strategy",
      description:
        "Expert-led content planning, creation and optimisation built to strengthen visibility across both traditional and AI powered search.",
    },
    {
      icon: <Globe className="size-5" />,
      title: "International SEO",
      description:
        "Market-specific organic strategies for businesses expanding across new countries, languages and audiences.",
    },
    {
      icon: <Bot className="size-5" />,
      title: "AI Search Optimisation",
      description:
        "Stronger content, authority and brand signals that improve your visibility across AI-powered discovery and recommendation experiences.",
    },
    {
      icon: <Link2 className="size-5" />,
      title: "Digital PR & Link Building",
      description:
        "Relevant editorial coverage, brand mentions and high-quality links that build lasting authority not artificial volume.",
    },
    {
      icon: <BarChart3 className="size-5" />,
      title: "SEO Audits",
      description:
        "Uncover the technical, content and authority issues limiting your website and receive a clear, prioritised roadmap for improvement.",
    },
    {
      icon: <MapPin className="size-5" />,
      title: "Local SEO",
      description:
        "Improve your local search, Google Maps, and directory visibility to reach more customers across your target locations.",
    },
    {
      icon: <GraduationCap className="size-5" />,
      title: "Organic Search Training",
      description:
        "Equip your team with practical SEO and AI search knowledge tailored to your business, industry and responsibilities.",
    },
  ],
};

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
  const { heading, description, features, className } = {
    ...defaultProps,
    ...props,
  };
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
