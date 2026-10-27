import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { adminOnlyCollection } from '../lib/roles'
import { assignChecklistItems, relationId } from '../lib/client-checklist'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// A new item (or one moved to another service) is assigned to every client
// that already has the service. Rows under a previous service are kept, since
// they may already have progress.
const assignToServiceClients: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const serviceId = relationId(doc.service)
  if (!serviceId || serviceId === relationId(previousDoc?.service)) return doc

  const clients = await req.payload.find({
    collection: 'clients',
    where: { services: { contains: serviceId } },
    pagination: false,
    depth: 0,
    select: {},
    req,
  })

  await assignChecklistItems({
    req,
    clientIds: clients.docs.map((client) => client.id),
    serviceIds: [serviceId],
  })

  return doc
}

export const ChecklistItems: CollectionConfig = {
  slug: 'work-checklist',
  labels: { singular: 'Checklist Item', plural: 'Checklist Items' },
  hooks: {
    afterChange: [assignToServiceClients],
  },
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'name',
  },
  access: {
    ...adminOnlyCollection.access,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
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
      name: 'clientUsage',
      type: 'join',
      collection: 'client-checklist-progress',
      on: 'checklistItem',
      admin: {
        defaultColumns: ['client', 'status'],
      },
    },
  ],
}
