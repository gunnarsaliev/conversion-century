import { Clock, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type OfferPricingItem = { icon?: LucideIcon; label: string }

type OfferPricingProps = {
  /** Formatted amount, e.g. "2 500". */
  price: string
  /** Shown after the amount, e.g. "евро". */
  unit?: string
  /** Pill at the top right, e.g. "25 часа". */
  badge?: string
  badgeIcon?: LucideIcon
  title: string
  subtitle?: string
  /** Row of icon + label items, e.g. hours per service. */
  items?: OfferPricingItem[]
  className?: string
}

// A single price card: the amount and a pill, a title, and a row of items.
export function OfferPricing({
  price,
  unit,
  badge,
  badgeIcon: BadgeIcon = Clock,
  title,
  subtitle,
  items = [],
  className,
}: OfferPricingProps) {
  return (
    <article className={cn('border-b py-8', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-normal leading-none tracking-tight sm:text-[42px]">
            {price}
          </span>
          {unit && (
            <span className="text-xl font-light leading-none text-muted-foreground sm:text-2xl">
              {unit}
            </span>
          )}
        </div>

        {badge && (
          <div className="flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-base leading-none shadow-xs sm:text-lg">
            <BadgeIcon aria-hidden="true" className="size-5 text-primary" />
            <span>{badge}</span>
          </div>
        )}
      </div>

      <div className="mt-8 border-t pt-7">
        <h3 className="text-2xl font-normal leading-tight tracking-tight sm:text-[32px]">{title}</h3>
        {subtitle && (
          <p className="mt-4 text-lg font-light leading-snug text-muted-foreground sm:text-xl">
            {subtitle}
          </p>
        )}
      </div>

      {items.length > 0 && (
        <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-4 text-lg font-light text-muted-foreground">
          {items.map(({ icon: Icon = Clock, label }) => (
            <li className="flex items-center gap-2" key={label}>
              <Icon aria-hidden="true" className="size-5 stroke-[1.8] text-foreground" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
