import { sendGTMEvent } from '@next/third-parties/google'

// The one way the site talks to Google Tag Manager. Components call
// `track(...)`; nothing pushes to window.dataLayer directly.
//
// Conventions (mirrored in the GTM container):
// - GA4 recommended event names where one fits, snake_case otherwise.
// - Flat, snake_case parameters; no personal data (no names, emails or phone
//   numbers). Enhanced conversions, if ever needed, are added server-side
//   in sGTM, not here.
// - Always push, whatever the consent state. Consent Mode and GTM's consent
//   checks decide which tags fire, so nothing is lost when a visitor accepts
//   cookies later in the visit.
// - Conversions carry an `event_id`, so server-side tags (Meta CAPI, Google
//   Ads) can deduplicate against browser hits.
// - Push conversions after the server confirms success, not on click.

export type AnalyticsEvent =
  | {
      // Virtual page view, pushed on every App Router navigation (see
      // RouteChangeTracker). In GTM the GA4 tag fires on this event and has
      // "send page view" and history-change page views turned off.
      event: 'page_view'
      page_location: string
      page_path: string
      page_title: string
      page_referrer?: string
      page_type: string
      locale: string
    }
  | {
      // Consultation request sent (book-a-consultation).
      event: 'generate_lead'
      form_name: 'consultation'
      locale: string
    }
  | {
      // Newsletter signup confirmed.
      event: 'sign_up'
      method: 'newsletter'
      form_name: string
      locale: string
    }
  | {
      // A call-to-action click worth reporting on (not every link). Sent by
      // CtaClickTracker for elements marked with `data-cta`.
      event: 'select_content'
      content_type: 'cta'
      item_id: string
      cta_location: string
      link_url?: string
    }

const CONVERSIONS = new Set<AnalyticsEvent['event']>(['generate_lead', 'sign_up'])

export function track(data: AnalyticsEvent) {
  if (typeof window === 'undefined') return
  sendGTMEvent(
    CONVERSIONS.has(data.event) ? { ...data, event_id: crypto.randomUUID() } : data,
  )
}

// Consent Mode v2 update, sent by the cookie banner when the visitor answers
// or changes their choice. The defaults are set in analytics.tsx before GTM
// loads. Consent commands only work as an `arguments` object, which is why
// this doesn't go through sendGTMEvent.
export function updateConsent({
  preferences,
  analytics,
  marketing,
}: {
  preferences: boolean
  analytics: boolean
  marketing: boolean
}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer || []
  const ads = marketing ? 'granted' : 'denied'
  const prefs = preferences ? 'granted' : 'denied'
  ;(function gtag(..._args: unknown[]) {
    w.dataLayer!.push(arguments)
  })('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    functionality_storage: prefs,
    personalization_storage: prefs,
  })
}

// First path segment after the locale prefix, used to group pages in
// reports: "/bg/blog/foo" → "blog", "/" → "home".
export function pageType(pathname: string) {
  const segment = pathname.replace(/^\/(en|bg)(?=\/|$)/, '').split('/')[1]
  return segment || 'home'
}
