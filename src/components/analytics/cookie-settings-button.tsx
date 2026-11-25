'use client'

import { showPreferences } from 'vanilla-cookieconsent'

import { cn } from '@/lib/utils'

// Reopens the cookie preferences (see CookieBanner) so visitors can change or
// withdraw consent (GDPR requires withdrawing to be as easy as giving it).
export function CookieSettingsButton({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => showPreferences()}
      className={cn('cursor-pointer underline hover:text-primary', className)}
    >
      {label}
    </button>
  )
}
