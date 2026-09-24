import {
  Award,
  BadgeCheck,
  Rocket,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
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
  const features = [
    { icon: <Rocket className="size-3" />, text: "More traffic" },
    { icon: <Search className="size-3" />, text: "Higher rankings" },
    { icon: <Award className="size-3" />, text: "Stronger authority" },
    { icon: <ShoppingCart className="size-3" />, text: "More sales" },
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
                      i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{rating}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">
              {reviewCount.toLocaleString()}+ verified reviews
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
