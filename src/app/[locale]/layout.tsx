import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import { Montserrat } from 'next/font/google'
import clsx from 'clsx'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server'
import type { Translation } from 'vanilla-cookieconsent'

import { Providers } from '@/app/[locale]/providers'
import { CookieBanner } from '@/components/CookieBanner'
import { pickClientMessages } from '@/i18n/client-messages'
import { getPathname } from '@/i18n/navigation'
import { CONSENT_DEFAULT_SCRIPT } from '@/lib/analytics/consent'
import { routing } from '@/i18n/routing'
import { IS_INDEXABLE, SITE_NAME, SITE_URL } from '@/lib/seo/site'

import '@/styles/tailwind.css'

// Global typeface for body, UI and headings. Variable font, so every weight
// is available; includes Cyrillic for Bulgarian.
const montserrat = Montserrat({
  // Only these are preloaded; latin-ext/cyrillic-ext glyphs still load on
  // demand via unicode-range when a page uses them.
  subsets: ['latin', 'cyrillic'],
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
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale()
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  const t = await getTranslations({ locale, namespace: 'LocaleLayout' })

  return {
    metadataBase: new URL(SITE_URL),
    // Page titles are used as is (no "| Conversion Century" suffix), so what
    // is set in Dashboard → SEO → Meta data is exactly what search shows.
    title: t('title'),
    description: t('description'),
    applicationName: SITE_NAME,
    robots: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
    // Search Console / Bing Webmaster Tools ownership tags, when configured.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
        : undefined,
    },
  }
}

export default async function LocaleLayout({ children }: Props) {
  // From next/root-params rather than the `params` prop: awaiting `params` at
  // the top of the root layout trips Cache Components' "runtime data during
  // prerendering" check, and the locale can't go in <Suspense> (it sets
  // <html lang>).
  const locale = await rootLocale()
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  // Explicit locale: without it next-intl may fall back to reading request
  // headers, which would make every page dynamic.
  const messages = pickClientMessages(await getMessages({ locale }))
  // The cookie banner loads every language up front and switches in place.
  const cookieBannerTranslations = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (code) => {
        const t = await getTranslations({
          locale: code,
          namespace: 'CookieBanner',
        })
        const privacyUrl = getPathname({
          href: '/legal/privacy-policy',
          locale: code,
        })
        const section = (
          name: 'necessary' | 'preferences' | 'analytics' | 'marketing',
        ) => ({
          title: t(`${name}Label`),
          description: t(`${name}Description`),
          linkedCategory: name,
        })
        const translation: Translation = {
          consentModal: {
            title: t('title'),
            description: t('description'),
            acceptAllBtn: t('acceptAll'),
            acceptNecessaryBtn: t('rejectAll'),
            showPreferencesBtn: t('manage'),
            footer: `<a href="${privacyUrl}">${t('privacyLink')}</a>`,
          },
          preferencesModal: {
            title: t('preferencesTitle'),
            acceptAllBtn: t('acceptAll'),
            acceptNecessaryBtn: t('rejectAll'),
            savePreferencesBtn: t('save'),
            sections: [
              section('necessary'),
              section('preferences'),
              section('analytics'),
              section('marketing'),
            ],
          },
        }
        return [code, translation] as const
      }),
    ),
  )

  return (
    <html
      lang={locale}
      className={clsx('h-full antialiased', montserrat.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Consent Mode defaults (denied) must be set before GTM loads. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
      </head>
      <body className="isolate flex min-h-full bg-white dark:bg-slate-900">
        {/* Shared by every route group, so the theme provider (and its inline
            script) isn't remounted when navigating between them. */}
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <CookieBanner locale={locale} translations={cookieBannerTranslations} />
      </body>
    </html>
  )
}
