import type { CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/roles'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localizedSlugField } from '../utilities/localizedSlugField'
import { metaExtraFields } from '../fields/sectionFields'

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    ...adminOnlyCollection.access,
    // Logged-in users (editors/admins) always see every version, including
    // drafts. Logged-out visitors only ever see published industries.
    read: ({ req }) => {
      if (req.user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'clientTypes',
      label: 'Client Types',
      type: 'array',
      labels: { singular: 'Client Type', plural: 'Client Types' },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'industryGoal',
      label: 'Industry Goal',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'paragraphs',
          type: 'array',
          labels: { singular: 'Paragraph', plural: 'Paragraphs' },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'howWeHelp',
      label: 'How We Help',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'paragraph',
              type: 'textarea',
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'measureProgress',
      label: 'Measure Progress',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor(),
          localized: true,
        },
        {
          name: 'items',
          type: 'array',
          labels: { singular: 'Item', plural: 'Items' },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'paragraph',
              type: 'textarea',
              localized: true,
            },
          ],
        },
      ],
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
        ...metaExtraFields,
      ],
    },
  ],
}
