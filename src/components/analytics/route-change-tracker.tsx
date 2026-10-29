'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'

import { pageType, track } from '@/lib/analytics/datalayer'

// Pushes a `page_view` for the first page and every client-side navigation.
// The App Router never reloads the page, so GTM's own page view would only
// count the landing page.
export function RouteChangeTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const previousUrl = useRef<string | null>(null)

  useEffect(() => {
    const url = window.location.href
    if (url === previousUrl.current) return

    track({
      event: 'page_view',
      page_location: url,
      page_path: pathname,
      page_title: document.title,
      page_referrer: previousUrl.current ?? document.referrer,
      page_type: pageType(pathname),
      locale,
    })
    previousUrl.current = url
  }, [pathname, searchParams, locale])

  return null
}
