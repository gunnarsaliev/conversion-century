'use client'

import { useEffect, useRef } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

import { updateConsent } from '@/lib/analytics/consent'

// Cookie banner (vanilla-cookieconsent). The visitor's choice is kept only in
// the `cc_cookie` cookie (182 days, the library default), which the cookie and
// privacy policies describe. Texts come from the `CookieBanner` messages; the
// root layout passes every language because the library can only be set up
// once per page.
export function CookieBanner({
  locale,
  translations,
}: {
  locale: string
  translations: Record<string, CookieConsent.Translation>
}) {
  // The language the banner was set up in; `run` already shows it.
  const initialLocale = useRef(locale)

  useEffect(() => {
    void CookieConsent.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        preferences: {},
        // Withdrawing statistics consent also deletes the Google Analytics cookies.
        analytics: { autoClear: { cookies: [{ name: /^_ga/ }] } },
        marketing: {},
      },
      guiOptions: { consentModal: { equalWeightButtons: true } },
      language: { default: locale, translations },
      // Every page load with a saved answer, the first answer, and later changes.
      onConsent: ({ cookie }) => updateConsent(cookie.categories),
      onChange: ({ cookie }) => updateConsent(cookie.categories),
    })
    // Set up once; language changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Follow client-side language switches.
  useEffect(() => {
    if (locale === initialLocale.current) return
    initialLocale.current = locale
    void CookieConsent.setLanguage(locale)
  }, [locale])

  return null
}
