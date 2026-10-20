import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Montserrat } from 'next/font/google'
import clsx from 'clsx'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { IS_INDEXABLE, SITE_NAME, SITE_URL } from '@/lib/seo/site'

import '@/styles/tailwind.css'

// Global typeface for body, UI and headings. Variable font, so every weight
// is available; includes Cyrillic for Bulgarian.
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'LocaleLayout' })

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: t('title'),
    },
    description: t('description'),
    applicationName: SITE_NAME,
    robots: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={clsx('h-full antialiased', montserrat.variable)}
      suppressHydrationWarning
    >
      <body className="isolate flex min-h-full bg-white dark:bg-slate-900">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
