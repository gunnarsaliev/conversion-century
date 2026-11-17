'use client'

import { useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

import { getPathname } from '@/i18n/navigation'
import { updateConsent } from '@/lib/analytics/datalayer'

// The cookie banner. Its texts and categories come from our multi-tenant CMS
// (Cookie consent → Banner settings, tenant "conversion-century"), and every
// answer is recorded there as proof of consent. The CMS only accepts records
// sent from this site's domain (or localhost in development).
//
// NEXT_PUBLIC_CONSENT_API_URL: the CMS address. Without it there is no
// banner, and Google tags stay on the denied defaults set in analytics.tsx.
const API_URL = process.env.NEXT_PUBLIC_CONSENT_API_URL?.replace(/\/$/, '')
const TENANT = 'conversion-century'

type ConsentConfig = {
  categories: { analytics: boolean; marketing: boolean; preferences: boolean }
  locale: string
  privacyPolicyUrl: string | null
  revision: number
  texts: Record<
    | 'acceptAllLabel'
    | 'analyticsDescription'
    | 'analyticsLabel'
    | 'description'
    | 'manageLabel'
    | 'marketingDescription'
    | 'marketingLabel'
    | 'necessaryDescription'
    | 'necessaryLabel'
    | 'preferencesDescription'
    | 'preferencesLabel'
    | 'preferencesTitle'
    | 'rejectAllLabel'
    | 'saveLabel'
    | 'title',
    string
  >
}

// The library renders its texts as HTML, so CMS values are escaped first.
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '"': '&quot;', '&': '&amp;', "'": '&#39;', '<': '&lt;', '>': '&gt;' })[
        char
      ]!,
  )

// Tells Google tags what the visitor allows right now. Without a valid
// answer (none yet, or the CMS revision was raised) everything is denied.
function syncConsentMode() {
  const valid = CookieConsent.validConsent()
  updateConsent({
    preferences: valid && CookieConsent.acceptedCategory('preferences'),
    analytics: valid && CookieConsent.acceptedCategory('analytics'),
    marketing: valid && CookieConsent.acceptedCategory('marketing'),
  })
}

function log(cookie: CookieConsent.CookieValue) {
  void fetch(`${API_URL}/api/consent/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant: TENANT,
      consentId: cookie.consentId,
      preferences: cookie.categories.includes('preferences'),
      analytics: cookie.categories.includes('analytics'),
      marketing: cookie.categories.includes('marketing'),
      revision: cookie.revision,
      url: window.location.href,
    }),
    // Lets the request finish if the visitor navigates straight after.
    keepalive: true,
  }).catch(() => undefined)
}

export function CookieConsentBanner() {
  const locale = useLocale() as 'en' | 'bg'
  const policyLabel = useTranslations('Footer')('cookies')
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    document.documentElement.classList.toggle(
      'cc--darkmode',
      resolvedTheme === 'dark',
    )
  }, [resolvedTheme])

  useEffect(() => {
    if (!API_URL) return
    let cancelled = false

    const start = async () => {
      const response = await fetch(
        `${API_URL}/api/consent/config?${new URLSearchParams({ tenant: TENANT, locale })}`,
      )
      // No settings means no banner and so no consent: tags stay denied.
      if (!response.ok || cancelled) return

      const config: ConsentConfig = await response.json()
      if (cancelled) return

      const texts = Object.fromEntries(
        Object.entries(config.texts).map(([key, value]) => [key, escape(value)]),
      ) as ConsentConfig['texts']
      const optional = (['preferences', 'analytics', 'marketing'] as const).filter(
        (name) => config.categories[name],
      )
      const policyUrl =
        config.privacyPolicyUrl ??
        getPathname({ href: '/legal/cookie-policy', locale })

      await CookieConsent.run({
        revision: config.revision,
        categories: {
          necessary: { enabled: true, readOnly: true },
          ...Object.fromEntries(optional.map((name) => [name, {}])),
        },
        guiOptions: { consentModal: { equalWeightButtons: true } },
        language: {
          default: config.locale,
          translations: {
            [config.locale]: {
              consentModal: {
                title: texts.title,
                description: texts.description,
                acceptAllBtn: texts.acceptAllLabel,
                acceptNecessaryBtn: texts.rejectAllLabel,
                showPreferencesBtn: texts.manageLabel,
                footer: `<a href="${escape(policyUrl)}">${escape(policyLabel)}</a>`,
              },
              preferencesModal: {
                title: texts.preferencesTitle,
                acceptAllBtn: texts.acceptAllLabel,
                acceptNecessaryBtn: texts.rejectAllLabel,
                savePreferencesBtn: texts.saveLabel,
                sections: [
                  {
                    title: texts.necessaryLabel,
                    description: texts.necessaryDescription,
                    linkedCategory: 'necessary',
                  },
                  ...optional.map((name) => ({
                    title: texts[`${name}Label`],
                    description: texts[`${name}Description`],
                    linkedCategory: name,
                  })),
                ],
              },
            },
          },
        },
        // The first answer and every later change is one row in the CMS log.
        onFirstConsent: ({ cookie }) => {
          syncConsentMode()
          log(cookie)
        },
        onChange: ({ cookie }) => {
          syncConsentMode()
          log(cookie)
        },
      })

      // Returning visitors: analytics.tsx already granted what their cookie
      // says, which is wrong if the revision has been raised since.
      if (!cancelled) syncConsentMode()
    }

    void start().catch(() => undefined)

    return () => {
      cancelled = true
      // Lets the banner be rebuilt in the other language. Keeps the cookie.
      CookieConsent.reset()
    }
  }, [locale, policyLabel])

  return null
}
