"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

export type ReviewType = {
  author: {
    image?: string;
    name: string;
    role?: string;
  };
  comment: SerializedEditorState;
  company: {
    name: string;
    image?: string;
    link?: string;
  };
};

interface ReviewCardType {
  review: ReviewType;
}

interface ReviewsCarouselProps {
  reviews?: ReviewType[];
}

interface Reviews22Props {
  className?: string;
  reviews: ReviewType[];
}

// "Jane Doe" -> "JD", "Acme" -> "A".
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const XL_REVIEW_CARD_COUNT = 6;
const LG_REVIEW_CARD_COUNT = 4;

const Reviews22 = ({ reviews, className }: Reviews22Props) => {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");

  const [isOpen, setIsOpen] = useState(false);

  const [mounted] = useState(() => typeof window !== "undefined");

  function getReviewCardCount() {
    if (isXl) return XL_REVIEW_CARD_COUNT;

    if (isLg) return LG_REVIEW_CARD_COUNT;
    return reviews.length;
  }

  const reviewCardCount = getReviewCardCount();

  const visibleReviews = reviews.slice(0, reviewCardCount);
  const hiddenReviews = reviews.slice(reviewCardCount);

  if (!mounted) return null;

  return (
    <section className={cn("overflow-hidden py-32", className)}>
      <div className="container">
        <div className="mx-auto mb-10 max-w-100">
          <h2 className="text-center font-serif text-4xl">
     Positive Reviews From Our Client
          </h2>
        </div>
        {isLg ? (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="mb-7.5 grid grid-cols-2 gap-7.5 xl:grid-cols-3">
              {visibleReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-7.5 xl:grid-cols-3">
                {hiddenReviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </div>
            </CollapsibleContent>
            <div
              className={cn(
                "flex items-center justify-center py-5",
                "relative before:absolute before:inset-x-0 before:bottom-full before:h-70 before:bg-linear-to-t before:from-background",
                isOpen && "before:hidden",
              )}
            >
              <CollapsibleTrigger render={<Button size="lg" />}>{isOpen ? "Show Less" : "Show More"}</CollapsibleTrigger>
            </div>
          </Collapsible>
        ) : (
          <ReviewsCarousel reviews={reviews} />
        )}
      </div>
    </section>
  );
};

const ReviewCard = ({ review }: ReviewCardType) => {
  if (!review) return;

  const { company, author, comment } = review;

  const companyContent = (
    <>
      {company.image && (
        <div className="size-10 shrink-0 overflow-hidden rounded-sm">
          <img
            src={company.image}
            alt={company.name}
            className="block size-full object-contain object-center"
          />
        </div>
      )}
      <span className="text-sm font-medium underline-offset-2 group-hover:underline">
        {company.name}
      </span>
    </>
  );

  return (
    <Card className="h-full rounded-lg px-4 py-5">
      <CardContent className="flex h-full flex-col justify-between p-0">
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <Avatar className="size-12.5 border">
              {author.image && (
                <AvatarImage src={author.image} alt={author.name} />
              )}
              <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <h3 className="font-serif text-base leading-normal">
                {author.name}
              </h3>
              {author.role && (
                <span className="text-xs text-muted-foreground">
                  {author.role}
                </span>
              )}
            </div>
          </div>
          <RichText
            data={comment}
            className="space-y-2 text-sm leading-relaxed text-muted-foreground"
          />
        </div>
        <div className="mt-auto space-y-3 pt-3">
          <Separator />
          {company.link ? (
            <a
              href={company.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              {companyContent}
            </a>
          ) : (
            <div className="flex items-center gap-3">{companyContent}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewsCarousel = ({ reviews }: ReviewsCarouselProps) => {
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onScroll = (emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
      setScrollProgress(progress * 100);
    };

    onScroll(emblaApi);
    emblaApi
      .on("reInit", onScroll)
      .on("scroll", onScroll)
      .on("slideFocus", onScroll);

    return () => {
      emblaApi.off("reInit", onScroll);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("slideFocus", onScroll);
    };
  }, [emblaApi]);

  if (!reviews) return;

  return (
    <div className="space-y-6">
      <Carousel setApi={setEmblaApi} className="[&>div]:overflow-visible">
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem
              className="sm:basis-9/12 md:basis-150 lg:basis-1/2 xl:basis-1/3"
              key={index}
            >
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="relative h-1 w-full overflow-hidden bg-muted">
        <div
          className="absolute inset-y-0 -left-full w-full bg-primary transition-transform"
          style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
        />
      </div>
    </div>
  );
};

export { Reviews22 };
