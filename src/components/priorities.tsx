import { cn } from 'cn'

type PrioritiesProps = {
  section?: {
    heading?: string | null
    paragraphs?: string | null
    listIntro?: string | null
    list?: { text: string; id?: string | null }[] | null
  } | null
}

// Paragraphs are stored as one textarea separated by blank lines.
function splitParagraphs(text?: string | null) {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export default function Priorities({ section, className }: PrioritiesProps & { className?: string }) {
  if (!section?.heading) return null

  const [lead, ...paragraphs] = splitParagraphs(section.paragraphs)
  const list = section.list ?? []

  return (
    <section
      className={cn(
        // The before: layer copies the section's background out to the viewport edges.
        'relative isolate bg-[#edf3ef] px-6 py-16 text-[#18231f] before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-inherit sm:px-10 sm:py-20 lg:px-[4.65%] lg:py-[7.1%]',
        className,
      )}
    >
      <div className="mx-auto grid max-w-[1310px] items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-[5.2%]">
        <div className="max-w-[610px]">
          <h2 className="max-w-[600px] text-[42px] font-black leading-[1.12] tracking-[-0.035em] text-balance sm:text-[50px] lg:text-[48px]">
            {section.heading}
          </h2>

          {lead && (
            <p className="mt-6 text-[17px] font-semibold leading-7 sm:text-[18px]">{lead}</p>
          )}

          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mt-6 max-w-[600px] text-[16px] leading-[1.8] text-[#56615d] sm:text-[17px]"
            >
              {p}
            </p>
          ))}
        </div>

        {list.length > 0 && (
          <div className="lg:pt-1">
            {section.listIntro && (
              <h3 className="text-[16px] font-bold uppercase tracking-[0.1em] text-[#087d61]">
                {section.listIntro}
              </h3>
            )}
            <ul className="mt-3 flex max-w-[570px] flex-wrap gap-2">
              {list.map((item, i) => (
                <li
                  key={item.id ?? i}
                  className="rounded-full bg-[#fffdfa] px-5 py-2.5 text-[14px] leading-5 text-[#26302d] shadow-[0_1px_0_rgba(24,35,31,0.01)] sm:text-[15px]"
                >
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
