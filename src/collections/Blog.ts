import { ValidationError, type CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localizedSlugField } from '../utilities/localizedSlugField'
import { metaFields } from '../fields/sectionFields'
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS, isBlogCategory } from '../lib/blog-categories'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', '_status', 'updatedAt'],
  },
  hooks: {
    // /blog/<category> is a category page, so a post with that slug would
    // be unreachable.
    beforeValidate: [
      ({ data }) => {
        if (isBlogCategory(data?.slug)) {
          throw new ValidationError({
            collection: 'blog',
            errors: [
              {
                path: 'slug',
                message: `"${data.slug}" is reserved for the blog category page. Choose another slug.`,
              },
            ],
          })
        }
        return data
      },
    ],
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
    localizedSlugField('title'),
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
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: BLOG_CATEGORIES.map((value) => ({
        label: BLOG_CATEGORY_LABELS[value],
        value,
      })),
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
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: metaFields,
    },
  ],
}
