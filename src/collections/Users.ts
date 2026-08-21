import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Allow public signup: anyone (including logged-out users) can create
    // a new account via POST /api/users.
    create: () => true,
    // Any authenticated user may read/update user records. There is no
    // roles concept yet, so this is intentionally permissive-if-logged-in
    // rather than restricted to "self" (known limitation, not a bug).
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    // No one may delete user records via the API.
    delete: () => false,
    // Public signups must never be able to log into /admin. Without this,
    // every signed-up user is a full Payload admin because this collection
    // (slug "users") is the implicit admin user collection.
    admin: () => false,
  },
  fields: [],
}
