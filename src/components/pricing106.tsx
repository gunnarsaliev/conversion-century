"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PricingSinglePlan {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  period?: { monthly: string; yearly: string };
  features: string[];
  button: { text: string; url: string };
  secondaryButton?: { text: string; url: string };
  featureListLabel?: string;
  image?: string;
  badge?: string;
  priceNote?: string;
}

interface PricingSingleProps {
  heading: string;
  description: string;
  plan: PricingSinglePlan;
  discount?: string;
  className?: string;
}

interface Pricing106Props extends PricingSingleProps {}
type Props = Partial<Pricing106Props>;

const defaultProps: Pricing106Props = {
  heading: "One plan, production-ready blocks",
  description:
    "Predictable pricing for teams building on React, Tailwind CSS, and shadcn/ui. Upgrade cadence without renegotiating seats.",
  discount: "Save ~20%",
  plan: {
    name: "Team",
    image: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/pricing-plans/plan2.svg",
    description:
      "Shared kits, typed props, and export-ready snippets for squads shipping shadcn/ui experiences.",
    monthlyPrice: "$79",
    yearlyPrice: "$759",
    period: { monthly: "/month", yearly: "/year" },
    badge: "Recommended",
    priceNote: "Billed yearly or monthly, cancel anytime",
    featureListLabel: "Everything included",
    features: [
      "Up to 10 seats with shared design tokens",
      "Priority support and onboarding call",
      "SSO-friendly workflow and audit exports",
      "Quarterly design-system office hours",
      "Custom block requests in your backlog tier",
      "Private Slack channel for rollout questions",
    ],
    button: {
      text: "Start subscription",
      url: "#",
    },
    secondaryButton: {
      text: "Book a walkthrough",
      url: "#",
    },
  },
};

const Pricing106 = (props: Props) => {
  const { heading, description, plan, discount, className } = {
    ...defaultProps,
    ...props,
  };
  const [isYearly, setIsYearly] = useState(false);
  const periodMonthly = plan.period?.monthly ?? "/month";
  const periodYearly = plan.period?.yearly ?? "/year";

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-pretty lg:text-5xl">
              {heading}
            </h2>
            <p className="mb-8 text-muted-foreground lg:text-lg">
              {description}
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border bg-background px-4 py-2 text-sm font-medium">
              <span>Monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span>
                Yearly
                {discount ? (
                  <span className="ml-2 text-xs text-primary">{discount}</span>
                ) : null}
              </span>
            </div>
          </div>
          <Card className="border border-border shadow-none">
            <CardHeader className="gap-1">
              <CardTitle className="text-lg font-semibold">
                {plan.name}
              </CardTitle>
              <p className="text-3xl font-semibold tracking-tight lg:text-4xl">
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                <span className="text-base font-normal text-muted-foreground">
                  {isYearly ? periodYearly : periodMonthly}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent>
              <Separator className="mb-6" />
              <ul className="mb-8 flex flex-col gap-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    <span className="min-w-0 text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <Button className="w-full" render={<a href={plan.button.url} target="_blank" rel="noreferrer" />} nativeButton={false}>{plan.button.text}</Button>
                {plan.secondaryButton ? (
                  <Button variant="ghost" className="w-full" render={<a href={plan.secondaryButton.url} target="_blank" rel="noreferrer" />} nativeButton={false}>{plan.secondaryButton.text}</Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { Pricing106 };
