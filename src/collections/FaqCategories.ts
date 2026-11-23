import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { adminOrEditor } from '../lib/roles'
import { metaTextFields } from '../fields/sectionFields'

// Groups FAQs (e.g. "Pricing", "SEO"). Each FAQ points at one category.
export const FaqCategories: CollectionConfig = {
  slug: 'faq-categories',
  labels: { singular: 'FAQ Category', plural: 'FAQ Categories' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    description: 'Categories that group the FAQs.',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description:
          'Shown when the page is shared (Open Graph / X). Best at 1200×630.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'shortDescription',
              label: 'Short description',
              type: 'richText',
              editor: lexicalEditor(),
              localized: true,
            },
            {
              name: 'faqs',
              label: 'FAQs',
              type: 'join',
              collection: 'faqs',
              on: 'category',
              admin: {
                defaultColumns: ['title', 'updatedAt'],
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: metaTextFields,
        },
      ],
    },
  ],
}
