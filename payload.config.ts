import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { bg } from '@payloadcms/translations/languages/bg'

import { Users } from './src/collections/Users'
import { Clients } from './src/collections/Clients'
import { Services } from './src/collections/Services'
import { Media } from './src/collections/Media'
import { WorkChecklist } from './src/collections/WorkChecklist'

export default buildConfig({
  editor: lexicalEditor(),

  collections: [Users, Clients, Services, Media, WorkChecklist],

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
