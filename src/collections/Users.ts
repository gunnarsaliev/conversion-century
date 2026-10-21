import type { CollectionConfig } from 'payload'
import { documentsField } from '../fields/documentsField'
import { adminOnly, adminOnlyCollection, adminOrEditor } from '../lib/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    ...adminOnlyCollection.admin,
    useAsTitle: 'email',
  },
  access: {
    // Public signup is disabled — accounts are created by admins only
    // (via /admin or the API while authenticated as an admin).
    create: adminOnly,
    // Any authenticated user may read user records. There is no
    // self-vs-others distinction yet, so this is intentionally
    // permissive-if-logged-in rather than restricted to "self" (known
    // limitation, not a bug).
    read: ({ req: { user } }) => Boolean(user),
    // Only admins may update user records (including roles) — this
    // prevents a public signup from granting itself the admin role via
    // the API.
    update: adminOnly,
    // Only admins may delete user records via the API.
    delete: adminOnly,
    // Only admins and editors may log into /admin. Without
    // this, every signed-up user would be a full Payload admin, because
    // this collection (slug "users") is the implicit admin user
    // collection.
    admin: adminOrEditor,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: false,
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
    },
    {
      name: 'jobTitle',
      type: 'text',
    },
    {
      name: 'about',
      type: 'textarea',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'On leave', value: 'on-leave' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'birthday',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'workBirthday',
      label: 'Work Birthday',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    documentsField,
    {
      // Keys of dashboard banners this user has closed (see
      // lib/banner-dismissal). Written only through the dismissBanner server
      // action, for the signed-in user themselves; readable only by them.
      name: 'dismissedBanners',
      type: 'json',
      defaultValue: [],
      access: {
        read: ({ req: { user }, doc }) => Boolean(user && doc && user.id === doc.id),
      },
      admin: { hidden: true },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      admin: { position: 'sidebar' },
      // Only admins may set/change this field — enforced at the field
      // level so it also applies to updates that pass the collection's
      // `update` access check (e.g. an admin editing another user).
      access: {
        update: adminOnly,
      },
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
