import type { Field } from 'payload'
import { adminOrEditor } from '../lib/roles'

// Private files attached to a record (users, clients). The files themselves
// live in the `documents` collection; read access on the field keeps the list
// to admins and editors even where the parent record is more widely readable
// (users: any logged-in user; clients: the public, for `showOnWebsite`).
export const documentsField: Field = {
  name: 'documents',
  type: 'array',
  labels: { singular: 'Document', plural: 'Documents' },
  access: {
    read: adminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'documents',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
