import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localizedSlugField } from '../utilities/localizedSlugField'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    // Solutions are shown on the public website.
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
