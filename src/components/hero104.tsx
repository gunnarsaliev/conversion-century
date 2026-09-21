"use client";
import { Check } from "lucide-react";
import { cn } from "cn";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
interface Hero104Props {
  className?: string;
}

const MAX_AVATARS = 5;

const proofAvatars = [
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    alt: "Customer avatar",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    alt: "Customer avatar",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    alt: "Customer avatar",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    alt: "Customer avatar",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    alt: "Customer avatar",
  },
];

const Hero104 = ({ className }: Hero104Props) => {
  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="mx-auto max-w-[50rem] lg:max-w-full lg:shrink-0 lg:basis-2/3">
            <h1 className="font-poppins mb-[0.625rem] text-center text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl md:text-6xl md:leading-[1.1] lg:text-left">
              Organic Growth Built on Expertise, Trust and Genuine Commitment
            </h1>
            <p className="mb-4 text-center text-lg leading-9 lg:text-left">
              Conversion Century helps ambitious businesses grow across Google, AI-powered search and international markets through sustainable SEO strategies tailored to their goals.
            </p>
            <p className="mb-10 text-center text-lg font-thin leading-9 lg:text-left">
              We combine strategic thinking, technical expertise, quality content and digital authority with something just as important: genuine commitment to every client’s success.
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-normal">
              <Button variant="default" className="h-fit w-full rounded-lg border-2 border-primary px-8 py-4 text-lg bg-green-800 text-white font-semibold sm:w-fit hover:bg-green-700" render={<Link  href="/website/book-a-consultation" />} nativeButton={false}>Discuss Your Growth Goals</Button>
              <Button variant="ghost" className="h-fit w-full rounded-lg border-2 px-8 py-4 text-lg font-semibold hover:border-green-800 hover:bg-transparent sm:w-fit" render={<a href="#" />} nativeButton={false}>Explore Our Results</Button>
            </div>  
            <div className="flex items-center justify-center gap-3 pt-6 lg:justify-normal">
              <div className="flex -space-x-2">
                {proofAvatars.slice(0, MAX_AVATARS).map((avatar) => (
                  <Avatar
                    key={avatar.src}
                    className="size-8 border-2 border-background"
                  >
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by 100+ businesses worldwide
              </p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-7 lg:justify-normal">
              {[
                "Established in 2016",
                "Client relationships lasting 7+ years",
                "International experience",
              ].map((text, i) => ( 
                <div key={`${i}`} className="flex items-center gap-2">
                  <Check className="h-3 w-3 stroke-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden shrink-0 items-center justify-end lg:flex lg:basis-1/3">
            <div className="flex aspect-square w-full max-w-[26rem] items-center justify-center rounded-full bg-green-50">
              <Image
                src="https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/mascot-rocket.png"
                alt=""
                className="h-full w-full object-contain"
                width={208}
                height={208}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero104 };
