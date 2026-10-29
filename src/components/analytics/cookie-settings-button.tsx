'use client'

import { cn } from '@/lib/utils'

declare global {
  interface Window {
    // Set by Cookiebot's uc.js (loaded through GTM).
    Cookiebot?: { renew: () => void }
  }
}

// Reopens the Cookiebot banner so visitors can change or withdraw consent
// (GDPR requires withdrawing to be as easy as giving it). Does nothing until
// Cookiebot has loaded.
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
      onClick={() => window.Cookiebot?.renew()}
      className={cn('cursor-pointer underline hover:text-primary', className)}
    >
      {label}
    </button>
  )
}
