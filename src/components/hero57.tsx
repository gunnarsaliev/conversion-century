import { CheckCircle2, Globe, Lock, Star, Zap } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
interface Hero57Props {
  className?: string;
}

const Hero57 = ({ className }: Hero57Props) => {
  return (
    <section className={cn("relative overflow-hidden py-32", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 mx-auto h-[600px] max-h-[600px] w-full opacity-10"
        style={{
          backgroundImage: `url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/grid3.svg')`,
          backgroundRepeat: "repeat",
          maskImage:
            "radial-gradient(ellipse 80% 100% at 50% 30%, #000 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 100% at 50% 30%, #000 40%, transparent 75%)",
        }}
      />
      <div className="relative z-10 container">
        <h1 className="relative mx-auto mb-8 max-w-3xl flex-wrap text-center text-4xl font-semibold md:mb-10 md:text-6xl md:leading-snug">
          <span>
            Create Winning
            <span className="ml-1 opacity-50">Proposals</span> 10X Faster with
            <Globe className="mx-2 mb-1 inline-block h-auto w-8 md:mx-4 md:mb-3 md:w-14" />
            AI
          </span>
          <div className="absolute -top-10 -left-20 hidden w-fit -rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            <Zap className="h-auto w-3" />
            Fast
          </div>
          <div className="absolute top-14 -left-24 hidden w-fit -rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            <Lock className="h-auto w-3" />
            Secure
          </div>
          <div className="absolute -top-10 -right-24 hidden w-fit rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            Professional
            <Star className="h-auto w-3" />
          </div>
          <div className="absolute top-14 -right-28 hidden w-fit rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            Optimized
            <CheckCircle2 className="h-auto w-3" />
          </div>
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-center font-medium text-muted-foreground md:text-xl">
          Penna let you build high-converting, website-style proposals with AI,
          helping you win better customers without wasting time
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
          <Button size="lg">Start free 14-day trial</Button>
          <div className="text-sm text-muted-foreground md:text-balance">
            Powered by GPT-4
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero57 };
