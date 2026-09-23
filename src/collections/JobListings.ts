import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localizedSlugField } from '../utilities/localizedSlugField'

export const JobListings: CollectionConfig = {
  slug: 'job-listings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'location', 'updatedAt'],
  },
  access: {
    // Listings are shown on the public open-positions page.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    localizedSlugField('title'),
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'full-time',
      options: [
        { label: 'Part-time', value: 'part-time' },
        { label: 'Full-time', value: 'full-time' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'requirements',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'offer',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
  ],
}
