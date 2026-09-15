import type { CollectionConfig, FieldHook } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import slugify from 'slugify'

// Falls back to slugifying `name` when the editor leaves `slug` blank.
// `slugify`'s locale option transliterates Cyrillic (and other non-Latin
// scripts) to Latin characters rather than stripping them, so a Bulgarian
// service name still produces a readable, URL-safe slug.
const generateSlugFromName: FieldHook = ({ value, data, req }) => {
  if (typeof value === 'string' && value.trim().length > 0) return value

  const name = data?.name
  if (typeof name !== 'string' || name.trim().length === 0) return value

  return slugify(name, {
    lower: true,
    strict: true,
    locale: req.locale === 'bg' ? 'bg' : 'en',
  })
}

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Leave blank to auto-generate from the name (Cyrillic is transliterated to Latin characters).',
      },
      hooks: {
        beforeValidate: [generateSlugFromName],
      },
    },
    {
      name: 'shortDescription',
      type: 'text',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Price (EUR)',
      min: 0,
    },
    {
      name: 'about',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'includes',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor(),
          localized: true,
        },
      ],
    },
  ],
}
