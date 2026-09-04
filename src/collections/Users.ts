import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Public signup is disabled — accounts are created by admins only
    // (via /admin or the API while authenticated as an admin).
    create: ({ req: { user } }) => user?.role === 'admin',
    // Any authenticated user may read user records. There is no
    // self-vs-others distinction yet, so this is intentionally
    // permissive-if-logged-in rather than restricted to "self" (known
    // limitation, not a bug).
    read: ({ req: { user } }) => Boolean(user),
    // Only admins may update user records (including roles) — this
    // prevents a public signup from granting itself the admin role via
    // the API.
    update: ({ req: { user } }) => Boolean(user) && user?.role === 'admin',
    // Only admins may delete user records via the API.
    delete: ({ req: { user } }) => user?.role === 'admin',
    // Only accounts with the 'admin' role may log into /admin. Without
    // this, every signed-up user would be a full Payload admin, because
    // this collection (slug "users") is the implicit admin user
    // collection.
    admin: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'jobTitle',
      type: 'text',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      // Only admins may set/change this field — enforced at the field
      // level so it also applies to updates that pass the collection's
      // `update` access check (e.g. an admin editing another user).
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
