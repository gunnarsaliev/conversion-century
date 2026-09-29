import Link from 'next/link'

type RightChoiceProps = {
  rightChoice?: {
    heading?: string | null
    listIntro?: string | null
    list?: string[]
  } | null
  notRight?: {
    heading?: string | null
    paragraphs?: string[]
    cta?: { label?: string | null; href?: string | null } | null
  } | null
}

export function RightChoice({ rightChoice, notRight }: RightChoiceProps) {
  return (
    <section className="bg-[#edf3ef] shadow-[0_0_0_100vmax_#edf3ef] [clip-path:inset(0_-100vmax)] px-5 py-10 sm:px-8 sm:py-16 lg:px-[3.4rem] lg:py-[6.25rem]">
      <div className="mx-auto grid max-w-[119rem] items-start gap-8 lg:grid-cols-2">
        {rightChoice?.heading && (
          <div className="rounded-[2.25rem] bg-white px-8 py-12 text-[#17201d] shadow-sm sm:px-12 sm:py-16 lg:px-[3.75rem] lg:py-[4.25rem]">
            <h2 className="max-w-[32rem] text-[2.55rem] font-black leading-[0.98] tracking-[-0.045em] sm:text-[3rem]">
              {rightChoice.heading}
            </h2>
            {rightChoice.listIntro && (
              <p className="mt-12 text-[1.35rem] leading-relaxed text-[#56605d]">
                {rightChoice.listIntro}
              </p>
            )}
            {rightChoice.list && rightChoice.list.length > 0 && (
              <ul className="mt-8 space-y-5">
                {rightChoice.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[1.15rem] leading-relaxed sm:text-[1.25rem]">
                    <span aria-hidden="true" className="mt-[0.55rem] h-3.5 w-3.5 shrink-0 rounded-full bg-[#188765]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {notRight?.heading && (
          <div className="rounded-[2.25rem] bg-[#0f4435] px-8 py-12 text-[#f8f7f1] sm:px-12 sm:py-16 lg:px-[3.75rem] lg:py-[4.25rem]">
            <h2 className="max-w-[38rem] text-[2.55rem] font-black leading-[0.98] tracking-[-0.045em] sm:text-[3rem]">
              {notRight.heading}
            </h2>
            {notRight.paragraphs && notRight.paragraphs.length > 0 && (
              <div className="mt-12 max-w-[47rem] space-y-7 text-[1.2rem] leading-[1.8] text-[#d6dfd9] sm:text-[1.3rem]">
                {notRight.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {notRight.cta?.label && notRight.cta.href && (
              <Link
                href={notRight.cta.href}
                className="mt-10 inline-flex rounded-full bg-[#ffbd1b] px-11 py-5 text-[1.15rem] font-bold text-[#17201d] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffbd1b]"
              >
                {notRight.cta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export type { RightChoiceProps }

export default RightChoice
