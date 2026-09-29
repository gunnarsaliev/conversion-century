"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "cn";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setProgress(0);
    }, 5000);
  }, [testimonials.length]);

  useEffect(() => {
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentIndex]);

  if (testimonials.length === 0) return null;

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Loved by productivity enthusiasts
          </h1>
          <Button
            variant="outline"
            render={<Link href="/website/reviews" />}
            nativeButton={false}
          >
            Read user reviews
          </Button>
        </div>
        <Accordion
          value={[currentIndex.toString()]}
          onValueChange={(value) => {
            if (value.length) {
              const index = parseInt(value[0]);
              setCurrentIndex(index);
              setProgress(0);
              startTimer();
            }
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
                    <Progress value={progress} className="h-1 w-16 self-end" />
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
