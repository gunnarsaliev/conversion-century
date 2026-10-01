import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localizedSlugField } from '../utilities/localizedSlugField'
import { metaFields } from '../fields/sectionFields'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', '_status'],
  },
  access: {
    // Same as Blog: editors see drafts, visitors only see published events.
    read: ({ req }) => {
      if (req.user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
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
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'conference',
      options: [
        { label: 'Conference', value: 'conference' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'Interview', value: 'interview' },
        { label: 'Press', value: 'press' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      admin: {
        description: 'e.g. "Sofia, Bulgaria" or "Online".',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short summary shown on the event card.',
      },
    },
    {
      name: 'externalUrl',
      label: 'External link',
      type: 'text',
      admin: {
        description: 'Registration page, recording, or article URL.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: metaFields,
    },
  ],
}
