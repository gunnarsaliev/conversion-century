import type { CollectionConfig, Field } from 'payload'
import { localizedSlugField } from '../utilities/localizedSlugField'

// Each tab mirrors one section of a service page. Tabs are named, so their
// data is nested under that key (e.g. `service.hero.heading`).

const heading: Field = { name: 'heading', type: 'text', localized: true }

// Paragraphs are stored as one textarea separated by blank lines — much
// easier to edit than an array with one row per paragraph.
const paragraphs: Field = {
  name: 'paragraphs',
  type: 'textarea',
  localized: true,
  admin: { description: 'Separate paragraphs with a blank line.' },
}

// Payload arrays can't hold plain strings, so each list item is `{ text }`.
const listField = (name: string): Field => ({
  name,
  type: 'array',
  fields: [{ name: 'text', type: 'text', required: true, localized: true }],
})

const ctaField = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', localized: true },
    { name: 'href', type: 'text' },
  ],
})

const titleDescriptionItems: Field = {
  name: 'items',
  type: 'array',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}

// Heading, intro paragraphs, then a bulleted list.
const headingSectionFields: Field[] = [
  heading,
  paragraphs,
  { name: 'listIntro', type: 'text', localized: true },
  listField('list'),
]

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    // Services are shown on the public website.
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    localizedSlugField('name'),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true },
            heading,
            { name: 'description', type: 'textarea', localized: true },
            listField('highlights'),
          ],
        },
        {
          name: 'partnership',
          label: 'Partnership',
          fields: [{ name: 'eyebrow', type: 'text', localized: true }, heading, paragraphs],
        },
        {
          name: 'whatIs',
          label: 'What Is',
          fields: [heading, paragraphs],
        },
        {
          name: 'includes',
          label: 'Includes',
          fields: [
            heading,
            { name: 'description', type: 'textarea', localized: true },
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                paragraphs,
              ],
            },
          ],
        },
        {
          name: 'priorities',
          label: 'Priorities',
          fields: headingSectionFields,
        },
        {
          name: 'process',
          label: 'Process',
          fields: [
            heading,
            { ...titleDescriptionItems, name: 'steps' },
            { name: 'note', type: 'textarea', localized: true },
          ],
        },
        {
          name: 'fit',
          label: 'Fit',
          fields: [
            {
              name: 'rightChoice',
              type: 'group',
              fields: [heading, { name: 'listIntro', type: 'text', localized: true }, listField('list')],
            },
            {
              name: 'notRight',
              type: 'group',
              fields: [heading, paragraphs, ctaField('cta')],
            },
          ],
        },
        {
          name: 'whyUs',
          label: 'Why Us',
          fields: [heading, titleDescriptionItems],
        },
        {
          name: 'measurement',
          label: 'Measurement',
          fields: headingSectionFields,
        },
        {
          name: 'teamExtension',
          label: 'Team Extension',
          fields: headingSectionFields,
        },
        {
          name: 'faq',
          label: 'FAQ',
          fields: [
            heading,
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', required: true, localized: true },
                { name: 'answer', type: 'textarea', required: true, localized: true },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            { name: 'title', label: 'Meta title', type: 'text', localized: true },
            {
              name: 'description',
              label: 'Meta description',
              type: 'textarea',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
