import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'

import { adminOrEditor } from '../lib/roles'
import type { Testimonial } from '../../payload-types'

const relationId = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value
    ? (value as { id: number }).id
    : (value as number | null | undefined)

// Keeps `title` (the admin list title) in sync with whoever wrote it: the
// linked contact once there is one, otherwise the submitted name.
const setTitle: CollectionBeforeChangeHook<Testimonial> = async ({ data, req }) => {
  const contactId = relationId(data.contact)
  if (contactId) {
    const contact = await req.payload.findByID({
      collection: 'contacts',
      id: contactId,
      depth: 0,
      req,
    })
    data.title = contact.name
  } else {
    data.title = data.submittedBy?.name || 'Testimonial'
  }
  return data
}

// Submissions from /testimonials/new arrive as `pending` with the
// person's details in `submittedBy`. When an admin switches one to
// `approved`, link it to a real client and contact: the chosen existing
// client (or a new client created as a Lead), and the contact on that client
// with the submitted email (or a new one). Runs in the same transaction as
// the save (`req`).
const applyApprovedTestimonial: CollectionAfterChangeHook<Testimonial> = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context.skipApproval) return doc
  if (doc.status !== 'approved' || previousDoc?.status === 'approved') return doc
  if (relationId(doc.contact)) return doc

  const submitted = doc.submittedBy
  if (!submitted?.name) return doc

  let clientId = relationId(doc.client)

  if (!clientId && doc.clientType === 'new' && doc.newClient?.companyName) {
    const client = await req.payload.create({
      collection: 'clients',
      data: {
        companyName: doc.newClient.companyName,
        email: submitted.email ?? undefined,
        logo: relationId(doc.newClient.logo) ?? undefined,
        websiteLinks: doc.newClient.website ? [{ url: doc.newClient.website }] : [],
        status: 'lead',
      },
      req,
    })
    clientId = client.id
  }

  if (!clientId) return doc

  const { docs: matches } = submitted.email
    ? await req.payload.find({
        collection: 'contacts',
        where: {
          client: { equals: clientId },
          email: { equals: submitted.email },
        },
        limit: 1,
        depth: 0,
        req,
      })
    : { docs: [] }

  const contact =
    matches[0] ??
    (await req.payload.create({
      collection: 'contacts',
      data: {
        name: submitted.name,
        role: submitted.role ?? undefined,
        email: submitted.email ?? undefined,
        profileImage: relationId(submitted.profileImage) ?? undefined,
        client: clientId,
        status: 'active',
      },
      req,
    }))

  const client = await req.payload.findByID({
    collection: 'clients',
    id: clientId,
    depth: 0,
    req,
  })
  if (!client.primaryContact) {
    await req.payload.update({
      collection: 'clients',
      id: clientId,
      data: { primaryContact: contact.id },
      req,
    })
  }

  await req.payload.update({
    collection: 'testimonials',
    id: doc.id,
    data: { client: clientId, contact: contact.id },
    context: { skipApproval: true },
    req,
  })
  return { ...doc, client: clientId, contact: contact.id }
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'featured', 'createdAt'],
    description:
      'Submitted from /testimonials/new. Approving one links it to the client and contact (creating them if needed). Approved testimonials are shown on the website.',
  },
  // The public form writes through the local API (server action), so no one
  // needs REST/GraphQL access except admins.
  access: {
    create: adminOrEditor,
    read: adminOrEditor,
    update: adminOrEditor,
    delete: adminOrEditor,
  },
  hooks: {
    beforeChange: [setTitle],
    afterChange: [applyApprovedTestimonial],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'testimonial',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on the homepage, service/solution pages and the consultation page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers show first among featured testimonials.',
        condition: (data) => Boolean(data?.featured),
      },
    },
    {
      name: 'clientType',
      label: 'Client',
      type: 'select',
      required: true,
      defaultValue: 'existing',
      options: [
        { label: 'Existing client', value: 'existing' },
        { label: 'New client', value: 'new' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        position: 'sidebar',
        condition: (data) => data?.clientType === 'existing' || Boolean(data?.client),
      },
      validate: (
        value: unknown,
        { data }: { data: Partial<Testimonial> },
      ) =>
        data?.clientType === 'existing' && !value ? 'Choose the client.' : true,
    },
    {
      name: 'contact',
      type: 'relationship',
      relationTo: 'contacts',
      admin: {
        position: 'sidebar',
        description: 'Set automatically on approval from the submitted details.',
      },
      filterOptions: ({ data }) => {
        const clientId = relationId(data?.client)
        return clientId ? { client: { equals: clientId } } : true
      },
    },
    {
      name: 'submittedBy',
      label: 'Submitted by',
      type: 'group',
      admin: {
        description: 'What the person entered on the public form.',
        condition: (data) => Boolean(data?.submittedBy?.name),
        readOnly: true,
      },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'role', label: 'Role / job title', type: 'text' },
        {
          name: 'profileImage',
          label: 'Profile photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'newClient',
      label: 'New client details',
      type: 'group',
      admin: {
        condition: (data) => data?.clientType === 'new',
      },
      fields: [
        {
          name: 'companyName',
          type: 'text',
          validate: (
            value: unknown,
            { data }: { data: Partial<Testimonial> },
          ) =>
            data?.clientType === 'new' && !value ? 'Company name is required.' : true,
        },
        {
          name: 'website',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
