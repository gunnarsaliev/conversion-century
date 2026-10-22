import type { CollectionConfig } from 'payload'
import { adminOnlyCollection, adminOrEditor } from '../lib/roles'

// People at a client company. A client can have several; one of them is the
// client's `primaryContact`. Testimonials link to the contact who wrote them.
export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'client', 'status'],
  },
  // Same as Clients: admins write, admins and editors read.
  access: {
    ...adminOnlyCollection.access,
    read: adminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Role / job title',
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
      name: 'profileImage',
      label: 'Profile image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Photo of the person, e.g. shown next to their testimonial.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'testimonials',
      type: 'join',
      collection: 'testimonials',
      on: 'contact',
    },
  ],
}
