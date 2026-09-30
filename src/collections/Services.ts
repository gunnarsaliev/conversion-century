import type { CollectionConfig } from 'payload'
import { localizedSlugField } from '../utilities/localizedSlugField'
import {
  ctaField,
  faqFields,
  heading,
  headingSectionFields,
  listField,
  metaFields,
  paragraphs,
  titleDescriptionItems,
} from '../fields/sectionFields'

// Each tab mirrors one section of a service page. Tabs are named, so their
// data is nested under that key (e.g. `service.hero.heading`).

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
          fields: faqFields,
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: metaFields,
        },
      ],
    },
  ],
}
