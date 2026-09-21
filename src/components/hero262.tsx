import { cn } from "cn";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface DashedLineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const DashedLine = ({
  orientation = "horizontal",
  className,
}: DashedLineProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "relative text-muted-foreground",
        isHorizontal ? "h-px w-full" : "h-full w-px",
        className,
      )}
    >
      <div
        className={cn(
          isHorizontal
            ? [
                "h-px w-full",
                "bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]",
                "[mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]",
              ]
            : [
                "h-full w-px",
                "bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]",
                "[mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]",
              ],
        )}
      />
    </div>
  );
};

interface Stat {
  value: string;
  label: string;
}

interface Hero262Props {
  heading?: string;
  subheading?: string;
  description?: string;
  stats?: Stat[];
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

const Hero262 = ({
  heading = "More than an SEO provider",
  subheading = "Your business is never just another number.",
  description = "When you trust us with your website, you also trust us with the goals, ideas and ambitions behind it. We take that responsibility seriously. We learn how your business works, understand where you want to go and become an active part of the team working to get you there.\n\nWe celebrate your growth because we know what it took to achieve it. We investigate when something is not working, adapt when priorities change and continue looking for new opportunities even when they fall outside the original plan.\n\nOur role is not simply to complete a monthly list of SEO tasks. It is to understand what your business needs next and help make it happen.",
  stats = [
    {
      value: "$150M",
      label: "Raised",
    },
    {
      value: "20K",
      label: "Companies",
    },
    {
      value: "1.3B",
      label: "Monthly transactions",
    },
    {
      value: "1.5K",
      label: "Connections per minute",
    },
  ],
  ctaText = "Discover How We Work",
  ctaUrl = "/website/about",
  className,
}: Hero262Props) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {heading}
          </h1>

          <p className="mt-5 text-2xl text-muted-foreground md:text-3xl lg:text-4xl">
            {subheading}
          </p>

          <div className="mt-8 hidden max-w-lg space-y-6 text-lg text-balance text-muted-foreground md:block lg:mt-12">
            {description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {ctaText && ctaUrl && (
            <Button
              variant="outline"
              className="bg-yellow-400 p-6 rounded-full hover:bg-yellow-300 mt-8 lg:mt-12"
              size="lg"
              render={<Link href={ctaUrl} />}
              nativeButton={false}
            >
              {ctaText}
            </Button>
          )}
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-3 pt-10 lg:pt-0 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="text-4xl tracking-wide md:text-5xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Hero262 };
