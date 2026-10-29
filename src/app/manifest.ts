import type { MetadataRoute } from 'next'

import { SITE_NAME } from '@/lib/seo/site'

// Web app manifest (/manifest.webmanifest): name and icons for "Add to home
// screen" and some search/browser surfaces.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#0f4637',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  }
}
