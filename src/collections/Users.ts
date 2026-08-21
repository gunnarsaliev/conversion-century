import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Allow public signup: anyone (including logged-out users) can create
    // a new account via POST /api/users. All other operations keep
    // Payload's default access (admin-only).
    create: () => true,
  },
  fields: [],
}
