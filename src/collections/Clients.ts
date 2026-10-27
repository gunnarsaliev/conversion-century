import type {
  CollectionAfterChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
} from 'payload'
import { documentsField } from '../fields/documentsField'
import { adminOnlyCollection, isAdminOrEditor } from '../lib/roles'
import {
  assignChecklistItems,
  relationIds,
  removeUntouchedChecklistItems,
} from '../lib/client-checklist'

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
// `Publisher` / `Copywriter` into the matching user ID(s). Values that
// already look like IDs (not containing "@") are left untouched, so the
// field keeps working normally from the admin UI relationship picker.
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
    ...collectEmails(data['Copywriter']),
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
    data['Account Manager'] = resolveMany(data['Account Manager'])
  }
  if ('Publisher' in data) {
    data['Publisher'] = resolveMany(data['Publisher'])
  }
  if ('Copywriter' in data) {
    data['Copywriter'] = resolveMany(data['Copywriter'])
  }

  return data
}

// A contact can't exist without its client, so remove them together
// (the database would otherwise refuse to null out `contacts.client_id`).
const deleteClientContacts: CollectionBeforeDeleteHook = async ({ id, req }) => {
  await req.payload.delete({
    collection: 'contacts',
    where: { client: { equals: id } },
    req,
  })
}

// Each service brings its checklist items: adding a service assigns them to
// the client as "not started", removing one drops the rows never started.
const syncClientChecklist: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const current = relationIds(doc.services)
  const previous = relationIds(previousDoc?.services)

  await assignChecklistItems({
    req,
    clientIds: [doc.id],
    serviceIds: current.filter((id) => !previous.includes(id)),
  })
  await removeUntouchedChecklistItems({
    req,
    clientId: doc.id,
    serviceIds: previous.filter((id) => !current.includes(id)),
  })

  return doc
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'companyName',
  },
  hooks: {
    beforeValidate: [resolveAccountManagerAndPublisherEmails],
    afterChange: [syncClientChecklist],
    beforeDelete: [deleteClientContacts],
  },
  access: {
    // Internal CRM data — only admins may write client records,
    // admins and editors may read them. A client explicitly marked
    // `showOnWebsite` is also readable by logged-out visitors, so the
    // public site can pull its name/logo into a trust/logo strip without
    // exposing the rest of the CRM record to anyone else (field-level
    // access below still hides everything but companyName/logo/
    // showOnWebsite from a public request).
    ...adminOnlyCollection.access,
    read: ({ req: { user } }) => {
      if (isAdminOrEditor(user)) return true
      return { showOnWebsite: { equals: true } }
    },
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
      access: {
        read: () => true,
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      access: {
        read: () => true,
      },
    },
    {
      name: 'showOnWebsite',
      label: 'Show logo on public website',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'When checked, this client’s name and logo become publicly readable (e.g. for a homepage trust/logo strip). All other fields on this record stay admin-only.',
      },
      access: {
        read: () => true,
      },
    },
    {
      name: 'primaryContact',
      type: 'relationship',
      relationTo: 'contacts',
      admin: {
        position: 'sidebar',
      },
      // Only this client's own contacts can be primary.
      filterOptions: ({ id }) => (id ? { client: { equals: id } } : false),
    },
    {
      name: 'contacts',
      type: 'join',
      collection: 'contacts',
      on: 'client',
      admin: {
        defaultColumns: ['name', 'role', 'email'],
      },
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
      admin: {
        description:
          'Looker Studio (Data Studio) report links are embedded on the client dashboard page. Make sure the report is shared and embedding is enabled (File → Embed report).',
      },
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
    documentsField,
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'lead',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Consultation', value: 'consultation' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      name: 'contractDate',
      label: 'Contract Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'region',
      label: 'Region',
      type: 'select',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: '🇪🇺 Europe', value: 'EU' },
        { label: '🇦🇱 Albania', value: 'AL' },
        { label: '🇦🇹 Austria', value: 'AT' },
        { label: '🇧🇪 Belgium', value: 'BE' },
        { label: '🇧🇦 Bosnia and Herzegovina', value: 'BA' },
        { label: '🇧🇬 Bulgaria', value: 'BG' },
        { label: '🇭🇷 Croatia', value: 'HR' },
        { label: '🇨🇾 Cyprus', value: 'CY' },
        { label: '🇨🇿 Czech Republic', value: 'CZ' },
        { label: '🇩🇰 Denmark', value: 'DK' },
        { label: '🇪🇪 Estonia', value: 'EE' },
        { label: '🇫🇮 Finland', value: 'FI' },
        { label: '🇫🇷 France', value: 'FR' },
        { label: '🇩🇪 Germany', value: 'DE' },
        { label: '🇬🇷 Greece', value: 'GR' },
        { label: '🇭🇺 Hungary', value: 'HU' },
        { label: '🇮🇪 Ireland', value: 'IE' },
        { label: '🇮🇹 Italy', value: 'IT' },
        { label: '🇱🇻 Latvia', value: 'LV' },
        { label: '🇱🇹 Lithuania', value: 'LT' },
        { label: '🇱🇺 Luxembourg', value: 'LU' },
        { label: '🇲🇹 Malta', value: 'MT' },
        { label: '🇲🇩 Moldova', value: 'MD' },
        { label: '🇲🇪 Montenegro', value: 'ME' },
        { label: '🇳🇱 Netherlands', value: 'NL' },
        { label: '🇲🇰 North Macedonia', value: 'MK' },
        { label: '🇳🇴 Norway', value: 'NO' },
        { label: '🇵🇱 Poland', value: 'PL' },
        { label: '🇵🇹 Portugal', value: 'PT' },
        { label: '🇷🇴 Romania', value: 'RO' },
        { label: '🇷🇸 Serbia', value: 'RS' },
        { label: '🇸🇰 Slovakia', value: 'SK' },
        { label: '🇸🇮 Slovenia', value: 'SI' },
        { label: '🇪🇸 Spain', value: 'ES' },
        { label: '🇸🇪 Sweden', value: 'SE' },
        { label: '🇨🇭 Switzerland', value: 'CH' },
        { label: '🇹🇷 Turkey', value: 'TR' },
        { label: '🇺🇦 Ukraine', value: 'UA' },
        { label: '🇬🇧 United Kingdom', value: 'GB' },
        { label: '🇺🇸 United States', value: 'US' },
        { label: '🏳️ Other', value: 'OTHER' },
      ],
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
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
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
      name: 'Publisher',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
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
      name: 'Copywriter',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
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
      name: 'businessSize',
      label: 'Business size',
      type: 'select',
      options: [
        { label: 'Small business', value: 'small-business' },
        { label: 'Midmarket', value: 'midmarket' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'industries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
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
      name: 'testimonials',
      type: 'join',
      collection: 'testimonials',
      on: 'client',
      admin: {
        defaultColumns: ['title', 'contact', 'status'],
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
