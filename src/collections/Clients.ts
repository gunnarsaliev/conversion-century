import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'companyName',
  },
  access: {
    // Internal CRM data — only admins may read or write client records.
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactName',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'websiteLinks',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'websiteLoginLinks',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'reportUrls',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'lead',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'Account Manager',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name: 'Publisher',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'checklistProgress',
      type: 'join',
      collection: 'client-checklist-progress',
      on: 'client',
      admin: {
        defaultColumns: ['checklistItem', 'status', 'completedAt'],
      },
    },
  ],
}
