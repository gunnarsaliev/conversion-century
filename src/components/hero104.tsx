"use client";
import { Check } from "lucide-react";
import { cn } from "cn";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface Hero104Cta {
  label: string;
  href: string;
}

interface Hero104Image {
  src: string;
  alt: string;
}

interface Hero104Props {
  heading: string;
  description?: string;
  secondaryDescription?: string;
  primaryCta?: Hero104Cta;
  secondaryCta?: Hero104Cta;
  avatars?: Hero104Image[];
  socialProof?: string;
  highlights?: string[];
  image?: Hero104Image;
  className?: string;
  containerClassName?: string;
}

const MAX_AVATARS = 5;

const Hero104 = ({
  heading,
  description,
  secondaryDescription,
  primaryCta,
  secondaryCta,
  avatars = [],
  socialProof,
  highlights = [],
  image,
  className,
  containerClassName,
}: Hero104Props) => {
  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div
        className={cn(
          "mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8",
          containerClassName,
        )}
      >
        <div className="flex gap-8">
          <div className="mx-auto max-w-[50rem] lg:max-w-full lg:shrink-0 lg:basis-2/3">
            <h1 className="mb-[0.625rem] text-center text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl md:text-6xl md:leading-[1.1] lg:text-left">
              {heading}
            </h1>
            {description && (
              <p className="mb-4 text-center text-lg leading-9 lg:text-left">
                {description}
              </p>
            )}
            {/* {secondaryDescription && (
              <p className="mb-10 text-center text-lg font-thin leading-9 lg:text-left">
                {secondaryDescription}
              </p>
            )} */}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-normal">
                {primaryCta && (
                  <Button variant="default" className="h-fit w-full rounded-lg border-2 border-primary px-8 py-4 text-lg bg-primary text-primary-foreground font-semibold sm:w-fit hover:bg-primary/85" render={<Link href={primaryCta.href} />} nativeButton={false}>{primaryCta.label}</Button>
                )}
                {secondaryCta && (
                  <Button variant="ghost" className="h-fit w-full rounded-lg border-2 px-8 py-4 text-lg font-semibold hover:border-primary hover:bg-transparent sm:w-fit" render={<Link href={secondaryCta.href} />} nativeButton={false}>{secondaryCta.label}</Button>
                )}
              </div>
            )}
            {(avatars.length > 0 || socialProof) && (
              <div className="flex items-center justify-center gap-3 pt-6 lg:justify-normal">
                <div className="flex -space-x-2">
                  {avatars.slice(0, MAX_AVATARS).map((avatar) => (
                    <Avatar
                      key={avatar.src}
                      className="size-8 border-2 border-background"
                    >
                      {/* next/image instead of AvatarImage: the source
                          logos are full-size PNGs, shown here at 32px. */}
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        width={32}
                        height={32}
                        className="aspect-square size-full rounded-full object-cover"
                      />
                    </Avatar>
                  ))}
                </div>
                {socialProof && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {socialProof}
                  </p>
                )}
              </div>
            )}
            {highlights.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-normal">
                {highlights.map((text, i) => (
                  <div
                    key={`${i}`}
                    className="flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5"
                  >
                    <Check className="size-4 shrink-0 stroke-3 text-primary" />
                    <p className="text-sm font-medium text-foreground">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {image && (
            <div className="hidden shrink-0 items-center justify-end lg:flex lg:basis-2/5">
              <Image
                src={image.src}
                alt={image.alt}
                className="aspect-square w-full max-w-[34rem] object-contain"
                width={600}
                height={600}
                // The page's LCP image. Hidden below lg, so mobile only
                // fetches the smallest variant.
                preload
                sizes="(min-width: 1024px) 544px, 1px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero104, type Hero104Props };
