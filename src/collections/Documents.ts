import type { CollectionConfig } from 'payload'
import { adminOnlyCollection, adminOrEditor } from '../lib/roles'

// Private files (contracts, IDs, invoices) attached to users and clients via
// the shared `documents` array field (src/fields/documentsField.ts). Unlike
// Media, these are never public: files are served through Payload's
// /api/documents/file/:filename route (see s3Storage in payload.config.ts),
// which enforces the `read` access below.
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'filename',
  },
  access: {
    ...adminOnlyCollection.access,
    read: adminOrEditor,
  },
  upload: {
    // Files live in R2, not on local disk — same as Media.ts.
    disableLocalStorage: true,
    staticDir: 'documents',
    mimeTypes: [
      'application/pdf',
      'image/*',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  fields: [],
}
