import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import JobApplicationForm from '@/components/job-application-form'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

// Styles the lists (and any paragraphs/bold text) produced by the Lexical
// editor. Text size is set per use.
const richTextClassName =
  'space-y-3 leading-relaxed text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_li]:pl-1 [&_li::marker]:text-primary [&_strong]:font-semibold [&_strong]:text-foreground'

const pillClassName =
  'inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground [&>svg]:size-4 [&>svg]:text-muted-foreground'

interface JobListingProps {
  title: string
  type: 'part-time' | 'full-time' | 'full-time-hybrid'
  location?: string | null
  description?: SerializedEditorState | null
  responsibilities?: SerializedEditorState | null
  requirements?: SerializedEditorState | null
  offer?: SerializedEditorState | null
}

function Section({ title, data }: { title: string; data: SerializedEditorState }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <RichText className={`${richTextClassName} text-base`} data={data} />
    </section>
  )
}

export default function JobListing({
  title,
  type,
  location,
  description,
  responsibilities,
  requirements,
  offer,
}: JobListingProps) {
  const t = useTranslations('Careers')

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <Link
        href="/open-positions"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('listing.back')}
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">{t('listing.eyebrow')}</p>
        <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-[-1px] text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <div className="mt-6 flex flex-wrap gap-2" aria-label={t('listing.details')}>
          {location && (
            <span className={pillClassName}>
              <MapPin />
              {location}
            </span>
          )}
          <span className={pillClassName}>
            <BriefcaseBusiness />
            {t(`types.${type}`)}
          </span>
        </div>
      </header>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <article className="space-y-8">
          {description && (
            <RichText className={`${richTextClassName} text-lg`} data={description} />
          )}
          {responsibilities && <Section title={t('listing.responsibilities')} data={responsibilities} />}
          {requirements && <Section title={t('listing.requirements')} data={requirements} />}
          {offer && <Section title={t('listing.offer')} data={offer} />}
        </article>

        <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t('listing.applyHeading')}
          </h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            {t('listing.applyNote')}
          </p>
          <JobApplicationForm />
        </aside>
      </div>
    </main>
  )
}
