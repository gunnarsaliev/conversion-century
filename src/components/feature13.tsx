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
import { cn } from "cn";

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

interface Feature13Props extends FeatureCardListProps {}
type Props = Partial<Feature13Props>;

const defaultProps: Feature13Props = {
  eyebrow: "Industry Expertise",
  heading: "Experience in the Markets You Compete In",
  description:
    "We tailor SEO strategy to the buying behaviour, regulatory context and competitive dynamics of your industry.",
  features: [
    {
      icon: <Zap className="size-5" />,
      title: "B2B SEO",
      description:
        "Generate qualified demand for complex products and services through search strategies aligned with longer decision-making journeys.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-1-4x3.svg",
        alt: "B2B SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Palette className="size-5" />,
      title: "E-commerce SEO",
      description:
        "Strengthen category and product visibility, improve discovery and turn organic search into a scalable revenue channel.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-2-4x3.svg",
        alt: "E-commerce SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Layers className="size-5" />,
      title: "Professional Services SEO",
      description:
        "Build authority, trust and qualified enquiries for expertise-led businesses operating in competitive markets.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-3-4x3.svg",
        alt: "Professional Services SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Rocket className="size-5" />,
      title: "Financial Services SEO",
      description:
        "Develop organic visibility in regulated financial markets where accuracy, expertise and trust are essential.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-4-4x3.svg",
        alt: "Financial Services SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Blocks className="size-5" />,
      title: "Real Estate SEO",
      description:
        "Reach buyers, tenants, owners and investors through locally and commercially relevant property-search strategies.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-5-4x3.svg",
        alt: "Real Estate SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Globe className="size-5" />,
      title: "Healthcare SEO",
      description:
        "Build patient trust and organic visibility through accurate, expert-led content and locally focused healthcare search strategies.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-6-4x3.svg",
        alt: "Healthcare SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Briefcase className="size-5" />,
      title: "Legal SEO",
      description:
        "Win visibility for high-value practice areas and build the credibility prospective clients look for before they enquire.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-1-4x3.svg",
        alt: "Legal SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <Plane className="size-5" />,
      title: "Travel & Hospitality SEO",
      description:
        "Capture demand across research and booking journeys with destination, property and experience-led search strategies.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-2-4x3.svg",
        alt: "Travel & Hospitality SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
    {
      icon: <GraduationCap className="size-5" />,
      title: "Education SEO",
      description:
        "Reach prospective students and families with programme and course visibility strategies built for long research cycles.",
      image: {
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-details/saas-card-detail-3-4x3.svg",
        alt: "Education SEO",
      },
      href: "https://www.shadcnblocks.com",
    },
  ],
};

const Feature13 = (props: Props) => {
  const { eyebrow, heading, description, features, className } = {
    ...defaultProps,
    ...props,
  };

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
                  <a href={feature.href}>
                    <h3 className="text-2xl font-semibold tracking-tight transition-all hover:text-primary hover:opacity-80 sm:text-3xl lg:text-4xl">
                      {feature.title}
                    </h3>
                  </a>
                </div>
                <div className="w-2/5 shrink-0 rounded-r-lg border-l md:w-1/3">
                  <a href={feature.href}>
                    <img
                      src={feature.image.src}
                      alt={feature.image.alt}
                      className="aspect-4/3 h-full w-full rounded-t-lg object-cover object-top transition-opacity hover:opacity-80"
                    />
                  </a>
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
