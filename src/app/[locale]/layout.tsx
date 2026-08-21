import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Open_Sans, Lato } from 'next/font/google'
import clsx from 'clsx'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { routing } from '@/i18n/routing'

import '@/styles/tailwind.css'

const inter = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-lexend',
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
    title: {
      template: '%s - Docs',
      default: t('title'),
    },
    description:
      'Cache every single thing your app could ever do ahead of time, so your code never even has to run at all.',
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
      className={clsx('h-full antialiased', inter.variable, lexend.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full bg-white dark:bg-slate-900">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
