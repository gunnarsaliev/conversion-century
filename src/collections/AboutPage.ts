import type { CollectionConfig, Field } from 'payload'
import { adminOnlyCollection, singletonAccess } from '../lib/roles'
import {
  ctaField,
  description,
  eyebrow,
  heading,
  iconField,
  imageFields,
  paragraphs,
  paragraphsField,
} from '../fields/sectionFields'

// The content of the About page: a single document whose tabs each mirror
// one section of the page, in page order. Tabs are named, so their data is
// nested under that key (e.g. `about.hero.heading`). Team members come from
// Users and the partner badges are shared with the footer, so neither is
// stored here. Meta title/description stay in `page-meta`.

const lead: Field = { name: 'lead', type: 'textarea', localized: true }

export const AboutPage: CollectionConfig = {
  slug: 'about-page',
  labels: { singular: 'About page', plural: 'About page' },
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    ...singletonAccess('about-page'),
    // Shown on the public website.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'About page',
      admin: { description: 'Only shown in the admin panel.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [eyebrow, heading, paragraphs, ctaField('cta'), ...imageFields('image')],
        },
        {
          name: 'story',
          label: 'Story',
          fields: [
            eyebrow,
            heading,
            {
              name: 'years',
              type: 'array',
              fields: [
                { name: 'year', type: 'text', required: true },
                { name: 'title', type: 'text', required: true, localized: true },
                paragraphsField('content'),
              ],
            },
          ],
        },
        {
          name: 'people',
          label: 'People',
          fields: [eyebrow, heading, lead, paragraphs],
        },
        {
          name: 'leadership',
          label: 'Leadership',
          fields: [
            eyebrow,
            heading,
            paragraphsField('intro'),
            ...imageFields('portrait'),
            paragraphsField('quote'),
            { name: 'name', type: 'text', localized: true },
            { name: 'role', type: 'text', localized: true },
          ],
        },
        {
          name: 'markets',
          label: 'Markets',
          fields: [
            eyebrow,
            heading,
            lead,
            {
              name: 'spans',
              type: 'text',
              localized: true,
              admin: { description: 'Line above the country list.' },
            },
            {
              name: 'countries',
              type: 'array',
              fields: [
                {
                  name: 'code',
                  type: 'text',
                  required: true,
                  minLength: 2,
                  maxLength: 2,
                  admin: {
                    description:
                      'Two-letter ISO 3166 country code (e.g. "de"). The flag and the translated name come from it.',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'partners',
          label: 'Partners',
          fields: [eyebrow, heading, description],
        },
        {
          name: 'collaboration',
          label: 'Collaboration',
          fields: [eyebrow, heading, lead, paragraphs],
        },
        {
          name: 'mission',
          label: 'Mission',
          fields: [
            eyebrow,
            { name: 'statement', type: 'textarea', localized: true },
            paragraphs,
          ],
        },
        {
          name: 'principles',
          label: 'Principles',
          fields: [
            eyebrow,
            heading,
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'content', type: 'textarea', localized: true },
                iconField([
                  'Search',
                  'ShieldCheck',
                  'MessagesSquare',
                  'Sprout',
                  'FlaskConical',
                  'Handshake',
                ]),
              ],
            },
          ],
        },
      ],
    },
  ],
}
