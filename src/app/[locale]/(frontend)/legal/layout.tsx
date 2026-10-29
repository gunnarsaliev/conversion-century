import { getTranslations, setRequestLocale } from 'next-intl/server'

import WebsiteLayout from '@/app/[locale]/(site)/layout'
import { LegalNav } from '@/components/legal/legal-nav'

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  setRequestLocale((await params).locale)
  // Titles reuse the footer's legal link text. Translated here because
  // `Footer` messages aren't sent to client components.
  const t = await getTranslations('Footer')
  const pages = [
    { title: t('terms'), href: '/legal/terms-and-conditions' },
    { title: t('privacy'), href: '/legal/privacy-policy' },
    { title: t('cookies'), href: '/legal/cookie-policy' },
  ]

  return (
    <WebsiteLayout params={params}>
      <div className="flex flex-col gap-8 pt-12 lg:flex-row lg:gap-16 lg:pt-16">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <LegalNav label={t('legal')} pages={pages} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </WebsiteLayout>
  )
}
