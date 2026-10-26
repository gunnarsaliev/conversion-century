import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Montserrat } from 'next/font/google'
import clsx from 'clsx'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import { Providers } from '@/app/[locale]/providers'
import { pickClientMessages } from '@/i18n/client-messages'
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
    // Page titles are used as is (no "| Conversion Century" suffix), so what
    // is set in Dashboard → SEO → Meta data is exactly what search shows.
    title: t('title'),
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
  const messages = pickClientMessages(await getMessages())

  return (
    <html
      lang={locale}
      className={clsx('h-full antialiased', montserrat.variable)}
      suppressHydrationWarning
    >
      <body className="isolate flex min-h-full bg-white dark:bg-slate-900">
        {/* Shared by every route group, so the theme provider (and its inline
            script) isn't remounted when navigating between them. */}
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
