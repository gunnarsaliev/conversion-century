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
      // A call-to-action click worth reporting on (not every link).
      event: 'select_content'
      content_type: 'cta'
      item_id: string
      link_url?: string
    }

const CONVERSIONS = new Set<AnalyticsEvent['event']>(['generate_lead', 'sign_up'])

export function track(data: AnalyticsEvent) {
  if (typeof window === 'undefined') return
  sendGTMEvent(
    CONVERSIONS.has(data.event) ? { ...data, event_id: crypto.randomUUID() } : data,
  )
}

// First path segment after the locale prefix, used to group pages in
// reports: "/bg/blog/foo" → "blog", "/" → "home".
export function pageType(pathname: string) {
  const segment = pathname.replace(/^\/(en|bg)(?=\/|$)/, '').split('/')[1]
  return segment || 'home'
}
