'use client'

/**
 * Cookie banner for a tenant site. Copy this file into the site, then:
 *
 *   pnpm add vanilla-cookieconsent
 *
 *   // app/[lang]/layout.tsx
 *   <CookieBanner
 *     apiUrl={process.env.NEXT_PUBLIC_CMS_URL!}
 *     tenant="hubavajena"
 *     locale={lang}
 *     locales={['bg', 'en']}
 *     privacyLinkLabel={{ bg: 'Политика за поверителност', en: 'Privacy policy' }}
 *   />
 *
 * `tenant` is the tenant's slug in the CMS. The CMS only accepts consent records from the
 * tenant's `domain`, so that field must match this site's address (localhost works in development).
 *
 * `locales` lists every language the site has. The library can only be set up once per page, so all
 * of them are loaded up front, and changing `locale` (for example a client-side language switch)
 * changes the banner's language in place.
 */
import { useEffect, useRef } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

type ConsentConfig = {
  categories: { analytics: boolean; marketing: boolean; preferences: boolean }
  locale: string
  privacyPolicyUrl: null | string
  revision: number
  tenant: string
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

type OptionalCategory = 'analytics' | 'marketing' | 'preferences'

type Props = {
  /** The CMS address, for example https://cms.example.com */
  apiUrl: string
  /** The language to show now. */
  locale?: string
  /** Every language the site has. Defaults to just `locale`. */
  locales?: string[]
  /** Shown as the privacy policy link text: one label, or one per language. */
  privacyLinkLabel?: Record<string, string> | string
  tenant: string
}

// The library renders its texts as HTML, so anything coming from the CMS is escaped first.
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '"': '&quot;', '&': '&amp;', "'": '&#39;', '<': '&lt;', '>': '&gt;' })[char]!,
  )

const toTranslation = (
  config: ConsentConfig,
  optional: OptionalCategory[],
  linkLabel: string,
): CookieConsent.Translation => {
  const texts = Object.fromEntries(
    Object.entries(config.texts).map(([key, value]) => [key, escape(value)]),
  ) as ConsentConfig['texts']

  return {
    consentModal: {
      acceptAllBtn: texts.acceptAllLabel,
      acceptNecessaryBtn: texts.rejectAllLabel,
      description: texts.description,
      footer: config.privacyPolicyUrl
        ? `<a href="${escape(config.privacyPolicyUrl)}">${escape(linkLabel)}</a>`
        : undefined,
      showPreferencesBtn: texts.manageLabel,
      title: texts.title,
    },
    preferencesModal: {
      acceptAllBtn: texts.acceptAllLabel,
      acceptNecessaryBtn: texts.rejectAllLabel,
      savePreferencesBtn: texts.saveLabel,
      sections: [
        {
          description: texts.necessaryDescription,
          linkedCategory: 'necessary',
          title: texts.necessaryLabel,
        },
        ...optional.map((name) => ({
          description: texts[`${name}Description`],
          linkedCategory: name,
          title: texts[`${name}Label`],
        })),
      ],
      title: texts.preferencesTitle,
    },
  }
}

export function CookieBanner({
  apiUrl,
  locale = 'en',
  locales,
  privacyLinkLabel = 'Privacy policy',
  tenant,
}: Props) {
  // Resolves once the banner is running, so language changes can wait for it.
  const ready = useRef<Promise<void> | null>(null)
  // The language to start in, read when setup finishes rather than when it begins.
  // Kept current by the language effect below (refs can't be written during render).
  const currentLocale = useRef(locale)

  const allLocales = [...new Set([...(locales ?? []), locale])]
  const localesKey = allLocales.join(',')
  const labelKey = JSON.stringify(privacyLinkLabel)

  useEffect(() => {
    let cancelled = false
    const codes = localesKey.split(',')
    const labels: Record<string, string> | string = JSON.parse(labelKey)
    const labelFor = (code: string) =>
      typeof labels === 'string' ? labels : (labels[code] ?? Object.values(labels)[0] ?? '')

    const log = (cookie: CookieConsent.CookieValue) => {
      void fetch(`${apiUrl}/api/consent/log`, {
        body: JSON.stringify({
          analytics: cookie.categories.includes('analytics'),
          consentId: cookie.consentId,
          marketing: cookie.categories.includes('marketing'),
          preferences: cookie.categories.includes('preferences'),
          revision: cookie.revision,
          tenant,
          url: window.location.href,
        }),
        headers: { 'Content-Type': 'application/json' },
        // Lets the request finish if the visitor navigates away straight after answering.
        keepalive: true,
        method: 'POST',
      }).catch(() => undefined)
    }

    const fetchConfig = async (code: string): Promise<ConsentConfig | null> => {
      const response = await fetch(
        `${apiUrl}/api/consent/config?${new URLSearchParams({ locale: code, tenant })}`,
      )

      return response.ok ? response.json() : null
    }

    const start = async () => {
      const configs = (await Promise.all(codes.map(fetchConfig))).filter(
        (config): config is ConsentConfig => config !== null,
      )

      // Without settings there is no banner, and so no consent: optional cookies stay off.
      if (configs.length === 0 || cancelled) {
        return
      }

      // Categories and revision are the same in every language; only the texts differ.
      const [first] = configs
      const optional = (['preferences', 'analytics', 'marketing'] as const).filter(
        (name) => first.categories[name],
      )
      const translations = Object.fromEntries(
        configs.map((config) => [config.locale, toTranslation(config, optional, labelFor(config.locale))]),
      )
      const wanted = currentLocale.current

      await CookieConsent.run({
        categories: {
          necessary: { enabled: true, readOnly: true },
          ...Object.fromEntries(optional.map((name) => [name, {}])),
        },
        guiOptions: { consentModal: { equalWeightButtons: true } },
        language: {
          default: wanted in translations ? wanted : first.locale,
          translations,
        },
        // The first answer, and every later change, is one row in the CMS consent log.
        onChange: ({ cookie }) => log(cookie),
        onFirstConsent: ({ cookie }) => log(cookie),
        // Raising the revision in the CMS shows the banner again to everyone.
        revision: first.revision,
      })
    }

    ready.current = start().catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [apiUrl, labelKey, localesKey, tenant])

  // Follow language changes without setting the banner up again (the library only runs once).
  useEffect(() => {
    currentLocale.current = locale
    void ready.current?.then(() => CookieConsent.setLanguage(locale)).catch(() => undefined)
  }, [locale])

  return null
}

/**
 * Elsewhere in the site:
 *
 *   CookieConsent.acceptedCategory('analytics')   // has the visitor agreed?
 *   CookieConsent.showPreferences()               // "Cookie settings" link in the footer
 *
 * Scripts can also wait for consent on their own:
 *   <script type="text/plain" data-category="analytics" src="..."></script>
 */
