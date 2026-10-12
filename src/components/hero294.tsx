import {
  ArrowRight,
  Braces,
  Cpu,
  Keyboard,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

type HeroFeatureImage = Image & {
  label?: string;
};
interface Feature {
  title: string;
  description: string;
  icon: ElementType<{ className?: string }>;
  color?: string;
  href?: string;
}
interface Image {
  src: string;
  alt: string;
  srcDark?: string;
}

interface HeroFeatureIconsProps {
  badge?: string;
  heading: string;
  description?: string;
  buttonPrimary?: {
    text: string;
    href: string;
  };
  buttonSecondary?: {
    text: string;
    href: string;
  };
  features?: Feature[];
  images?: [HeroFeatureImage, ...HeroFeatureImage[]];
  className?: string;
}

interface Hero294Props extends HeroFeatureIconsProps {}
type Props = Partial<Hero294Props>;

const defaultProps: Hero294Props = {
  badge: "Platform",
  heading: "Shadcn UI Components built for the modern stack.",
  description:
    "Components built with a modern, performant, and accessible foundation.",
  buttonPrimary: {
    text: "Browse blocks",
    href: "https://www.shadcnblocks.com",
  },
  buttonSecondary: {
    text: "View docs",
    href: "https://www.shadcnblocks.com",
  },
  features: [
    {
      title: "Composable patterns",
      description:
        "Ship faster with structured sections and consistent spacing.",
      icon: Braces,
    },
    {
      title: "Design tokens",
      description:
        "Theme and scale colors, type, and radii from a single coherent system.",
      icon: Cpu,
    },
    {
      title: "Accessible defaults",
      description:
        "Keyboard and screen-reader friendly building blocks out of the box.",
      icon: Keyboard,
    },
    {
      title: "Lightning fast",
      description:
        "Optimized bundles and lazy loading for instant page transitions.",
      icon: Zap,
    },
    {
      title: "Developer experience",
      description:
        "Predictable APIs and live examples that mirror production layouts.",
      icon: Sparkles,
    },
    {
      title: "Layered architecture",
      description:
        "Primitives, components, and blocks stack into full pages without lock-in.",
      icon: Layers,
    },
  ],
};

/** Framed preview leads into a divided feature band. */
const MAX_FEATURES = 4;

function LeadImage({
  image,
  className,
}: {
  image: HeroFeatureImage;
  className?: string;
}) {
  const imgClass = cn("size-full object-cover", className);
  if (image.srcDark) {
    return (
      <>
        <img
          src={image.src}
          alt={image.alt}
          className={cn(imgClass, "dark:hidden")}
        />
        <img
          src={image.srcDark}
          alt={image.alt}
          className={cn(imgClass, "hidden dark:block")}
        />
      </>
    );
  }
  return <img src={image.src} alt={image.alt} className={imgClass} />;
}

const Hero294 = (props: Props) => {
  const {
    badge,
    heading,
    description,
    buttonPrimary,
    buttonSecondary,
    features,
    images,
    className,
  } = {
    ...defaultProps,
    ...props,
  };

  const visibleFeatures = (features ?? []).slice(0, MAX_FEATURES);
  const leadImage = images?.[0];

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="mx-auto max-w-3xl space-y-5 text-center">
            {badge && (
              <p className="text-sm font-medium text-muted-foreground">
                {badge}
              </p>
            )}
            <h1 className="text-4xl font-semibold tracking-tight text-pretty lg:text-5xl">
              {heading}
            </h1>
            {description && (
              <p className="text-balance text-muted-foreground lg:text-lg">
                {description}
              </p>
            )}
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              {buttonPrimary && (
                <Button size="lg" className="gap-2" render={<a href={buttonPrimary.href} />} nativeButton={false}>{buttonPrimary.text}<ArrowRight className="size-4" aria-hidden /></Button>
              )}
              {buttonSecondary && (
                <Button variant="outline" size="lg" render={<a href={buttonSecondary.href} />} nativeButton={false}>{buttonSecondary.text}</Button>
              )}
            </div>
          </div>
          {leadImage && (
            <div className="rounded-xl border border-border bg-muted/30 p-3 shadow-sm md:p-4">
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="aspect-video">
                  <LeadImage image={leadImage} />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border md:flex-row md:divide-x md:divide-y-0">
            {visibleFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex flex-1 flex-col gap-3 p-6 text-center md:text-left"
                >
                  <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted md:mx-0">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <p className="font-semibold text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-sm text-balance text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero294 };
