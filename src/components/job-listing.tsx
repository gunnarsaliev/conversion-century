import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import JobApplicationForm from '@/components/job-application-form'

const typeLabels: Record<JobListingProps['type'], string> = {
  'part-time': 'Part-time',
  'full-time': 'Full-time',
}

// Styles the lists (and any paragraphs/bold text) produced by the Lexical
// editor to match the design's bullet lists.
const richTextClassName =
  '[&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-10 [&_ol]:m-0 [&_ol]:list-decimal [&_ol]:pl-10 [&_li]:pl-0 [&_li]:text-xl [&_li]:leading-[1.42] [&_li]:tracking-[-.2px] max-sm:[&_li]:text-lg [&_p]:text-xl [&_p]:leading-[1.42] max-sm:[&_p]:text-lg [&_strong]:font-bold'

interface JobListingProps {
  title: string
  type: 'part-time' | 'full-time'
  location?: string | null
  requirements?: SerializedEditorState | null
  offer?: SerializedEditorState | null
}

export default function JobListing({ title, type, location, requirements, offer }: JobListingProps) {
  return (
    <main className="min-h-screen px-6 py-9 text-[#2f2e3e] sm:px-12 sm:py-[47px]">
      <div className="mx-auto grid max-w-[1315px] items-start gap-14 lg:grid-cols-[minmax(0,1fr)_445px]">
        <article className="pt-0.5">
          <p className="mb-3 text-base font-bold tracking-[.01em]">POSITION</p>
          <h1 className="max-w-[720px] text-[clamp(54px,5vw,72px)] font-bold leading-[1.02] tracking-[-2.8px] max-sm:text-[clamp(46px,11vw,68px)]">{title}</h1>

          <div className="mt-[34px] flex gap-[124px] max-sm:gap-12" aria-label="Position details">
            {location && <div><p className="mb-2.5 text-base font-bold tracking-[.01em]">LOCATION</p><p className="m-0 text-[28px] tracking-[-.5px] max-sm:text-2xl">{location}</p></div>}
            <div><p className="mb-2.5 text-base font-bold tracking-[.01em]">TYPE</p><p className="m-0 text-[28px] tracking-[-.5px] max-sm:text-2xl">{typeLabels[type]}</p></div>
          </div>

          {requirements && (
            <section className="mt-[72px] max-w-[735px] max-sm:mt-[58px]">
              <h2 className="mb-[47px] text-[44px] font-normal leading-none tracking-[-1.5px] max-sm:text-[38px]">Requirements:</h2>
              <RichText className={richTextClassName} data={requirements} />
            </section>
          )}

          {offer && (
            <section className="mt-[43px] max-w-[735px]">
              <h2 className="mb-[47px] text-[44px] font-normal leading-none tracking-[-1.5px] max-sm:text-[38px]">The Offer:</h2>
              <RichText className={richTextClassName} data={offer} />
            </section>
          )}
        </article>

        <aside className="rounded-2xl border border-[#17171a] bg-[#f7f7f7]/85 px-6 py-[26px] pb-[31px] max-lg:mt-[52px] max-sm:px-[18px] max-sm:py-6">
          <h2 className="mb-[26px] text-[44px] font-normal leading-[1.08] tracking-[-1.8px] max-sm:text-[38px]">Apply for this<br />position</h2>
          <JobApplicationForm />
        </aside>
      </div>
    </main>
  )
}
