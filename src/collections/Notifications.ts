import type { CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/roles'

// Dashboard notifications shown under the bell (see lib/notifications).
// Written only through the local API: by the Book a Consultation server
// action, the Offers afterChange hook and the daily notifyContractRenewals
// task. Every signed-in user reads the same feed; `readBy` tracks who has
// seen each one. Title/message are copied in at creation time so plain users
// never need read access to the Clients record behind them.

export const notificationTypeOptions = [
  { label: 'Consultation request', value: 'consultation' },
  { label: 'Contract renewal', value: 'contract-renewal' },
  { label: 'Offer accepted', value: 'offer-accepted' },
] as const

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    ...adminOnlyCollection.access,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [...notificationTypeOptions],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'text' },
    {
      name: 'href',
      label: 'Link',
      type: 'text',
      admin: { description: 'Dashboard path the notification opens, e.g. /dashboard/leads/12.' },
    },
    {
      // One notification per occurrence, e.g. "contract-renewal-12-2026-10-21",
      // so the daily task can re-run without duplicating.
      name: 'dedupeKey',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'readBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
  ],
}
