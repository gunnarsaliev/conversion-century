// Google Consent Mode v2, driven by the cookie banner (vanilla-cookieconsent).
//
// 1. CONSENT_DEFAULT_SCRIPT runs inline in <head>, before GTM loads, and sets
//    every storage type to denied. A returning visitor's saved choice (the
//    banner's `cc_cookie`) is applied straight away, so tags on page load
//    don't wait for the banner, which first fetches its texts from the CMS.
// 2. When the visitor answers or later changes their choice, the banner calls
//    updateConsent().
//
// GA4 and Google Ads tags read Consent Mode by themselves. Other tags in the
// GTM container need "Additional consent checks" set to the matching type.

type Category = 'analytics' | 'marketing' | 'preferences'

// Banner category → Consent Mode types it grants.
const TYPES: Record<Category, string[]> = {
  analytics: ['analytics_storage'],
  marketing: ['ad_storage', 'ad_user_data', 'ad_personalization'],
  preferences: ['functionality_storage', 'personalization_storage'],
}

type ConsentState = Record<string, 'denied' | 'granted'>

function consentState(accepted: string[]): ConsentState {
  const state: ConsentState = {}
  for (const [category, types] of Object.entries(TYPES)) {
    for (const type of types) {
      state[type] = accepted.includes(category) ? 'granted' : 'denied'
    }
  }
  return state
}

const DEFAULT = JSON.stringify({
  ...consentState([]),
  security_storage: 'granted',
  // How long tags wait for the saved answer before firing as denied.
  wait_for_update: 500,
})
const TYPES_JSON = JSON.stringify(TYPES)

// Plain ES5 so it runs as written in every browser. `gtag` must push
// `arguments`, not an array: that's what GTM's consent API expects.
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
gtag('consent', 'default', ${DEFAULT});
gtag('set', 'ads_data_redaction', true);
try {
  var match = document.cookie.match(/(?:^|; )cc_cookie=([^;]*)/);
  if (match) {
    var saved = JSON.parse(decodeURIComponent(match[1]));
    var types = ${TYPES_JSON};
    var update = {};
    var categories = saved.categories || [];
    for (var category in types) {
      for (var i = 0; i < types[category].length; i++) {
        update[types[category][i]] = categories.indexOf(category) > -1 ? 'granted' : 'denied';
      }
    }
    gtag('consent', 'update', update);
  }
} catch (e) {}
`

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function updateConsent(accepted: string[]) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('consent', 'update', consentState(accepted))
  // Lets GTM triggers react to the answer (e.g. a Custom Event trigger on
  // "consent_update"), without a page reload.
  window.dataLayer?.push({ event: 'consent_update' })
}
