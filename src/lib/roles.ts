import type { ClientUser } from 'payload'

// User roles:
// - admin:  full access to everything.
// - editor: may log into /admin and manage content (Media, Blog, Events,
//           Testimonials). Every other collection is read-only for editors
//           and hidden from their admin sidebar (see `adminOnlyCollection`).
// - user:   dashboard only, no /admin.

// `req.user` is a team member (`users`) or, for requests to the MCP server
// (src/lib/mcp-plugin.ts), an MCP API key, which has no role — so these
// accept any user object and treat a missing role as "no role".
type MaybeUser = object | null | undefined
type AccessArgs = { req: { user?: MaybeUser } }

const roleOf = (user: MaybeUser) =>
  user && 'role' in user ? (user as { role?: unknown }).role : undefined

export const isAdmin = <T extends object>(user?: T | null): user is T =>
  roleOf(user) === 'admin'

export const isEditor = <T extends object>(user?: T | null): user is T =>
  roleOf(user) === 'editor'

export const isAdminOrEditor = <T extends object>(user?: T | null): user is T =>
  isAdmin(user) || isEditor(user)

// Access functions, for use directly in a collection's `access` config.
export const adminOnly = ({ req: { user } }: AccessArgs) => isAdmin(user)
export const adminOrEditor = ({ req: { user } }: AccessArgs) => isAdminOrEditor(user)

// `admin.hidden` for collections editors may read but not manage: removes
// them from the editor's sidebar and admin routes.
export const hiddenFromEditors = ({ user }: { user: ClientUser }) =>
  isEditor(user)

// Shared config for collections that only admins manage: writes are
// admin-only and the collection is hidden from editors. Spread into a
// collection's `admin` / `access` and keep its own `read` rule.
export const adminOnlyCollection = {
  admin: { hidden: hiddenFromEditors },
  access: { create: adminOnly, update: adminOnly, delete: adminOnly },
}
