import type { CollectionConfig } from 'payload'
import { localizedSlugField } from '../utilities/localizedSlugField'
import {
  description,
  eyebrow,
  faqFields,
  heading,
  headingSectionFields,
  listField,
  metaFields,
  paragraphs,
  titleDescriptionItems,
} from '../fields/sectionFields'

// Each tab mirrors one section of a solution page. Tabs are named, so their
// data is nested under that key (e.g. `solution.hero.heading`).

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    // Solutions are shown on the public website.
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
          fields: [eyebrow, heading, paragraphs, listField('highlights')],
        },
        {
          name: 'concerns',
          label: 'Concerns',
          fields: [heading, titleDescriptionItems],
        },
        {
          name: 'businessGrowth',
          label: 'Business Growth',
          fields: [
            eyebrow,
            heading,
            { name: 'lead', type: 'textarea', localized: true },
            paragraphs,
          ],
        },
        {
          name: 'audience',
          label: 'Audience',
          fields: headingSectionFields,
        },
        {
          name: 'partnerNeeds',
          label: 'Partner Needs',
          fields: headingSectionFields,
        },
        {
          name: 'whyUs',
          label: 'Why Us',
          fields: [heading, titleDescriptionItems],
        },
        {
          name: 'includes',
          label: 'Includes',
          fields: [
            heading,
            description,
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
          name: 'outcomes',
          label: 'Outcomes',
          fields: [heading, description, titleDescriptionItems],
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
          name: 'consultation',
          label: 'Consultation',
          fields: [heading, description],
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
