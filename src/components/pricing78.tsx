"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/** One summary point with a bold lead-in, e.g. "Обхват на миграцията: …". */
export interface Pricing78Highlight {
  label: string;
  text: string;
}

export interface Pricing78Plan {
  name: string;
  /** e.g. "2 500 евро". */
  price: string;
  /** Shown next to the price, e.g. "/month". */
  period?: string;
  /** With `yearlyPrice` on every plan, a Monthly/Yearly toggle is shown. */
  yearlyPrice?: string;
  description?: string;
  features?: string[];
  button?: { text: string; url: string };
  highlighted?: boolean;
}

interface Pricing78Props {
  heading: string;
  description?: string;
  /** Summary points shown under the heading. */
  highlights?: Pricing78Highlight[];
  plans: Pricing78Plan[];
  className?: string;
}

type Props = Partial<Pricing78Props>;

const defaultProps: Pricing78Props = {
  heading: "Pricing that scales with your team",
  plans: [
    {
      name: "Starter",
      description: "For individual developers and side projects shipping real interfaces.",
      price: "$29",
      yearlyPrice: "$279",
      features: [
        "Single developer seat",
        "Full block library with TypeScript types",
        "Community Discord access",
        "Email support within 2 business days",
      ],
      button: { text: "Start building", url: "#" },
    },
    {
      name: "Team",
      description: "For product squads that need shared kits, reviews, and faster handoff.",
      price: "$79",
      yearlyPrice: "$759",
      features: [
        "Up to 10 seats with shared design tokens",
        "Priority support and onboarding call",
        "SSO and audit-friendly export (SOC2-friendly workflow)",
        "Quarterly design-system office hours",
      ],
      button: { text: "Get started", url: "#" },
      highlighted: true,
    },
  ],
};

const Pricing78 = (props: Props) => {
  const { heading, description, highlights, plans, className } = {
    ...defaultProps,
    ...props,
  };

  const hasBillingToggle = plans.every((plan) => plan.yearlyPrice);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const isYearly = hasBillingToggle && billingCycle === "yearly";

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-3xl font-semibold tracking-tight text-pretty lg:text-5xl">
            {heading}
          </h2>
          {hasBillingToggle && (
            <ToggleGroup
              // Base UI toggle groups hold an array of pressed values.
              value={[billingCycle]}
              onValueChange={(value) => {
                if (value[0] && value[0] !== billingCycle) {
                  setBillingCycle(value[0]);
                }
              }}
              className="w-fit shrink-0 rounded-lg border p-1"
            >
              <ToggleGroupItem value="monthly" className="rounded-md px-6 data-[state=on]:bg-muted">
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem value="yearly" className="rounded-md px-6 data-[state=on]:bg-muted">
                Yearly
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
        {description && <p className="mt-4 text-muted-foreground">{description}</p>}

        {highlights && highlights.length > 0 && (
          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>
                  <span className="font-semibold">{item.label}:</span>{" "}
                  <span className="text-muted-foreground">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {plans.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.name}>
                <div className={cn("rounded-lg border p-6", plan.highlighted && "bg-muted")}>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-semibold tracking-tight">
                      {isYearly ? plan.yearlyPrice : plan.price}
                    </span>
                    {(hasBillingToggle || plan.period) && (
                      <span className="ml-1 text-sm text-muted-foreground">
                        {hasBillingToggle ? (isYearly ? "/year" : "/month") : plan.period}
                      </span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  )}
                  {plan.button && (
                    <Button
                      className="mt-6 w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      render={<a href={plan.button.url} />}
                      nativeButton={false}
                    >
                      {plan.button.text}
                    </Button>
                  )}
                </div>
                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-6 px-2">
                    {plan.features.map((feature, idx) => (
                      <li key={feature}>
                        {idx > 0 && (
                          <Separator className="my-3 border-0 border-t border-dashed border-border bg-transparent" />
                        )}
                        <div className="flex items-center gap-2">
                          <Check className="size-4 shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { Pricing78 };
