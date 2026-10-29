"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
type Testimonial30Item = {
  company: string;
  quote: string;
  name: string;
  role: string;
  logoUrl?: string;
};

interface Testimonial30Props {
  testimonials: Testimonial30Item[];
  className?: string;
}

const Testimonial30 = ({ testimonials, className }: Testimonial30Props) => {
  const t = useTranslations("Testimonial30");
  const [currentIndex, setCurrentIndex] = useState(0);
  // Rotation is driven by the progress bar's CSS animation (its
  // animationend advances the slide), so there's no timer re-rendering the
  // section while it plays. It's paused while the section is off screen.
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className={cn("py-32", className)}>
      <div className="container">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            {t("heading")}
          </h2>
          <Button
            variant="outline"
            render={<Link href="/reviews" />}
            nativeButton={false}
          >
            {t("cta")}
          </Button>
        </div>
        <Accordion
          value={[currentIndex.toString()]}
          onValueChange={(value) => {
            if (value.length) setCurrentIndex(parseInt(value[0]));
          }}
        >
          {testimonials.map((testimonial, index) => (
            <AccordionItem
              key={index}
              value={index.toString()}
              className="items-center"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center gap-4">
                  <div className="flex max-w-3xs flex-1 items-center gap-4">
                    {testimonial.logoUrl && (
                      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={testimonial.logoUrl}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>
                    )}
                    <p className="text-lg font-medium tracking-tight">
                      {testimonial.company}
                    </p>
                  </div>
                  <p className="hidden text-base font-normal text-muted-foreground md:block">
                    {testimonial.name}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-12 px-0 py-4 md:flex-row md:items-center md:py-9 lg:px-12">
                {testimonial.logoUrl && (
                  <div className="flex aspect-square w-full max-w-52 shrink-0 items-center justify-center rounded-lg border bg-white p-8">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={testimonial.logoUrl}
                      alt={testimonial.company}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col items-start">
                  <p className="font-hedvigLettersSerif max-w-2xl text-2xl text-foreground">
                    “{testimonial.quote}”
                  </p>
                  <div className="flex w-full justify-between">
                    <div>
                      <p className="mt-3 text-lg text-sm font-medium">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                    {index === currentIndex && (
                      <div
                        role="presentation"
                        className="h-1 w-16 self-end overflow-hidden rounded-full bg-muted"
                      >
                        {/* key restarts the animation on every slide change,
                            including a manual pick. */}
                        <div
                          key={currentIndex}
                          className={cn(
                            "h-full origin-left animate-progress-fill bg-primary",
                            !inView && "[animation-play-state:paused]",
                          )}
                          onAnimationEnd={() =>
                            setCurrentIndex(
                              (prev) => (prev + 1) % testimonials.length,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { Testimonial30, type Testimonial30Item };
