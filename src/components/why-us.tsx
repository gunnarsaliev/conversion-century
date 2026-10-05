const features = [
  {
    title: 'Priorities That Evolve',
    description:
      'We continuously adjust the roadmap around new data, business needs and search developments.',
  },
  {
    title: 'Strategy and Implementation',
    description:
      'We identify what needs to happen, complete the work and follow it through to results.',
  },
  {
    title: 'Senior Specialists Involved',
    description:
      'Your ongoing strategy is managed directly by experienced SEO and content specialists.',
  },
  {
    title: 'Complete Organic Support',
    description:
      'Technical SEO, content, AI visibility, authority and reporting work together under one strategy.',
  },
  {
    title: 'Proactive SEO Management',
    description:
      'We monitor performance, investigate changes and identify opportunities before they become urgent.',
  },
  {
    title: 'Transparent Measurement',
    description:
      'You receive clear reporting that connects completed work with organic and business performance.',
  },
]

type WhyUsProps = {
  items?: { title: string; description?: string | null }[] | null
}

export function WhyUs({ items }: WhyUsProps = {}) {
  const cards = items?.length ? items : features

  return (
    <div className="my-12">
    <h1 className="mb-16 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] md:text-6xl">
      Why Work With
      <br />
      Conversion Century?
    </h1>

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-3 md:gap-y-10 lg:gap-x-20">
          {cards.map((feature) => (
            <article key={feature.title}>
              <h2 className="mb-3 text-lg font-bold leading-snug tracking-[-0.015em] md:text-xl">
                {feature.title}
              </h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-[#59615d] md:text-base">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
  )
}