'use client'

import { useLocale } from 'next-intl'
import { useSwitchLocale } from '@/i18n/use-switch-locale'

const otherLocale: Record<string, 'en' | 'bg'> = {
  bg: 'en',
  en: 'bg',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const switchLocale = useSwitchLocale()
  const nextLocale = otherLocale[locale] ?? 'en'

  return (
    <button
      type="button"
      onClick={() => switchLocale(nextLocale)}
      className="flex h-6 min-w-6 items-center justify-center rounded-lg px-1.5 text-xs font-semibold text-slate-500 shadow-md ring-1 shadow-black/5 ring-black/5 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:ring-white/5 dark:ring-inset dark:hover:text-white"
      aria-label={`Switch language to ${nextLocale.toUpperCase()}`}
    >
      {nextLocale.toUpperCase()}
    </button>
  )
}
