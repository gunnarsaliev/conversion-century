import { Suspense } from 'react'
import { GoogleTagManager } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { RouteChangeTracker } from './route-change-tracker'

// Tracking for the public site (rendered by the (site) layout only, so the
// dashboard, docs and tools aren't tracked).
//
// GTM loads after hydration (next/script afterInteractive), off the critical
// path. Cookiebot is loaded by GTM itself (Cookiebot CMP template on the
// Consent Initialization trigger), which sets Consent Mode v2 defaults to
// denied before any tag runs. Consent Mode runs in advanced mode: without
// consent, Google tags still send cookieless pings (no identifiers), which
// the cookie and privacy policies describe.
//
// NEXT_PUBLIC_GTM_SCRIPT_URL: the script URL from Stape's Custom Loader
// snippet (loads gtm.js from our sGTM subdomain, so ad blockers and ITP
// don't cut it off). Without it, GTM loads from googletagmanager.com with
// NEXT_PUBLIC_GTM_ID.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const GTM_SCRIPT_URL = process.env.NEXT_PUBLIC_GTM_SCRIPT_URL

export function Analytics() {
  // On whenever a GTM env var is set, independent of SITE_INDEXABLE, so the
  // tracking setup can be tested on a noindex staging domain. Set the vars in
  // the Production environment only, so previews and local dev don't track.
  const gtmEnabled = Boolean(GTM_SCRIPT_URL || GTM_ID)

  return (
    <>
      {gtmEnabled && (
        <>
          {GTM_SCRIPT_URL ? (
            // A Stape loader URL already encodes the container.
            <GoogleTagManager gtmScriptUrl={GTM_SCRIPT_URL} />
          ) : (
            <GoogleTagManager gtmId={GTM_ID!} />
          )}
          {/* useSearchParams needs a Suspense boundary to keep the page
              prerendered. */}
          <Suspense fallback={null}>
            <RouteChangeTracker />
          </Suspense>
        </>
      )}
      {/* Real-user Core Web Vitals (cookieless). */}
      <SpeedInsights />
    </>
  )
}
