import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
import { adminOrEditor } from '../lib/roles'
import {
  REDIRECT_STATUS_CODES,
  normalizeRedirectPath,
  normalizeRedirectTarget,
  redirectRuleError,
} from '../lib/seo/redirects'

// URL redirects managed from Dashboard → SEO → Redirects and applied by
// src/proxy.ts (via the public GET /api/seo-redirects list). `from` is a
// site path without locale prefix; `to` is a path or an absolute URL.
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'statusCode', 'enabled', 'updatedAt'],
  },
  access: {
    read: adminOrEditor,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (typeof data.from === 'string') data.from = normalizeRedirectPath(data.from)
        if (typeof data.to === 'string') data.to = normalizeRedirectTarget(data.to)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Old path, e.g. /old-page (matches with or without /bg).' },
      validate: ((value, { data }) => {
        const error = redirectRuleError(value ?? '', String((data as { to?: unknown })?.to ?? ''))
        return error && error !== 'toRequired' ? error : true
      }) satisfies TextFieldSingleValidation,
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'New path (/new-page) or full URL (https://…).' },
    },
    {
      name: 'statusCode',
      label: 'Type',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: REDIRECT_STATUS_CODES.map((code) => ({
        label: code === '301' ? '301 (permanent)' : '302 (temporary)',
        value: code,
      })),
    },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
  ],
}
