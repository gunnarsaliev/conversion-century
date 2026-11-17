'use client'

import * as CookieConsent from 'vanilla-cookieconsent'

import { cn } from '@/lib/utils'

// Reopens the cookie preferences so visitors can change or withdraw consent
// (GDPR requires withdrawing to be as easy as giving it). Does nothing until
// the banner has loaded (see cookie-consent.tsx).
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
      onClick={() => {
        try {
          CookieConsent.showPreferences()
        } catch {
          // The banner hasn't been set up yet.
        }
      }}
      className={cn('cursor-pointer underline hover:text-primary', className)}
    >
      {label}
    </button>
  )
}
