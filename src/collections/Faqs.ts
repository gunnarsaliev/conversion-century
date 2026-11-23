import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { adminOrEditor } from '../lib/roles'
import { metaTextFields } from '../fields/sectionFields'
import type { Faq } from '../../payload-types'

const relationId = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value
    ? (value as { id: number }).id
    : (value as number | null | undefined)

// Keeps `title` (the admin list title) in sync with the linked category's name.
const setTitle: CollectionBeforeChangeHook<Faq> = async ({ data, req }) => {
  const categoryId = relationId(data.category)
  if (categoryId) {
    const category = await req.payload.findByID({
      collection: 'faq-categories',
      id: categoryId,
      depth: 0,
      req,
    })
    data.title = category.name
  }
  return data
}

// A set of questions and answers, linked to a category in `faq-categories`.
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt'],
    description: 'Frequently asked questions, grouped by category.',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeChange: [setTitle],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'faq-categories',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
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
              name: 'questions',
              label: 'Questions',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'answer',
                  type: 'richText',
                  editor: lexicalEditor(),
                  required: true,
                  localized: true,
                },
              ],
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
