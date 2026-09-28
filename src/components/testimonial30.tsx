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
const testimonials = [
  {
    company: "Descript",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/icons/descript.svg",
    wordmark:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    author: "Samantha Lee",
    role: "Productivity Coach, Descript",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/portraits/alexander-hipp-iEEBWgY_6lA-unsplash.jpg",
    quote:
      "“This product transformed my daily routine. The intuitive task management and reminders keep me on track like never before.”",
    outcome: (
      <p className="text-muted-foreground">
        Completed{" "}
        <span className="font-medium text-foreground">
          12 major projects in 2 months
        </span>
      </p>
    ),
  },
  {
    company: "Ramp",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/icons/ramp.svg",
    wordmark:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    author: "Carlos Rivera",
    role: "Freelance Designer, Ramp",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/portraits/joseph-gonzalez-iFgRcqHznqg-unsplash.jpg",
    quote:
      "“With this tool, I finally have a clear overview of my deadlines. The calendar sync is a game changer for my workflow.”",
    outcome: (
      <p className="text-muted-foreground">
        Increased productivity by{" "}
        <span className="font-medium text-foreground">40% in one quarter</span>
      </p>
    ),
  },
  {
    company: "Watershed",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/icons/watershed.svg",
    wordmark:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    author: "Priya Patel",
    role: "Operations Lead, watershed",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/portraits/nima-motaghian-nejad-_omdf_EgRUo-unsplash.jpg",
    quote:
      "“The meeting notes and summaries feature saves me hours every week. I can focus on what matters instead of paperwork, thanks to this product.”",
    outcome: (
      <p className="text-muted-foreground">
        Saved over 30 hours,{" "}
        <span className="font-medium text-foreground">
          reduced admin time by 60%
        </span>
      </p>
    ),
  },
];

interface Testimonial30Props {
  className?: string;
}

const Testimonial30 = ({ className }: Testimonial30Props) => {
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
  }, []);

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
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
                      <img
                        src={testimonial.logo}
                        alt={testimonial.company}
                        className="h-4 invert dark:invert-0"
                      />
                    </span>
                    <p className="text-lg font-medium tracking-tight">
                      {testimonial.company}
                    </p>
                  </div>
                  <div className="hidden text-base font-normal md:block">
                    {testimonial.outcome}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-12 px-0 py-4 md:flex-row md:items-center md:py-9 lg:px-12">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={208}
                  height={208}
                  className="aspect-square max-w-52 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col items-start">
                  <img
                    src={testimonial.wordmark}
                    alt={testimonial.company}
                    className="h-6 dark:invert"
                  />
                  <p className="font-hedvigLettersSerif mt-6 max-w-2xl text-2xl text-foreground">
                    {testimonial.quote}
                  </p>
                  <div className="flex w-full justify-between">
                    <div>
                      <p className="mt-3 text-lg text-sm font-medium">
                        {testimonial.author}
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

export { Testimonial30 };
