"use client";
import { Check } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
interface Hero104Props {
  className?: string;
}

const Hero104 = ({ className }: Hero104Props) => {
  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="container max-w-[75rem]">
        <div className="flex gap-8">
          <div className="mx-auto max-w-[50rem] lg:max-w-full lg:shrink-0 lg:basis-2/5">
            <h1 className="font-poppins mb-[0.625rem] text-center text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl md:text-6xl md:leading-[1.1] lg:text-left">
              Organic Growth Built on Expertise, Trust and Genuine Commitment
            </h1>
            <p className="mb-10 text-center text-2xl leading-9 font-medium lg:text-left">
              We streamlines your ad management tasks, letting you focus on
              achieving results more quickly.
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row lg:justify-normal">
              <Button variant="default" className="h-fit w-full rounded-lg border-2 border-primary px-8 py-4 text-lg font-semibold sm:w-fit" render={<a href="#" />} nativeButton={false}>Discuss Your Growth Goals</Button>
              <Button variant="ghost" className="h-fit w-full rounded-lg border-2 px-8 py-4 text-lg font-semibold hover:border-primary hover:bg-transparent sm:w-fit" render={<a href="#" />} nativeButton={false}>Explore Our Results</Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-7 lg:justify-normal">
              {[
                "30-day free trial",
                "No credit card required",
                "Cancel anytime",
              ].map((text, i) => (
                <div key={`${i}`} className="flex items-center gap-2">
                  <Check className="h-3 w-3 stroke-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden grow items-center justify-center lg:flex">
            <div className="flex aspect-square w-full max-w-[26rem] items-center justify-center rounded-full bg-green-50">
              <img
                src="https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/mascot-rocket.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero104 };
