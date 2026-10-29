'use client'

import { useEffect, useRef } from 'react'

const COOKIEBOT_ID = process.env.NEXT_PUBLIC_COOKIEBOT_ID

// Cookiebot's cookie declaration: the full, automatically maintained list of
// cookies its scanner found, in the page's language. Cookiebot renders it
// next to the script tag, so the script is added on mount (React doesn't run
// script tags it renders itself). Renders nothing without a Cookiebot ID.
export function CookieDeclaration({ locale }: { locale: 'en' | 'bg' }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = container.current
    if (!el || !COOKIEBOT_ID) return
    const script = document.createElement('script')
    script.id = 'CookieDeclaration'
    script.src = `https://consent.cookiebot.com/${COOKIEBOT_ID}/cd.js`
    script.async = true
    script.dataset.culture = locale
    el.appendChild(script)
    return () => {
      el.replaceChildren()
    }
  }, [locale])

  if (!COOKIEBOT_ID) return null
  return <div ref={container} className="not-prose my-6 text-sm" />
}
