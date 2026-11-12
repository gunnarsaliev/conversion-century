import type { CollectionConfig, Field } from 'payload'
import { adminOnlyCollection, singletonAccess } from '../lib/roles'
import {
  ctaField,
  description,
  eyebrow,
  heading,
  iconField,
  imageFields,
  listField,
  paragraphs,
  paragraphsField,
} from '../fields/sectionFields'

// The content of the home page: a single document whose tabs each mirror one
// section of the page, in page order. Tabs are named, so their data is nested
// under that key (e.g. `home.hero.heading`). Lists the page builds from other
// collections (client logos, case studies, testimonials, blog posts) are not
// stored here, only the copy around them. Meta title/description stay in
// `page-meta`.

const badge: Field = { name: 'badge', type: 'text', localized: true }

// Cards that link to a page: title, description, link and icon.
const linkCards = (icons: readonly string[]): Field => ({
  name: 'items',
  type: 'array',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'href', type: 'text' },
    iconField(icons),
  ],
})

export const HomePage: CollectionConfig = {
  slug: 'home-page',
  labels: { singular: 'Home page', plural: 'Home page' },
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    ...singletonAccess('home-page'),
    // Shown on the public website.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Home page',
      admin: { description: 'Only shown in the admin panel.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            heading,
            description,
            { name: 'secondaryDescription', type: 'textarea', localized: true },
            ctaField('primaryCta'),
            ctaField('secondaryCta'),
            { name: 'socialProof', type: 'text', localized: true },
            {
              name: 'avatars',
              type: 'array',
              maxRows: 5,
              admin: { description: 'Client logos next to the social proof line.' },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'alt', label: 'Alt text', type: 'text', localized: true },
              ],
            },
            listField('highlights'),
            ...imageFields('image'),
          ],
        },
        {
          name: 'clients',
          label: 'Clients',
          fields: [
            eyebrow,
            heading,
            { name: 'footer', type: 'textarea', localized: true },
            ctaField('viewAll'),
          ],
        },
        {
          name: 'intro',
          label: 'Intro',
          fields: [
            heading,
            paragraphs,
            {
              name: 'stats',
              type: 'array',
              fields: [
                { name: 'value', type: 'text', required: true, localized: true },
                { name: 'label', type: 'text', required: true, localized: true },
              ],
            },
            ctaField('cta'),
          ],
        },
        {
          name: 'services',
          label: 'Services',
          fields: [
            heading,
            description,
            linkCards([
              'Search',
              'Wrench',
              'FileText',
              'Globe',
              'Bot',
              'Link2',
              'BarChart3',
              'MapPin',
              'GraduationCap',
            ]),
            ctaField('viewAll'),
          ],
        },
        {
          name: 'caseStudies',
          label: 'Case Studies',
          fields: [heading, description, ctaField('viewAll')],
        },
        {
          name: 'industries',
          label: 'Industries',
          fields: [
            eyebrow,
            heading,
            description,
            // Card images come from the Industries collection.
            linkCards([
              'Zap',
              'Palette',
              'Layers',
              'Rocket',
              'Blocks',
              'Globe',
              'Briefcase',
              'Plane',
              'GraduationCap',
            ]),
          ],
        },
        {
          name: 'whyUs',
          label: 'Why Us',
          fields: [
            badge,
            heading,
            { name: 'subheading', type: 'text', localized: true },
            ...imageFields('image'),
            {
              name: 'points',
              type: 'array',
              admin: {
                description: 'The first half is shown left of the image, the rest right of it.',
              },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'description', type: 'textarea', localized: true },
                iconField([
                  'Users',
                  'UserCheck',
                  'BarChart3',
                  'ShieldCheck',
                  'Sparkles',
                  'Handshake',
                ]),
              ],
            },
          ],
        },
        {
          name: 'founderLetter',
          label: 'Founder Letter',
          fields: [
            eyebrow,
            heading,
            ...imageFields('portrait'),
            paragraphsField('quote'),
            { name: 'name', type: 'text', localized: true },
            { name: 'role', type: 'text', localized: true },
            ctaField('cta'),
          ],
        },
        {
          name: 'testimonials',
          label: 'Testimonials',
          fields: [heading, ctaField('viewAll')],
        },
        {
          name: 'blog',
          label: 'Blog',
          fields: [badge, heading, description, ctaField('viewAll')],
        },
      ],
    },
  ],
}
