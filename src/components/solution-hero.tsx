import { Link } from '@/i18n/navigation'

type Cta = { label: string; href: string }

type SolutionHeroProps = {
  name: string
  eyebrow?: string | null
  heading?: string | null
  // The first paragraph is shown as the lead, the rest as supporting text.
  paragraphs?: string[]
  highlights?: string[]
  primaryCta?: Cta
  secondaryCta?: Cta
}

export default function SolutionHero({
  name,
  eyebrow,
  heading,
  paragraphs = [],
  highlights = [],
  primaryCta = { label: 'Discuss Your Growth Goals', href: '/website/book-a-consultation' },
  secondaryCta = { label: 'Explore Our Results', href: '/website/case-studies' },
}: SolutionHeroProps) {
  const [lead, ...rest] = paragraphs

  return (
    // The before: layer copies the background out to the viewport edges, past the layout's max-width container.
    <main className="relative isolate bg-[#0f4637] text-[#fbfaf5] before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-inherit">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col px-6 pb-5 sm:px-10 lg:px-0">
        <nav aria-label="Breadcrumb" className="pt-5 text-sm text-white/60">
          <ol className="flex items-center gap-3">
            <li><Link className="transition-colors hover:text-white" href="/website">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link className="transition-colors hover:text-white" href="/website/solutions">Solutions</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-white">{name}</li>
          </ol>
        </nav>

        <section className="flex flex-col items-center pb-16 text-center">
          {eyebrow && (
            <div className="mt-12 rounded-full bg-[#ffb91f] px-5 py-2 text-[12px] font-bold tracking-[0.08em] text-[#102f25] uppercase sm:mt-12">
              {eyebrow}
            </div>
          )}
          <h1 className="mt-8 max-w-[720px] text-[54px] font-bold leading-[0.93] tracking-[-0.045em] text-balance sm:text-[72px] lg:text-[80px]">
            {heading || name}
          </h1>
          {lead && (
            <p className="mt-12 max-w-[700px] text-[19px] font-medium leading-relaxed text-white sm:text-[20px]">
              {lead}
            </p>
          )}
          {rest.map((paragraph, i) => (
            <p key={i} className="mt-7 max-w-[720px] text-[16px] leading-[1.75] text-white/75">
              {paragraph}
            </p>
          ))}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href={primaryCta.href} className="rounded-full bg-[#ffb91f] px-8 py-4 text-sm font-bold text-[#102f25] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb91f]">
              {primaryCta.label}
            </Link>
            <Link href={secondaryCta.href} className="rounded-full border border-white/40 px-8 py-4 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              {secondaryCta.label}
            </Link>
          </div>
        </section>

        {highlights.length > 0 && (
          <section aria-label="Our approach" className="grid border-t border-white/20 pt-6 text-center text-[15px] leading-[1.25] text-white/85 sm:grid-cols-3 sm:gap-8">
            {highlights.map((highlight) => <p key={highlight}>{highlight}</p>)}
          </section>
        )}
      </div>
    </main>
  )
}
