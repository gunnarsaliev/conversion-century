import { Check } from "lucide-react";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

interface Pricing105Props extends PricingSingleProps {}
type Props = Partial<Pricing105Props>;

const defaultProps: Pricing105Props = {
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

const Pricing105 = (props: Props) => {
  const { heading, description, plan, className } = {
    ...defaultProps,
    ...props,
  };
  const periodMonthly = plan.period?.monthly ?? "/month";

  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-pretty lg:text-5xl">
              {heading}
            </h2>
            <p className="text-muted-foreground lg:text-lg">{description}</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-md">
                <p className="text-sm font-medium text-muted-foreground">
                  {plan.name}
                </p>
                <p className="mt-1 text-4xl font-semibold tracking-tight lg:text-5xl">
                  {plan.monthlyPrice}
                  <span className="text-lg font-normal text-muted-foreground">
                    {periodMonthly}
                  </span>
                </p>
                <p className="mt-4 text-muted-foreground">{plan.description}</p>
              </div>
              <div className="flex-1 lg:max-w-md">
                <Separator className="mb-6 lg:hidden" />
                {plan.featureListLabel ? (
                  <p className="mb-3 text-sm font-semibold">
                    {plan.featureListLabel}
                  </p>
                ) : null}
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0" />
                      <span className="min-w-0 text-pretty">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full sm:w-auto" render={<a href={plan.button.url} target="_blank" rel={EXTERNAL_LINK_REL} />} nativeButton={false}>{plan.button.text}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing105 };
