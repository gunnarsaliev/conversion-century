import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

// CSV can't express a hasMany relationship as a native array, so we
// serialize it to a single `;`-separated column of related IDs on export,
// and split that column back into an array of IDs on import.
// (Hook types aren't exported from @payloadcms/plugin-import-export's
// public entry point, so these are left untyped like `custom` config.)
const hasManyRelationshipBeforeExport = ({ value }: { value: unknown }) => {
  if (Array.isArray(value)) {
    return value
      .map((v) => (v && typeof v === 'object' && 'id' in v ? v.id : v))
      .join(';')
  }
  return value
}

const hasManyRelationshipBeforeImport = ({
  value,
  format,
}: {
  value: unknown
  format: string
}) => {
  if (format === 'csv' && typeof value === 'string') {
    return value
      .split(';')
      .map((id) => id.trim())
      .filter(Boolean)
  }
  return value
}

// The import CSV plugin's field-level hooks have no access to `req`/
// `payload`, so they can't look up a user by email — they only reshape
// the raw cell value. Real-world import spreadsheets identify people by
// email, not by opaque Payload IDs, so this collection-level hook runs at
// save time (import included, since import ultimately calls
// payload.create) and resolves any email string(s) on `Account Manager` /
// `Publisher` into the matching user ID(s). Values that already look like
// IDs (not containing "@") are left untouched, so the field keeps working
// normally from the admin UI relationship picker.
const resolveAccountManagerAndPublisherEmails: CollectionBeforeValidateHook = async ({
  data,
  req,
}) => {
  if (!data) return data

  const emailToId = new Map<string, string | number>()

  const collectEmails = (value: unknown) => {
    if (typeof value === 'string' && value.includes('@')) return [value]
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string' && v.includes('@'))
    }
    return []
  }

  const emails = [
    ...collectEmails(data['Account Manager']),
    ...collectEmails(data['Publisher']),
  ]

  if (emails.length === 0) return data

  const uniqueEmails = [...new Set(emails)]
  const found = await req.payload.find({
    collection: 'users',
    where: { email: { in: uniqueEmails } },
    limit: uniqueEmails.length,
    depth: 0,
  })
  for (const user of found.docs) {
    if (user.email) emailToId.set(user.email, user.id)
  }

  const resolveOne = (value: unknown) => {
    if (typeof value === 'string' && value.includes('@')) {
      return emailToId.get(value) ?? value
    }
    return value
  }

  const resolveMany = (value: unknown) => {
    if (Array.isArray(value)) return value.map(resolveOne)
    return resolveOne(value)
  }

  if ('Account Manager' in data) {
    data['Account Manager'] = resolveOne(data['Account Manager'])
  }
  if ('Publisher' in data) {
    data['Publisher'] = resolveMany(data['Publisher'])
  }

  return data
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'companyName',
  },
  hooks: {
    beforeValidate: [resolveAccountManagerAndPublisherEmails],
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
      name: 'Link Building Docs',
      type: 'text',
    },
    {
      name: 'Blog Docs',
      type: 'text',
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
      custom: {
        'plugin-import-export': {
          hooks: {
            beforeExport: hasManyRelationshipBeforeExport,
            beforeImport: hasManyRelationshipBeforeImport,
          },
        },
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      custom: {
        'plugin-import-export': {
          hooks: {
            beforeExport: hasManyRelationshipBeforeExport,
            beforeImport: hasManyRelationshipBeforeImport,
          },
        },
      },
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
