import type { CollectionConfig } from 'payload'
import { adminOrEditor } from '../lib/roles'
import { SEO_PAGE_KEYS } from '../lib/seo/page-keys'

// Meta title/description overrides for pages with no collection behind them
// (the static listing pages and docs pages), edited from Dashboard → SEO →
// Meta data. One doc per page; an empty field falls back to the default in
// messages/<locale>.json → Metadata (see lib/seo/pages). Collection detail
// pages keep using their own `meta` group.
export const PageMeta: CollectionConfig = {
  slug: 'page-meta',
  labels: { singular: 'Page meta', plural: 'Page meta' },
  admin: {
    useAsTitle: 'page',
    defaultColumns: ['page', 'title', 'updatedAt'],
  },
  access: {
    read: adminOrEditor,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      unique: true,
      options: SEO_PAGE_KEYS.map((key) => ({ label: key, value: key })),
    },
    { name: 'title', label: 'Meta title', type: 'text', localized: true },
    {
      name: 'description',
      label: 'Meta description',
      type: 'textarea',
      localized: true,
    },
  ],
}
