"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Circle } from "lucide-react";
import { cn } from "cn";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { CmsImage } from "@/components/cms-image";
import { BorderBeam } from "@/components/ui/border-beam";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ctaId } from "@/lib/analytics/cta";

interface Image {
  src: string;
  alt: string;
  srcDark?: string;
  /** Intrinsic size; when given, the frame takes the image's aspect ratio. */
  width?: number;
  height?: number;
}
interface Button {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}
interface Badge {
  text: string;
  announcement?: string;
  url?: string;
}
interface Logo {
  src: string;
  alt: string;
  srcDark?: string;
  className?: string;
}

interface HeroSaasProps {
  className?: string;
  /** Rendered above the badge, e.g. a breadcrumb. */
  breadcrumb?: ReactNode;
  /** Rendered right above the CTA buttons, e.g. highlight pills. */
  beforeButtons?: ReactNode;
  heading: string;
  description: string;
  buttons?: Buttons;
  logos?: Logo[];
  logosLabel?: string;
  badge?: Badge;
  images?: Image[];
}

interface Hero118Props extends HeroSaasProps {}
type Props = Partial<Hero118Props>;

const defaultProps: Hero118Props = {
  badge: {
    text: "Now in Beta",
    announcement: "Check out our latest updates",
  },
  heading: "The AI-powered CRM solution.",
  description:
    "Let AI help you manage accounts, deals, and handoffs in one place. Experience the future of CRM with AI-powered insights and automation.",
  buttons: {
    primary: { text: "Get started", url: "#" },
    secondary: { text: "Learn more", url: "#" },
  },
  logos: [
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-1.svg",
      alt: "Company logo 1",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-2.svg",
      alt: "Company logo 2",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-3.svg",
      alt: "Company logo 3",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-4.svg",
      alt: "Company logo 4",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-5.svg",
      alt: "Company logo 5",
      className: "h-5 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-6.svg",
      alt: "Company logo 6",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-7.svg",
      alt: "Company logo 7",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-8.svg",
      alt: "Company logo 8",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-9.svg",
      alt: "Company logo 9",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-10.svg",
      alt: "Company logo 10",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-11.svg",
      alt: "Company logo 11",
      className: "h-7 w-auto",
    },
  ],
  images: [
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9.png",
      srcDark: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9-dark.png",
      alt: "CRM pipeline dashboard",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-hero/saas-hero-2-16x9.png",
      srcDark: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-hero/saas-hero-2-16x9-dark.png",
      alt: "Deal and activity view",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-hero/saas-hero-3-16x9.png",
      srcDark: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-hero/saas-hero-3-16x9-dark.png",
      alt: "Team performance overview",
    },
  ],
};

const Hero118 = (props: Props) => {
  const {
    heading,
    description,
    buttons,
    badge,
    images,
    logos,
    logosLabel,
    className,
    breadcrumb,
    beforeButtons,
  } = {
    ...defaultProps,
    ...props,
  };

  const heroImage = images?.[0];
  const carouselLogos = [...(logos ?? []), ...(logos ?? [])];

  return (
    <section
      className={cn(
        "overflow-hidden py-10 font-sans md:py-14",
        className,
      )}
    >
      <div className="container">
        <div className="flex flex-col">
          <div
            className={cn(
              "grid grid-cols-1 items-center gap-8",
              heroImage && "xl:grid-cols-2",
            )}
          >
            <div className="flex h-full flex-col justify-center">
              <div className="flex w-full flex-col items-start gap-6">
                <div className="flex w-full max-w-2xl flex-col items-start gap-4">
                  {breadcrumb}
                  {badge?.text && (
                    <div className="flex w-fit items-center gap-2 rounded-md bg-muted px-[0.625rem] py-1">
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                      <div className="font-mono text-xs leading-relaxed text-muted-foreground uppercase">
                        {badge.text}
                      </div>
                    </div>
                  )}
                  <h1 className="text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-none md:tracking-tighter">
                    {heading}
                  </h1>
                  <div className="text-base leading-snug text-muted-foreground md:text-lg">
                    {description}
                  </div>
                </div>
                {beforeButtons}
                <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  {buttons?.secondary && (
                    <div className="w-full flex-1 xl:w-fit xl:flex-initial">
                      <Button variant="secondary" className="border-muted2 block h-fit w-full rounded-xl border px-5 py-3 text-center text-[0.9375rem] leading-normal font-medium xl:w-fit" data-cta={ctaId(buttons.secondary.url)} data-cta-location="hero" render={<Link href={buttons.secondary.url} />} nativeButton={false}>{buttons.secondary.text}</Button>
                    </div>
                  )}
                  {buttons?.primary && (
                    <div className="w-full flex-1 xl:w-fit xl:flex-initial">
                      <Button className="group flex h-fit w-full items-center justify-center gap-1 rounded-xl py-3 pr-4 pl-5 text-[0.9375rem] leading-normal font-medium transition-all duration-300 hover:pr-7 xl:w-fit" data-cta={ctaId(buttons.primary.url)} data-cta-location="hero" render={<Link href={buttons.primary.url} />} nativeButton={false}><div>{buttons.primary.text}</div><ArrowRight className="size-6! transition-transform duration-300 group-hover:translate-x-3" /></Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {heroImage && (
              <div className="mx-auto w-full max-w-md xl:mr-0">
                <div className="border-muted2 relative overflow-hidden rounded-[1.25rem] border">
                  <AspectRatio
                    ratio={
                      heroImage.width && heroImage.height
                        ? heroImage.width / heroImage.height
                        : 1.5378787878787878
                    }
                  >
                    {/* next/image (encoded /_next/image URL) rather than a raw
                        <img fetchPriority>: React puts high-priority image URLs
                        into a Link response header, and non-ASCII characters
                        in CMS file names (e.g. ’) crash that header. */}
                    <CmsImage
                      src={heroImage.src}
                      alt={heroImage.alt}
                      sizes="448px"
                      // Above the fold, so usually the LCP element.
                      preload
                      wrapperClassName="size-full"
                      className="object-center"
                    />
                  </AspectRatio>
                  <BorderBeam duration={8} size={100} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {logos && logos.length > 0 && (
        <div className="mt-4 w-full py-4">
          <div className="container">
            <div className="mx-auto flex max-w-[72.5rem] flex-col gap-4">
              {logosLabel && (
                <p className="text-center text-lg text-foreground">
                  {logosLabel}
                </p>
              )}
              <div className="py-4">
                <Carousel
                  opts={{
                    loop: true,
                    align: "center",
                  }}
                  plugins={[
                    AutoScroll({
                      speed: 1,
                    }),
                    Autoplay({
                      playOnInit: true,
                      delay: 1000,
                    }),
                  ]}
                  className="relative w-full max-w-(--breakpoint-2xl) overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
                >
                  <CarouselContent className="items-center">
                    {carouselLogos.map((logo, index) => (
                      <CarouselItem
                        key={`${logo.src}-${index}`}
                        className="w-fit basis-auto px-7"
                      >
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className={cn(
                            "h-8 w-auto object-contain opacity-60 dark:invert",
                            logo.className,
                          )}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export { Hero118 };
