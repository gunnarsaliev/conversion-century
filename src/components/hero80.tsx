"use client";

import { Star } from "lucide-react";
import { cn } from "cn";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Reviews {
  count: number;
  rating: number;
  avatars: Avatar[];
}
interface Image {
  src: string;
  alt: string;
  srcDark?: string;
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
interface Avatar {
  src: string;
  alt: string;
}

interface HeroSocialProofProps {
  heading: string;
  description: string;
  badge?: Badge;
  buttons?: Buttons;
  imagesPortrait?: Image[];
  reviews?: Reviews;
  className?: string;
}

interface Hero80Props extends HeroSocialProofProps {
  subheading?: string;
}
type Props = Partial<Hero80Props>;

const defaultProps: Hero80Props = {
  badge: {
  text: "shadcnblocks.com",
  url: "https://www.shadcnblocks.com",
},
  heading: "Introducing the world's best marketing software.",
  description: "Loved by marketers around the world—plan campaigns, track results, and grow faster with the tools teams actually rely on.",
  buttons: {
    primary: {
      text: "Get Started",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View Reviews",
      url: "https://www.shadcnblocks.com",
    },
  },
  imagesPortrait: [
    {
      src: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/maria-avatar-image.png",
      alt: "Happy professional collaborating at work",
    },
  ],
  reviews: {
    count: 206,
    rating: 4.9,
    avatars: [
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar1.jpg", alt: "Mia Chen" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar2.jpg", alt: "Marcus Rivera" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar3.jpg", alt: "Priya Sharma" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar4.jpg", alt: "James Okafor" },
      { src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/avatars/avatar5.jpg", alt: "Sofia Chen" },
    ],
  },
};

const Hero80 = (props: Props) => {
  const {
    badge,
    heading,
    subheading,
    description,
    buttons,
    reviews,
    imagesPortrait,
    className,
  } = {
    ...defaultProps,
    ...props,
  };

  const portrait = imagesPortrait?.[0];

  return (
    <section className={cn("relative overflow-hidden py-32", className)}>
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,hsl(var(--accent))_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,hsl(var(--accent))_0%,transparent_100%)]"></div>
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,hsl(var(--accent))_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,hsl(var(--accent))_0%,transparent_80%)]"></div>
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 bg-[radial-gradient(hsl(var(--accent-foreground)/0.1)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_65%_50%,#000_0%,transparent_80%)] [background-size:8px_8px]"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <a
                href={badge.url ?? "https://www.shadcnblocks.com"}
                className="my-6 text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase hover:underline"
              >
                {badge.text}
              </a>
            )}

            <h1 className="text-4xl font-semibold sm:text-5xl">
              {heading}
              {subheading && (
                <>
                  <br />
                  <span className="text-muted-foreground">{subheading}</span>
                </>
              )}
            </h1>

            <p className="my-8 max-w-xl text-muted-foreground lg:text-lg">
              {description}
            </p>

            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {buttons?.primary && (
                <Button size="lg" className="w-full sm:w-auto" render={<a href={buttons.primary.url} />} nativeButton={false}>{buttons.primary.text}</Button>
              )}
              {buttons?.secondary && (
                <Button size="lg" variant="outline" className="w-full sm:w-auto" render={<a href={buttons.secondary.url} />} nativeButton={false}>{buttons.secondary.text}</Button>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <div className="flex -space-x-4">
                {(reviews?.avatars ?? []).map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="size-14 border-2 border-background shadow-sm"
                  >
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                ))}
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-primary" />
                  ))}
                  <span className="font-semibold">
                    {reviews?.rating?.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {reviews?.count}+ happy developers
                </p>
              </div>
            </div>
          </div>

          {portrait && (
            <div className="relative aspect-3/4 w-full max-w-sm overflow-hidden rounded-lg bg-muted shadow-sm lg:justify-self-end">
              <img
                src={portrait.src}
                alt={portrait.alt}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero80 };
