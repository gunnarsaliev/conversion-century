import type { ArrayField, Field } from 'payload'

// Building blocks for page collections (services, solutions) whose tabs each
// mirror one section of the page.

export const heading: Field = { name: 'heading', type: 'text', localized: true }

export const eyebrow: Field = { name: 'eyebrow', type: 'text', localized: true }

export const description: Field = { name: 'description', type: 'textarea', localized: true }

// Paragraphs are stored as one textarea separated by blank lines — much
// easier to edit than an array with one row per paragraph.
export const paragraphs: Field = {
  name: 'paragraphs',
  type: 'textarea',
  localized: true,
  admin: { description: 'Separate paragraphs with a blank line.' },
}

// Payload arrays can't hold plain strings, so each list item is `{ text }`.
export const listField = (name: string): Field => ({
  name,
  type: 'array',
  fields: [{ name: 'text', type: 'text', required: true, localized: true }],
})

export const ctaField = (name: string): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', localized: true },
    { name: 'href', type: 'text' },
  ],
})

export const titleDescriptionItems: ArrayField = {
  name: 'items',
  type: 'array',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
  ],
}

// Heading, intro paragraphs, then a bulleted list.
export const headingSectionFields: Field[] = [
  heading,
  paragraphs,
  { name: 'listIntro', type: 'text', localized: true },
  listField('list'),
]

export const faqFields: Field[] = [
  heading,
  {
    name: 'items',
    type: 'array',
    fields: [
      { name: 'question', type: 'text', required: true, localized: true },
      { name: 'answer', type: 'textarea', required: true, localized: true },
    ],
  },
]

export const metaFields: Field[] = [
  { name: 'title', label: 'Meta title', type: 'text', localized: true },
  {
    name: 'description',
    label: 'Meta description',
    type: 'textarea',
    localized: true,
  },
]
