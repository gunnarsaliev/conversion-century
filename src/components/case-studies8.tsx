"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface CaseStudiesCarouselItem {
  id: string;
  logo?: string;
  logoAlt?: string;
  title: string;
  description: string;
  href: string;
  /** Omitted when the case study has no image (a plain background shows). */
  image?: string;
}

interface CaseStudiesCarouselProps {
  title: string;
  description: string;
  items: CaseStudiesCarouselItem[];
  className?: string;
}

export type CaseStudies8Item = CaseStudiesCarouselItem;

interface CaseStudies8Props extends CaseStudiesCarouselProps {}
type Props = Partial<CaseStudies8Props>;

// Placeholder items (template demo data) until real case studies are passed in.
const defaultItems: CaseStudiesCarouselItem[] = [
    {
      id: "pipeline-analytics",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/logos/fictional-company-logo-white-1.svg",
      logoAlt: "Northwind Analytics",
      title: "Unified pipeline analytics in a single view",
      description:
        "How a revenue team unified CRM data and product telemetry to shorten sales cycles and make forecasting review meetings less painful.",
      href: "/case-studies",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/photos3/photo-1-3x4.jpg",
    },
    {
      id: "launch-readiness",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/logos/fictional-company-logo-white-2.svg",
      logoAlt: "Stacklane",
      title: "Coordinating a multi-team product launch",
      description:
        "Design, engineering, and go-to-market aligned on one timeline with shared blocks and checklists so launch week stayed predictable.",
      href: "/case-studies",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/photos3/photo-2-3x4.jpg",
    },
    {
      id: "customer-success",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/logos/fictional-company-logo-white-3.svg",
      logoAlt: "Railway Apps",
      title: "Scaling onboarding without growing headcount",
      description:
        "Automated nudges and in-app guidance replaced one-off emails while support kept a clear view of who needed a human touch.",
      href: "/case-studies",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/photos3/photo-3-3x4.jpg",
    },
    {
      id: "security-review",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/logos/fictional-company-logo-white-4.svg",
      logoAlt: "CipherTrust",
      title: "Passing enterprise security review faster",
      description:
        "The team turned a checklist-heavy review into a tracked workflow so legal and IT could sign off without thrashing the roadmap.",
      href: "/case-studies",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/photos3/photo-4-3x4.jpg",
    },
    {
      id: "design-system",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/logos/fictional-company-logo-white-5.svg",
      logoAlt: "Glyph Studio",
      title: "One design system across marketing and product",
      description:
        "Shared tokens and documented sections cut duplicate UI work and made brand updates roll out consistently across surfaces.",
      href: "/case-studies",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/photos3/photo-5-3x4.jpg",
    },
    {
      id: "revenue-ops",
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/logos/fictional-company-logo-white-6.svg",
      logoAlt: "Cedarline",
      title: "Revenue ops that fits how teams actually work",
      description:
        "Forecasting and pipeline hygiene moved out of spreadsheets into one place so leadership could see risk early without extra ceremony.",
      href: "/case-studies",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/photos3/photo-6-3x4.jpg",
    },
];

const CaseStudies8 = (props: Props) => {
  const t = useTranslations("CaseStudies8");
  const {
    title = t("title"),
    description = t("description"),
    items = defaultItems,
    className,
  } = props;

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mb-6 flex items-end justify-between md:mb-9 lg:mb-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-xl text-muted-foreground">{description}</p>
            <Link
              href="/case-studies"
              className="flex w-fit items-center gap-1.5 font-medium transition-colors hover:text-primary"
            >
              {t("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              aria-label={t("previous")}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              aria-label={t("next")}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="container">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 1,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-5">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-full pl-5 md:min-w-0 md:basis-1/3"
              >
                <Link href={item.href} className="group block rounded-xl">
                  <div className="group relative aspect-4/3 w-full max-w-full overflow-hidden rounded-xl bg-muted-foreground">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute h-full w-full object-cover object-left transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 h-full bg-linear-to-t from-black/80 via-black/28 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-5 text-white md:p-6">
                      <div className="mb-3 flex h-9 items-center pt-3">
                        {item.logo ? (
                          <img
                            src={item.logo}
                            alt={item.logoAlt ?? ""}
                            className="max-h-7 w-auto max-w-[140px] object-contain object-left md:max-h-8 md:max-w-[160px]"
                          />
                        ) : (
                          item.logoAlt && (
                            <span className="text-sm font-medium tracking-wide uppercase">
                              {item.logoAlt}
                            </span>
                          )
                        )}
                      </div>
                      <div className="text-lg font-semibold md:text-xl">
                        {item.title}
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={t("goToSlide", { number: index + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { CaseStudies8 };
