import type { LucideIcon } from "lucide-react";
import { Package, Phone, Smartphone, Truck } from "lucide-react";
import { cn } from "cn";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
type Incentive = {
  title: string;
  icon: LucideIcon;
  text: string;
};

type Incentives6Props = {
  incentives: Incentive[];
  className?: string;
};

const INCENTIVES_SECTION: Incentive[] = [
  {
    title: "Customer Care",
    text: "Browse common questions and discover the best ways to contact us.",
    icon: Phone,
  },
  {
    title: "Our Apps",
    text: "Transform your space and shop smarter with our easy-to-use apps.",
    icon: Smartphone,
  },
  {
    title: "Help & Guides",
    text: "Access helpful resources—from assembly instructions to smart-home assistance.",
    icon: Package,
  },
  {
    title: "Order Tracking",
    text: "Stay updated—track, modify, or cancel your order anytime.",
    icon: Truck,
  },
];

const Incentives6 = ({
  incentives = INCENTIVES_SECTION,
  className,
}: Incentives6Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="max-sm:border-y">
        <div className="container">
          <Carousel
            opts={{
              breakpoints: {
                "(min-width: 640px)": {
                  active: false,
                },
              },
            }}
          >
            <CarouselContent className="ml-0 py-px sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:[&>div]:overflow-auto">
              {incentives.map(({ title, text, icon: Icon }, index) => (
                <CarouselItem
                  className="pl-0 not-last:-mr-px sm:-mb-px sm:max-lg:odd:-mr-px"
                  key={index}
                >
                  <Item
                    className="h-full rounded-none py-16 max-sm:border-transparent"
                    variant="outline"
                  >
                    <ItemContent className="items-center">
                      <ItemMedia className="mx-auto mb-3">
                        <Icon className="stroke-1.5 size-7 stroke-muted-foreground" />
                      </ItemMedia>
                      <ItemTitle className="text-center font-serif text-xl text-foreground">
                        {title}
                      </ItemTitle>
                      <ItemDescription className="line-clamp-none max-w-80 text-center">
                        {text}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center sm:hidden">
              <CarouselPrevious
                variant="ghost"
                className="static size-12 translate-0"
              />
              <CarouselNext
                variant="ghost"
                className="static size-12 translate-0"
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export { Incentives6 };
