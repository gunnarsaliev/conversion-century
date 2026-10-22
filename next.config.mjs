import withMarkdoc from '@markdoc/next.js'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

import withSearch from './src/markdoc/search.mjs'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { source: '/website/:path*', destination: '/:path*', permanent: true },
      { source: '/:locale(en|bg)/website', destination: '/:locale', permanent: true },
      {
        source: '/:locale(en|bg)/website/:path*',
        destination: '/:locale/:path*',
        permanent: true,
      },
    ]
  },
  experimental: {
    serverActions: {
      // The testimonial form uploads up to two images (2 MB each) via a
      // Server Action; the 1 MB default is too small. Stays under Vercel's
      // 4.5 MB request body limit.
      bodySizeLimit: '4.5mb',
    },
  },
  images: {
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
      withMarkdoc({ schemaPath: './src/markdoc', nextjsExports: ['revalidate'] })(
        nextConfig,
      ),
    ),
  ),
)
