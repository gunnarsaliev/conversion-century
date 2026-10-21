import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { adminOnlyCollection, adminOrEditor } from '../lib/roles'

export const JobApplicants: CollectionConfig = {
  slug: 'job-applicants',
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'status', 'createdAt'],
  },
  access: {
    // Applicants' personal data — only admins may write it, editors
    // may read it. The public application form should create entries server-side
    // through the Local API, which bypasses these rules.
    ...adminOnlyCollection.access,
    read: adminOrEditor,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Hired', value: 'hired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'message',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
}
