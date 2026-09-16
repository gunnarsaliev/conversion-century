import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import slugify from 'slugify'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', '_status', 'updatedAt'],
  },
  access: {
    // Logged-in users (editors/admins) always see every version, including
    // drafts. Logged-out visitors only ever see published posts — matches
    // the standard Payload drafts pattern.
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
    slugField({
      useAsSlug: 'title',
      localized: true,
      position: 'sidebar',
      // `slugify`'s locale option transliterates Cyrillic (and other
      // non-Latin scripts) to Latin characters rather than stripping them,
      // so a Bulgarian post title still produces a readable, URL-safe
      // slug. Falls back to English rules for any other locale.
      slugify: ({ valueToSlugify, req }) =>
        slugify(valueToSlugify, {
          lower: true,
          strict: true,
          locale: req.locale === 'bg' ? 'bg' : 'en',
        }),
    }),
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Short summary shown in blog listings and previews.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
  ],
}
