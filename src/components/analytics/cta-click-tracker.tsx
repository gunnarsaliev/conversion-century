'use client'

import { useEffect } from 'react'

import { track } from '@/lib/analytics/datalayer'

// Reports clicks on anything marked `data-cta="id" data-cta-location="where"`.
// One listener on the document, so CTAs can stay in server components. Capture
// phase, so a handler that stops propagation can't hide a click.
export function CtaClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const cta = event.target.closest<HTMLElement>('[data-cta]')
      if (!cta?.dataset.cta) return

      track({
        event: 'select_content',
        content_type: 'cta',
        item_id: cta.dataset.cta,
        cta_location: cta.dataset.ctaLocation ?? 'unknown',
        // Without the query string or hash, which could carry personal data.
        link_url: cta.getAttribute('href')?.split(/[?#]/)[0],
      })
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
