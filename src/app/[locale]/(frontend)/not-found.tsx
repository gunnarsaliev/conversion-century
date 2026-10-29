'use client'

// A client component so Link takes the locale from the provider; the
// server Link would read it from the request, which not-found can't.
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="max-w-2xl min-w-0 flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="font-display text-sm font-medium text-slate-900 dark:text-white">
          404
        </p>
        <h1 className="mt-3 text-3xl tracking-tight text-slate-900 dark:text-white">
          {t('heading')}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('description')}
        </p>
        <Link
          href="/"
          className="mt-8 text-sm font-medium text-slate-900 dark:text-white"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  )
}
