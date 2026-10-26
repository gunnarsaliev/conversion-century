import { Check } from "lucide-react";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

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
  className?: string;
}

interface Pricing117Props extends PricingSingleProps {}
type Props = Partial<Pricing117Props>;

const defaultProps: Pricing117Props = {
  heading: "One plan, production-ready blocks",
  description:
    "Predictable pricing for teams building on React, Tailwind CSS, and shadcn/ui. Upgrade cadence without renegotiating seats.",
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

const Pricing117 = (props: Props) => {
  const { heading, description, plan, className } = {
    ...defaultProps,
    ...props,
  };
  const periodMonthly = plan.period?.monthly ?? "/month";

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mx-auto mb-4 max-w-3xl text-4xl font-semibold tracking-tight text-pretty lg:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground lg:text-lg">
            {description}
          </p>
          <div className="mx-auto w-fit max-w-full">
            <div className="relative px-12 py-10">
              <span className="pointer-events-none absolute inset-0 border border-foreground/20" />
              <span className="pointer-events-none absolute top-0 left-0 size-6 border-t-2 border-l-2 border-foreground" />
              <span className="pointer-events-none absolute top-0 right-0 size-6 border-t-2 border-r-2 border-foreground" />
              <span className="pointer-events-none absolute bottom-0 left-0 size-6 border-b-2 border-l-2 border-foreground" />
              <span className="pointer-events-none absolute right-0 bottom-0 size-6 border-r-2 border-b-2 border-foreground" />
              <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                {plan.name}
              </p>
              <p className="mt-2 text-6xl font-semibold tracking-tighter sm:text-7xl">
                {plan.monthlyPrice}
              </p>
              <p className="text-sm text-muted-foreground">{periodMonthly}</p>
              <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
                {plan.description}
              </p>
              <Button className="mt-8" size="lg" render={<a href={plan.button.url} target="_blank" rel={EXTERNAL_LINK_REL} />} nativeButton={false}>{plan.button.text}</Button>
            </div>
            <div className="mt-14 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2 sm:text-sm">
              {plan.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                  <p className="min-w-0 text-pretty">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing117 };
