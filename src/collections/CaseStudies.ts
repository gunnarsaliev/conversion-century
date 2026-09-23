import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localizedSlugField } from '../utilities/localizedSlugField'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'updatedAt'],
  },
  access: {
    // Case studies are shown on the public website.
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
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'overview',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'number',
          label: 'Number (%)',
          type: 'number',
          required: true,
        },
        {
          name: 'metric',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'e.g. "Increase in organic traffic"',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Meta title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          label: 'Meta description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
}
