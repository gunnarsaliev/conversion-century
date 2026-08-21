import withMarkdoc from '@markdoc/next.js'
import { withPayload } from '@payloadcms/next/withPayload'

import withSearch from './src/markdoc/search.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
}

export default withPayload(
  withSearch(
    withMarkdoc({ schemaPath: './src/markdoc', nextjsExports: ['revalidate'] })(
      nextConfig,
    ),
  ),
)
