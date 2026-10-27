import type { CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/roles'

export const ClientProgress: CollectionConfig = {
  slug: 'client-checklist-progress',
  labels: { singular: 'Client Progress', plural: 'Client Progress' },
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'id',
    defaultColumns: ['client', 'checklistItem', 'status'],
  },
  access: {
    ...adminOnlyCollection.access,
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hasMany: false,
    },
    {
      name: 'checklistItem',
      type: 'relationship',
      relationTo: 'work-checklist',
      required: true,
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not-started',
      options: [
        { label: 'Not started', value: 'not-started' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Done', value: 'done' },
      ],
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        condition: (_, siblingData) => siblingData.status === 'done',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
