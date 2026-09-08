import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { bg } from '@payloadcms/translations/languages/bg'

import { Users } from './src/collections/Users'
import { Clients } from './src/collections/Clients'
import { Services } from './src/collections/Services'
import { Media } from './src/collections/Media'
import { WorkChecklist } from './src/collections/WorkChecklist'
import { ClientChecklistProgress } from './src/collections/ClientChecklistProgress'
import { clearUploadedFileAfterProcessing } from './src/utilities/clearUploadedFile'

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

    importExportPlugin({
      collections: [{ slug: 'clients' }, { slug: 'work-checklist' }],
      // Keep the generated imports/exports collections out of the root
      // sidebar and restrict them to admins, same as Clients.ts.
      //
      // Both collections are plain Payload upload collections, so every CSV
      // a user imports or exports is written to local disk (`./imports` /
      // `./exports`) by default. We only need that file for the duration of
      // the import/export job itself, so `clearUploadedFileAfterProcessing`
      // is appended to each collection's existing `afterChange` hooks (the
      // plugin's own hooks, which do the actual processing, must run first)
      // to delete the file from disk and clear the doc's file fields once
      // processing has finished — the status/summary (imports) or doc
      // metadata (exports) stay in the admin UI, but the raw file doesn't.
      overrideImportCollection: ({ collection }) => ({
        ...collection,
        admin: {
          ...collection.admin,
          group: 'Data Management',
        },
        access: {
          ...collection.access,
          create: ({ req: { user } }) => user?.role === 'admin',
          read: ({ req: { user } }) => user?.role === 'admin',
          update: ({ req: { user } }) => user?.role === 'admin',
          delete: ({ req: { user } }) => user?.role === 'admin',
        },
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...(collection.hooks?.afterChange ?? []),
            clearUploadedFileAfterProcessing('imports'),
          ],
        },
      }),
      overrideExportCollection: ({ collection }) => ({
        ...collection,
        admin: {
          ...collection.admin,
          group: 'Data Management',
        },
        access: {
          ...collection.access,
          create: ({ req: { user } }) => user?.role === 'admin',
          read: ({ req: { user } }) => user?.role === 'admin',
          update: ({ req: { user } }) => user?.role === 'admin',
          delete: ({ req: { user } }) => user?.role === 'admin',
        },
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...(collection.hooks?.afterChange ?? []),
            clearUploadedFileAfterProcessing('exports'),
          ],
        },
      }),
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

  // Without this, jobs queued by the import/export plugin (and anything
  // else using payload.jobs.queue) just sit in the `payload-jobs`
  // collection with status "pending" forever — nothing runs them.
  // autoRun both schedules and processes the default queue every minute
  // inside this same Next.js process.
  jobs: {
    autoRun: [
      {
        cron: '* * * * *',
        queue: 'default',
      },
    ],
  },

  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  sharp,
})
