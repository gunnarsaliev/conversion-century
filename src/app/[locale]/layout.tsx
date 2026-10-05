import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DM_Serif_Display, Lato } from 'next/font/google'
import clsx from 'clsx'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { IS_INDEXABLE, SITE_NAME, SITE_URL } from '@/lib/seo/site'

import '@/styles/tailwind.css'

// Body and UI text. Lato has no Cyrillic glyphs, so Bulgarian text falls
// back to the system sans-serif.
const lato = Lato({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-lato',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
})

// All h1–h6 headings (see src/styles/tailwind.css). Ships a single weight
// (400). No Cyrillic either — falls back to Georgia/serif.
const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-dm-serif-display',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
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
      className={clsx('h-full antialiased', lato.variable, dmSerifDisplay.variable)}
      suppressHydrationWarning
    >
      <body className="isolate flex min-h-full bg-white dark:bg-slate-900">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
