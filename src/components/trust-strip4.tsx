import {
  Award,
  BadgeCheck,
  Rocket,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
interface TrustStrip4Props {
  rating?: number;
  reviewCount?: number;
  className?: string;
}

const TrustStrip4 = ({
  rating = 4.9,
  reviewCount = 100,
  className,
}: TrustStrip4Props) => {
  const t = useTranslations("TrustStrip4");
  const locale = useLocale();
  const features = [
    { icon: <Rocket className="size-3" />, text: t("traffic") },
    { icon: <Search className="size-3" />, text: t("rankings") },
    { icon: <Award className="size-3" />, text: t("authority") },
    { icon: <ShoppingCart className="size-3" />, text: t("sales") },
  ];

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < Math.round(rating)
                        ? "fill-warning text-warning"
                        : "fill-muted text-muted",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{rating}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">
              {t("reviews", { count: reviewCount.toLocaleString(locale) })}
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Verified Badge */}
          <Badge variant="secondary" className="gap-1.5">
            <BadgeCheck className="size-3.5 text-emerald-600" />
            Trusted Agency
          </Badge>
        </div>
      </div>
    </section>
  );
};

export { TrustStrip4 };
