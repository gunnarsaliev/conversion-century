import { cn } from "cn";

interface FeatureIconListItem {
  title: string;
  description: string;
  href?: string;
}

interface FeatureIconListProps {
  heading: string;
  description?: string;
  features?: FeatureIconListItem[];
  className?: string;
}

interface Feature67Props extends FeatureIconListProps {}
type Props = Partial<Feature67Props>;

const defaultProps: Feature67Props = {
  heading: "Build faster with production ready features",
  description:
    "Every component is built with React, Tailwind CSS, and shadcn/ui. Copy, paste, and customize to match your brand in minutes.",
  features: [
    {
      title: "Full Source Code",
      description:
        "Every block ships as plain React you own. No runtime dependency, no SDK lock-in, just copy and customize.",
    },
    {
      title: "Responsive Design",
      description:
        "Every block adapts seamlessly from mobile to desktop with Tailwind's mobile-first utility classes.",
    },
    {
      title: "Accessibility & Usability",
      description:
        "Built on Radix UI primitives with proper ARIA attributes, keyboard navigation, and focus management.",
    },
    {
      title: "TypeScript Native",
      description:
        "Fully typed props and interfaces so your editor catches issues before they reach production.",
    },
    {
      title: "Customizable",
      description:
        "Override any prop, swap icons, adjust spacing — every block is designed to be extended, not locked down.",
    },
    {
      title: "Production Ready",
      description:
        "Battle-tested in real projects. No placeholder hacks, no lorem ipsum — clean code you can ship today.",
    },
    {
      title: "Registry Compatible",
      description:
        "Install blocks directly with the shadcn CLI. Dependencies and registry items are listed in every block's MDX.",
    },
    {
      title: "Framework Agnostic",
      description:
        "Plain ESM + React that works with Next.js, Vite, Remix, and Astro without any Shadcnblocks SDK.",
    },
    {
      title: "Consistent Spacing",
      description:
        "Shared section padding, container widths, and gap scales so blocks stack into cohesive pages.",
    },
    {
      title: "Theme Tokens",
      description:
        "All colors come from your shadcn/ui theme — foreground, muted, primary, card — no hardcoded values.",
    },
    {
      title: "Copy Paste Workflow",
      description:
        "Browse the explorer, preview with your theme, then copy the code directly into your project.",
    },
    {
      title: "Open Source",
      description:
        "MIT-licensed source code you own completely. Fork it, modify it, sell products built with it.",
    },
  ],
};

const MAX_FEATURES = 6;

const Feature67 = (props: Props) => {
  const { heading, description, features, className } = {
    ...defaultProps,
    ...props,
  };
  const items = (features ?? []).slice(0, MAX_FEATURES);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col items-start gap-8 lg:gap-12 lg:px-16 xl:flex-row xl:gap-16">
          <div className="flex flex-col gap-4 xl:basis-1/3">
            <h2 className="text-3xl font-semibold tracking-tight md:shrink-0 md:text-4xl lg:max-w-3xl lg:text-5xl">
              {heading}
            </h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="grid w-full gap-6 md:grid-cols-2 xl:basis-2/3">
            {items.map((feature, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-accent p-6 md:p-8"
              >
                <div>
                  <h3 className="mb-3 text-sm font-medium text-accent-foreground md:text-base">
                    {feature.title}
                  </h3>
                  <div className="text-sm font-medium text-muted-foreground md:text-base">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature67 };
