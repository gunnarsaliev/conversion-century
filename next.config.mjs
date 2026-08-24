import withMarkdoc from '@markdoc/next.js'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

import withSearch from './src/markdoc/search.mjs'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-05efc1b2acd64b71beacdf66eed34654.r2.dev',
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
