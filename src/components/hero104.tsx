"use client";
import { Check } from "lucide-react";
import { cn } from "cn";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
}: Hero104Props) => {
  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="mx-auto max-w-[50rem] lg:max-w-full lg:shrink-0 lg:basis-2/3">
            <h1 className="font-poppins mb-[0.625rem] text-center text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl md:text-6xl md:leading-[1.1] lg:text-left">
              {heading}
            </h1>
            {description && (
              <p className="mb-4 text-center text-lg leading-9 lg:text-left">
                {description}
              </p>
            )}
            {secondaryDescription && (
              <p className="mb-10 text-center text-lg font-thin leading-9 lg:text-left">
                {secondaryDescription}
              </p>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-normal">
                {primaryCta && (
                  <Button variant="default" className="h-fit w-full rounded-lg border-2 border-primary px-8 py-4 text-lg bg-green-800 text-white font-semibold sm:w-fit hover:bg-green-700" render={<Link href={primaryCta.href} />} nativeButton={false}>{primaryCta.label}</Button>
                )}
                {secondaryCta && (
                  <Button variant="ghost" className="h-fit w-full rounded-lg border-2 px-8 py-4 text-lg font-semibold hover:border-green-800 hover:bg-transparent sm:w-fit" render={<a href={secondaryCta.href} />} nativeButton={false}>{secondaryCta.label}</Button>
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
                      <AvatarImage src={avatar.src} alt={avatar.alt} />
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
              <div className="mt-6 flex flex-wrap justify-center gap-7 lg:justify-normal">
                {highlights.map((text, i) => (
                  <div key={`${i}`} className="flex items-center gap-2">
                    <Check className="h-3 w-3 stroke-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {image && (
            <div className="hidden shrink-0 items-center justify-end lg:flex lg:basis-1/3">
              <div className="flex aspect-square w-full max-w-[26rem] items-center justify-center rounded-full bg-green-50">
                <Image
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-contain"
                  width={208}
                  height={208}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero104, type Hero104Props };
