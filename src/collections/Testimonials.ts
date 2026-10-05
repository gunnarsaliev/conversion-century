import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { plainTextToLexical } from '../lib/plain-text-to-lexical'
import type { Client, Testimonial } from '../../payload-types'

const relationId = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value
    ? (value as { id: number }).id
    : (value as number | null | undefined)

// Submissions from /website/testimonials/new arrive as `pending`. When an
// admin switches one to `approved`, copy it onto the client record: update
// the chosen existing client, or create the new client (as a Lead) and link
// it back. Runs in the same transaction as the save (`req`).
const applyApprovedTestimonial: CollectionAfterChangeHook<Testimonial> = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context.skipApproval) return doc
  if (doc.status !== 'approved' || previousDoc?.status === 'approved') return doc

  const clientData: Partial<Client> = {
    contactName: doc.name,
    testimonial: plainTextToLexical(doc.testimonial) as Client['testimonial'],
    profileImage: relationId(doc.profileImage) ?? undefined,
  }

  const existingClientId = relationId(doc.client)

  if (doc.clientType === 'existing' && existingClientId) {
    await req.payload.update({
      collection: 'clients',
      id: existingClientId,
      data: clientData,
      req,
    })
    return doc
  }

  if (doc.clientType === 'new' && doc.newClient?.companyName) {
    const client = await req.payload.create({
      collection: 'clients',
      data: {
        ...clientData,
        companyName: doc.newClient.companyName,
        contactRole: doc.newClient.role ?? undefined,
        email: doc.email,
        logo: relationId(doc.newClient.logo) ?? undefined,
        websiteLinks: doc.newClient.website ? [{ url: doc.newClient.website }] : [],
        status: 'lead',
      },
      req,
    })

    await req.payload.update({
      collection: 'testimonials',
      id: doc.id,
      data: { client: client.id },
      context: { skipApproval: true },
      req,
    })
    return { ...doc, client: client.id }
  }

  return doc
}

const isAdmin = ({ req: { user } }: { req: { user?: { role?: string | null } | null } }) =>
  user?.role === 'admin'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'client', 'clientType', 'status', 'createdAt'],
    description:
      'Submitted from /website/testimonials/new. Approving one copies it onto the client (or creates the new client as a Lead).',
  },
  // The public form writes through the local API (server action), so no one
  // needs REST/GraphQL access except admins.
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [applyApprovedTestimonial],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'profileImage',
      label: 'Profile photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'testimonial',
      type: 'textarea',
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
          name: 'role',
          label: 'Role / job title',
          type: 'text',
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
