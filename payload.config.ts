import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { buildConfig, type CollectionSlug } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { bg } from '@payloadcms/translations/languages/bg'
import { adminOnlyCollection, adminOrEditor, isAdmin } from './src/lib/roles'

import { Users } from './src/collections/Users'
import { Clients } from './src/collections/Clients'
import { Contacts } from './src/collections/Contacts'
import { Services } from './src/collections/Services'
import { Media } from './src/collections/Media'
import { Documents } from './src/collections/Documents'
import { Blog } from './src/collections/Blog'
import { ChecklistItems } from './src/collections/ChecklistItems'
import { ClientProgress } from './src/collections/ClientProgress'
import { JobListings } from './src/collections/JobListings'
import { JobApplicants } from './src/collections/JobApplicants'
import { CaseStudies } from './src/collections/CaseStudies'
import { Industries } from './src/collections/Industries'
import { Solutions } from './src/collections/Solutions'
import { Events } from './src/collections/Events'
import { Testimonials } from './src/collections/Testimonials'
import { Offers } from './src/collections/Offers'
import { Notifications } from './src/collections/Notifications'
import { PageMeta } from './src/collections/PageMeta'
import { Redirects } from './src/collections/Redirects'
import { notifyContractRenewals } from './src/jobs/notifyContractRenewals'
import { clearUploadedFileAfterProcessing } from './src/utilities/clearUploadedFile'
import { exportAll } from './src/endpoints/exportAll'
import { backupToR2, isAuthorized } from './src/endpoints/backupToR2'
import { seoRedirects } from './src/endpoints/seoRedirects'
import { withCmsRevalidation } from './src/lib/cms/revalidate'
import { payloadMcpPlugin } from './src/lib/mcp-plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  editor: lexicalEditor(),

  admin: {
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      // "Export all data" panel at the top of the admin dashboard.
      beforeDashboard: ['/src/components/admin/ExportAllButton#ExportAllButton'],
    },
  },

  // GET /api/export-all: every collection as one JSON download (admins only).
  // GET /api/seo-redirects: enabled redirects, read by src/proxy.ts.
  // GET /api/backup-to-r2: weekly backup ZIP to the private R2 bucket
  // (Vercel Cron in vercel.json, needs CRON_SECRET).
  endpoints: [exportAll, seoRedirects, backupToR2],

  // Collections the public site reads are wrapped so an edit refreshes the
  // cached pages that show them (see src/lib/cms).
  collections: [
    withCmsRevalidation(Users),
    withCmsRevalidation(Clients),
    withCmsRevalidation(Contacts),
    withCmsRevalidation(Services),
    withCmsRevalidation(Media),
    Documents,
    withCmsRevalidation(Blog),
    ChecklistItems,
    ClientProgress,
    withCmsRevalidation(JobListings),
    JobApplicants,
    withCmsRevalidation(CaseStudies),
    withCmsRevalidation(Industries),
    withCmsRevalidation(Solutions),
    withCmsRevalidation(Events),
    withCmsRevalidation(Testimonials),
    Offers,
    Notifications,
    withCmsRevalidation(PageMeta),
    Redirects,
  ],

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
        // Private: no disablePayloadAccessControl, so files are served via
        // /api/documents/file/:filename and the collection's read access applies.
        documents: { prefix: 'documents' },
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
      // Adds "Import" / "Export" (CSV or JSON) to each list view's menu. They
      // run inside the request rather than the jobs queue, which is only
      // processed once a day (see `jobs` below).
      collections: [
        'users',
        'clients',
        'services',
        'blog',
        'work-checklist',
        'client-checklist-progress',
        'job-listings',
        'case-studies',
        'industries',
        'solutions',
        'events',
        'testimonials',
        'offers',
      ].map((slug) => ({
        slug: slug as CollectionSlug,
        export: { disableJobsQueue: true },
        import: { disableJobsQueue: true },
      })),
      // Keep the generated imports/exports collections out of the root
      // sidebar; admins manage them, editors may only read them (and don't
      // see them in the sidebar), same as Clients.ts.
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
          ...adminOnlyCollection.admin,
          group: 'Data Management',
        },
        access: {
          ...collection.access,
          ...adminOnlyCollection.access,
          read: adminOrEditor,
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
          ...adminOnlyCollection.admin,
          group: 'Data Management',
        },
        access: {
          ...collection.access,
          ...adminOnlyCollection.access,
          read: adminOrEditor,
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

    // Read-only MCP server at /api/mcp for the dashboard AI search (agent/).
    payloadMcpPlugin,
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

  // A daily Vercel Cron (vercel.json) calls GET /api/payload-jobs/run, which
  // schedules and runs due tasks. `autoRun` is for long-running servers: on
  // Vercel it polled the database every minute while an instance was alive.
  jobs: {
    // Daily at 06:00: notify the dashboard about client contract renewals.
    tasks: [notifyContractRenewals],
    access: {
      run: ({ req }) =>
        isAdmin(req.user) || isAuthorized(req.headers.get('authorization')),
    },
  },

  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Schema changes go through migrations (src/migrations), so dev mode
    // must not push the schema itself — that would drop columns before a
    // migration gets to copy their data.
    push: false,
    migrationDir: './src/migrations',
  }),

  sharp,
})
