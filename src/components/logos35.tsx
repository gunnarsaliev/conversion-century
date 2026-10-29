"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";

const CDN = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos";

interface BrandLogo {
  name: string;
  src: string;
}

interface Logos35Props {
  eyebrow?: string;
  heading?: string;
  footer?: string;
  /** Optional "see all clients" link shown under the grid. */
  viewAllHref?: string;
  logos?: BrandLogo[];
  className?: string;
}

type Props = Partial<Logos35Props>;

// Placeholder logos (template demo data) until real ones are passed in.
const defaultProps: Pick<Logos35Props, "logos"> = {
  logos: [
    { name: "Vercel", src: `${CDN}/vercel-wordmark.svg` },
    { name: "Astro", src: `${CDN}/astro-wordmark.svg` },
    { name: "Supabase", src: `${CDN}/supabase-wordmark.svg` },
    { name: "Figma", src: `${CDN}/figma-wordmark.svg` },
    { name: "Next.js", src: `${CDN}/nextjs-wordmark.svg` },
    { name: "Tailwind CSS", src: `${CDN}/tailwind-wordmark-black.svg` },
    { name: "GitHub", src: `${CDN}/github-wordmark.svg` },
    { name: "Notion", src: `${CDN}/notion.svg` },
    { name: "Slack", src: `${CDN}/slack-icon.svg` },
    { name: "React", src: `${CDN}/react-wordmark.svg` },
    { name: "Shopify", src: `${CDN}/shopify-icon.svg` },
    { name: "Linear", src: `${CDN}/linear-icon.svg` },
  ],
};

const Logos35 = (props: Props) => {
  const t = useTranslations("Logos35");
  const {
    eyebrow = t("eyebrow"),
    heading = t("heading"),
    footer = t("footer"),
    viewAllHref,
    logos = defaultProps.logos!,
    className,
  } = props;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className={cn("py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 lg:grid-cols-6">
          {logos?.map((brand, i) => (
            <div
              key={brand.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center justify-center bg-card p-6 transition-colors duration-200 sm:p-8",
                hovered === i && "bg-muted",
              )}
            >
              {brand.src ? (
                <img
                  loading="lazy"
                  decoding="async"
                  src={brand.src}
                  alt={brand.name}
                  className="h-10 w-36 object-contain opacity-50 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 dark:invert"
                />
              ) : (
                <span className="text-center text-lg font-semibold tracking-tight text-muted-foreground">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {footer && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        )}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </section>
  );
};

export { Logos35 };
