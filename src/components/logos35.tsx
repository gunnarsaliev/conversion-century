"use client";

import { useState } from "react";
import { cn } from "cn";

const CDN = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos";

interface BrandLogo {
  name: string;
  src: string;
}

interface Logos35Props {
  eyebrow?: string;
  heading?: string;
  footer?: string;
  logos?: BrandLogo[];
  className?: string;
}

type Props = Partial<Logos35Props>;

const defaultProps: Logos35Props = {
  eyebrow: "Trusted by teams at",
  heading: "Built for the modern stack",
  footer: "Integrates with your existing workflow — no migration required.",
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
  const { eyebrow, heading, footer, logos, className } = {
    ...defaultProps,
    ...props,
  };
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
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
              <img
                src={brand.src}
                alt={brand.name}
                className="h-10 w-36 object-contain opacity-50 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 dark:invert"
              />
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </div>
    </section>
  );
};

export { Logos35 };
