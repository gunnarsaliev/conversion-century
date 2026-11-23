import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { adminOrEditor } from '../lib/roles'
import { metaTextFields } from '../fields/sectionFields'
import { localizedSlugField } from '../utilities/localizedSlugField'

// A topic page of questions and answers, shown at /faqs/<slug>.
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Frequently asked questions, one page per topic.',
  },
  access: {
    read: () => true,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    localizedSlugField('title'),
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
