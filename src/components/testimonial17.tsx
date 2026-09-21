"use client";

import { startTransition, useEffect, useState } from "react";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Testimonial17Item {
  quote: string;
  name: string;
  role?: string;
  logoUrl?: string;
  avatarUrl?: string;
}

interface Testimonial17Props {
  className?: string;
  heading?: string;
  testimonials?: Testimonial17Item[];
}

const defaultTestimonials: Testimonial17Item[] = [
  {
    logoUrl:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-wordmark.svg",
    quote:
      "Our team has seen an incredible boost in productivity since adopting this platform. It's a game-changer.",
    name: "Sarah Williams",
    role: "Head of Product, @company",
    avatarUrl:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
  },
  {
    logoUrl:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-wordmark.svg",
    quote:
      "This tool has streamlined our development process and improved team collaboration like never before.",
    name: "David Parker",
    role: "CTO, @company",
    avatarUrl:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
  },
  {
    logoUrl:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-wordmark-white.svg",
    quote:
      "We have reduced our development cycles by 33.2% thanks to the efficiency this platform brings to us.",
    name: "Maria Gonzalez",
    role: "Lead Developer, @company",
    avatarUrl:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Testimonial17 = ({
  className,
  heading = "Teams are thriving with our platform",
  testimonials,
}: Testimonial17Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const items =
    testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    if (!api) {
      return;
    }

    startTransition(() => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("select", () => {
      startTransition(() => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    });
  }, [api]);

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-3 lg:gap-0">
          <h2 className="text-center text-3xl font-bold lg:text-left lg:text-4xl">
            {heading}
          </h2>
          <Carousel setApi={setApi} className="w-full lg:hidden">
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="rounded-2xl border p-8 select-none">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="mb-6 h-8 dark:invert"
                      />
                    ) : null}
                    <p className="mb-10 text-xl font-semibold">
                      {item.quote}
                    </p>
                    <div className="mb-3 flex gap-4">
                      <Avatar className="size-12 rounded-full ring-1 ring-input">
                        {item.avatarUrl ? (
                          <AvatarImage src={item.avatarUrl} alt={item.name} />
                        ) : null}
                        <AvatarFallback>{initials(item.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.role ? (
                          <p className="text-muted-foreground">{item.role}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center">
              {Array.from({ length: count }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "mx-2 inline-block size-3 cursor-pointer rounded-full border-2",
                    index + 1 === current && "border-primary bg-primary",
                  )}
                  onClick={() => api && api.scrollTo(index)}
                />
              ))}
            </div>
          </Carousel>
          <div className="col-span-2 hidden grid-cols-2 items-center gap-6 lg:grid">
            {items[0] ? (
              <div className="rounded-2xl border p-8">
                {items[0].logoUrl ? (
                  <img
                    src={items[0].logoUrl}
                    alt={items[0].name}
                    className="mb-6 h-9 dark:invert"
                  />
                ) : null}
                <p className="mb-10 text-xl font-semibold">
                  {items[0].quote}
                </p>
                <div className="mb-3 flex gap-4">
                  <Avatar className="size-12 rounded-full ring-1 ring-input">
                    {items[0].avatarUrl ? (
                      <AvatarImage
                        src={items[0].avatarUrl}
                        alt={items[0].name}
                      />
                    ) : null}
                    <AvatarFallback>{initials(items[0].name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{items[0].name}</p>
                    {items[0].role ? (
                      <p className="text-muted-foreground">
                        {items[0].role}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-6">
              {items.slice(1, 3).map((item, index) => (
                <div key={index} className="rounded-2xl border p-8">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="mb-6 h-10 dark:invert"
                    />
                  ) : null}
                  <p className="mb-10 text-xl font-semibold">{item.quote}</p>
                  <div className="mb-3 flex gap-4">
                    <Avatar className="size-12 rounded-full ring-1 ring-input">
                      {item.avatarUrl ? (
                        <AvatarImage src={item.avatarUrl} alt={item.name} />
                      ) : null}
                      <AvatarFallback>{initials(item.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.role ? (
                        <p className="text-muted-foreground">{item.role}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial17 };
