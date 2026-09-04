import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { bg } from '@payloadcms/translations/languages/bg'

import { Users } from './src/collections/Users'
import { Clients } from './src/collections/Clients'
import { Services } from './src/collections/Services'
import { Media } from './src/collections/Media'
import { WorkChecklist } from './src/collections/WorkChecklist'
import { ClientChecklistProgress } from './src/collections/ClientChecklistProgress'

export default buildConfig({
  editor: lexicalEditor(),

  collections: [Users, Clients, Services, Media, WorkChecklist, ClientChecklistProgress],

  plugins: [
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET),
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename
            return `${process.env.R2_PUBLIC_URL}/${key}`
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: process.env.R2_REGION || 'auto',
        // R2's S3-compatible API endpoint — used for uploads only. Files are
        // served publicly via R2_PUBLIC_URL (see generateFileURL above).
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],

  // Admin panel UI language.
  i18n: {
    supportedLanguages: { en, bg },
  },

  // Content localization (fields marked `localized: true`).
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Български', code: 'bg' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  sharp,
})
