import type { ClientUser } from 'payload'

// User roles:
// - admin:  full access to everything.
// - editor: may log into /admin and manage content (Media, Blog, Events,
//           Testimonials). Every other collection is read-only for editors
//           and hidden from their admin sidebar (see `adminOnlyCollection`).
// - user:   dashboard only, no /admin.

type RoleUser = { role?: string | null } | null | undefined
type AccessArgs = { req: { user?: RoleUser } }

export const isAdmin = <T extends { role?: string | null }>(user?: T | null): user is T =>
  user?.role === 'admin'

export const isEditor = <T extends { role?: string | null }>(user?: T | null): user is T =>
  user?.role === 'editor'

export const isAdminOrEditor = <T extends { role?: string | null }>(
  user?: T | null,
): user is T => isAdmin(user) || isEditor(user)

// Access functions, for use directly in a collection's `access` config.
export const adminOnly = ({ req: { user } }: AccessArgs) => isAdmin(user)
export const adminOrEditor = ({ req: { user } }: AccessArgs) => isAdminOrEditor(user)

// `admin.hidden` for collections editors may read but not manage: removes
// them from the editor's sidebar and admin routes.
export const hiddenFromEditors = ({ user }: { user: ClientUser }) =>
  isEditor(user as RoleUser)

// Shared config for collections that only admins manage: writes are
// admin-only and the collection is hidden from editors. Spread into a
// collection's `admin` / `access` and keep its own `read` rule.
export const adminOnlyCollection = {
  admin: { hidden: hiddenFromEditors },
  access: { create: adminOnly, update: adminOnly, delete: adminOnly },
}
