import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const WorkChecklist: CollectionConfig = {
  slug: 'work-checklist',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '301s and 302s', value: '301s-and-302s' },
        { label: '404s', value: '404s' },
        { label: '500s', value: '500s' },
        { label: 'Additional', value: 'additional' },
        { label: 'Breadcrumbs', value: 'breadcrumbs' },
        { label: 'Duplicate pages', value: 'duplicate-pages' },
        { label: 'Force HTTPS', value: 'force-https' },
        { label: 'General', value: 'general' },
        { label: 'Google Analytics and GSC', value: 'google-analytics-and-gsc' },
        { label: 'H1', value: 'h1' },
        { label: 'Images', value: 'images' },
        { label: 'Indexation', value: 'indexation' },
        { label: 'Internal linking', value: 'internal-linking' },
        { label: 'Keywords', value: 'keywords' },
        { label: 'Localized content', value: 'localized-content' },
        { label: 'Meta titles and descriptions', value: 'meta-titles-and-descriptions' },
        { label: 'Navigation', value: 'navigation' },
        { label: 'Page content', value: 'page-content' },
        { label: 'Pagination', value: 'pagination' },
        { label: 'Robots.txt', value: 'robots-txt' },
        { label: 'Schema markup', value: 'schema-markup' },
        { label: 'Site speed', value: 'site-speed' },
        { label: 'URL structure', value: 'url-structure' },
        { label: 'XML sitemap', value: 'xml-sitemap' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      name: 'label',
      type: 'select',
      options: [
        { label: 'Technical', value: 'technical' },
        { label: 'Copyright', value: 'copyright' },
      ],
    },
    {
      name: 'team',
      type: 'select',
      options: [
        { label: 'Content', value: 'content' },
        { label: 'Dev', value: 'dev' },
        { label: 'SEO', value: 'seo' },
      ],
    },
  ],
}
