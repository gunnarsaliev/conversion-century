import { useTranslations } from "next-intl";
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

const STAT_KEYS = ["raised", "companies", "transactions", "connections"] as const;

const Hero262 = (props: Hero262Props) => {
  const t = useTranslations("Hero262");
  const {
    heading = t("heading"),
    subheading = t("subheading"),
    description = t("description"),
    stats = STAT_KEYS.map((key) => ({
      value: t(`stats.${key}.value`),
      label: t(`stats.${key}.label`),
    })),
    ctaText = t("cta"),
    ctaUrl = "/about",
    className,
  } = props;

  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h2 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {heading}
          </h2>

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
              className="bg-warning p-6 rounded-full hover:bg-warning/85 mt-8 lg:mt-12"
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
