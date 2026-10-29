import withMarkdoc from '@markdoc/next.js'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

import withSearch from './src/markdoc/search.mjs'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Partial prerendering: static shell + 'use cache' data, dynamic parts
  // stream in <Suspense>. See src/lib/cms for the cached Payload reads.
  cacheComponents: true,
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
  // Loaded from node_modules at runtime instead of being bundled; renders the
  // offer PDF in special-offer/pdf.
  serverExternalPackages: ['@react-pdf/renderer'],
  // The offer PDF reads its font and images from disk by path, which the
  // file tracer can't see; ship them with that route.
  outputFileTracingIncludes: {
    '/*/{special-offer,offers/*}/pdf': [
      './node_modules/@expo-google-fonts/inter/{400Regular,600SemiBold,700Bold}/*.ttf',
      './src/app/**/offer/*.png',
    ],
  },
  // The public site used to live under /website (behind the pre-launch login
  // gate); old links, including ones saved in Payload rich text, still work.
  async redirects() {
    return [
      { source: '/website', destination: '/', permanent: true },
      // The standalone team page was folded into About.
      { source: '/team', destination: '/about', permanent: true },
      { source: '/:locale(en|bg)/team', destination: '/:locale/about', permanent: true },
      { source: '/website/:path*', destination: '/:path*', permanent: true },
      // Blog categories used to be `?category=`; they now live at
      // /blog/<category> (unknown categories 404 there).
      {
        source: '/blog',
        has: [{ type: 'query', key: 'category', value: '(?<category>[a-z0-9-]+)' }],
        destination: '/blog/:category',
        permanent: true,
      },
      {
        source: '/:locale(en|bg)/blog',
        has: [{ type: 'query', key: 'category', value: '(?<category>[a-z0-9-]+)' }],
        destination: '/:locale/blog/:category',
        permanent: true,
      },
      { source: '/:locale(en|bg)/website', destination: '/:locale', permanent: true },
      {
        source: '/:locale(en|bg)/website/:path*',
        destination: '/:locale/:path*',
        permanent: true,
      },
    ]
  },
  experimental: {
    // `next/root-params`: src/i18n/request.ts reads the locale from it.
    rootParams: true,
    serverActions: {
      // The testimonial form uploads up to two images (2 MB each) via a
      // Server Action; the 1 MB default is too small. Stays under Vercel's
      // 4.5 MB request body limit.
      bodySizeLimit: '4.5mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // CMS uploads never change in place (a new upload gets a new filename).
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-05efc1b2acd64b71beacdf66eed34654.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default withPayload(
  withNextIntl(
    withSearch(
      withMarkdoc({ schemaPath: './src/markdoc', nextjsExports: [] })(
        nextConfig,
      ),
    ),
  ),
)
