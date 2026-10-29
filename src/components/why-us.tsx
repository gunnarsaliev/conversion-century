import { useTranslations } from 'next-intl'

// Default cards; copy lives in the `WhyUs` messages (`items.<key>`).
const FEATURE_KEYS = [
  'evolvingPriorities',
  'strategyImplementation',
  'seniorSpecialists',
  'completeSupport',
  'proactive',
  'transparent',
] as const

type WhyUsProps = {
  items?: { title: string; description?: string | null }[] | null
}

export function WhyUs({ items }: WhyUsProps = {}) {
  const t = useTranslations('WhyUs')
  const cards = items?.length
    ? items
    : FEATURE_KEYS.map((key) => ({
        title: t(`items.${key}.title`),
        description: t(`items.${key}.description`),
      }))

  return (
    <div className="my-12">
    <h2 className="mb-16 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] md:text-6xl">
      {t.rich('heading', { br: () => <br /> })}
    </h2>

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3 md:gap-y-10 lg:gap-x-20">
          {cards.map((feature) => (
            <article key={feature.title}>
              <h3 className="mb-3 text-lg font-bold leading-snug tracking-[-0.015em] md:text-xl">
                {feature.title}
              </h3>
              <p className="max-w-sm text-[15px] leading-relaxed text-[#59615d] md:text-base">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
  )
}