import type { CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/roles'

export const ClientChecklistProgress: CollectionConfig = {
  slug: 'client-checklist-progress',
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
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
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
