import { Check } from 'lucide-react'
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import { cn } from 'cn'

import { Button } from '@/components/ui/button'

interface PricingSinglePlan {
  name: string
  description: string
  monthlyPrice: string
  yearlyPrice: string
  period?: { monthly: string; yearly: string }
  features: string[]
  button: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  featureListLabel?: string
  image?: string
  badge?: string
  priceNote?: string
}

/** One summary point with a bold lead-in. */
interface PricingHighlight {
  label: string
  text: string
}

/** One of several priced options shown side by side. */
interface PricingOption {
  name: string
  price: string
  features?: string[]
  highlighted?: boolean
}

interface PricingSingleProps {
  heading: string
  description?: string
  plan: PricingSinglePlan
  /** Summary points shown under the heading. */
  highlights?: PricingHighlight[]
  /** When set, shows these option cards instead of the single `plan` card. */
  options?: PricingOption[]
  optionsHeading?: string
  className?: string
}

interface Pricing118Props extends PricingSingleProps {}
type Props = Partial<Pricing118Props>

const defaultProps: Pricing118Props = {
  heading: 'One plan, production-ready blocks',
  description:
    'Predictable pricing for teams building on React, Tailwind CSS, and shadcn/ui. Upgrade cadence without renegotiating seats.',
  plan: {
    name: 'Team',
    image:
      'https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/pricing-plans/plan2.svg',
    description:
      'Shared kits, typed props, and export-ready snippets for squads shipping shadcn/ui experiences.',
    monthlyPrice: '$79',
    yearlyPrice: '$759',
    period: { monthly: '/month', yearly: '/year' },
    badge: 'Recommended',
    priceNote: 'Billed yearly or monthly, cancel anytime',
    featureListLabel: 'Everything included',
    features: [
      'Up to 10 seats with shared design tokens',
      'Priority support and onboarding call',
      'SSO-friendly workflow and audit exports',
      'Quarterly design-system office hours',
      'Custom block requests in your backlog tier',
      'Private Slack channel for rollout questions',
    ],
    button: {
      text: 'Start subscription',
      url: '#',
    },
    secondaryButton: {
      text: 'Book a walkthrough',
      url: '#',
    },
  },
}

const Pricing118 = (props: Props) => {
  const {
    heading,
    description,
    plan,
    highlights,
    options,
    optionsHeading,
    className,
  } = {
    ...defaultProps,
    ...props,
  }
  const periodMonthly = plan.period?.monthly ?? '/month'

  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-pretty lg:text-5xl">
              {heading}
            </h2>
            {description && (
              <p className="text-muted-foreground lg:text-lg">{description}</p>
            )}
          </div>
          {highlights && highlights.length > 0 && (
            <ul className="mb-12 flex flex-col gap-4">
              {highlights.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-primary" />
                  <span className="text-pretty">
                    <strong className="font-semibold">{item.label}:</strong>{' '}
                    <span className="text-muted-foreground">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {options ? (
            <div>
              {optionsHeading && (
                <h3 className="mb-6 text-2xl font-semibold tracking-tight">
                  {optionsHeading}
                </h3>
              )}
              <div className="grid gap-6 md:grid-cols-2">
                {options.map((option) => (
                  <div
                    key={option.name}
                    className={cn(
                      'flex flex-col rounded-2xl border bg-card p-8 text-card-foreground shadow-xl',
                      option.highlighted
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border',
                    )}
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {option.name}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                      {option.price}
                    </p>
                    {option.features && option.features.length > 0 && (
                      <ul className="mt-6 flex flex-col gap-3 border-t pt-6">
                        {option.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="min-w-0 text-pretty">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-xl md:p-12">
              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight md:text-5xl">
                    {plan.monthlyPrice}
                    <span className="text-lg font-normal text-muted-foreground">
                      {periodMonthly}
                    </span>
                  </p>
                  <p className="mt-4 max-w-lg text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <Button
                  size="lg"
                  render={
                    <a
                      href={plan.button.url}
                      target="_blank"
                      rel={EXTERNAL_LINK_REL}
                    />
                  }
                  nativeButton={false}
                >
                  {plan.button.text}
                </Button>
              </div>
              <div className="mt-10 grid gap-3 border-t pt-8 sm:grid-cols-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0 text-pretty">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export { Pricing118 }
