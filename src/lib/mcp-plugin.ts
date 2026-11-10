import { mcpPlugin } from '@payloadcms/plugin-mcp'
import type { CollectionSlug } from 'payload'

import { adminOnly, isAdmin } from './roles'

// ---------------------------------------------------------------------------
// Payload MCP server (POST /api/mcp) — read-only, for the dashboard AI search
// ---------------------------------------------------------------------------
//
// The eve agent in agent/ connects here with an API key (env
// PAYLOAD_MCP_API_KEY) owned by a dedicated editor-role user. Only `find` is
// enabled, so the plugin never registers create/update/delete tools, and the
// key's user must also have `find` ticked per collection in /admin → MCP →
// API Keys. Queries run with overrideAccess: false, so that user's read rules
// apply (editor: everything below is readable).
//
// Not exposed: media, documents, notifications, job-applicants (applicant
// PII) and the import/export collections.

const collections: Record<string, string> = {
  // Clients pipeline
  clients:
    'Clients, leads and consultations (one collection; `status` says which: consultation → lead → active client …).',
  contacts: 'People at client companies (name, email, phone, role), linked from clients.',
  'work-checklist': 'Checklist item templates for client work.',
  'client-checklist-progress': "Each client's progress on checklist items.",
  // Offers & services
  offers: 'Commercial offers sent to clients/leads (status: draft, sent, accepted, declined).',
  services: 'Services and prices (the pricelist).',
  // Team
  users: 'Team members: names, job titles, roles, status, birthdays and work anniversaries.',
  // Website content
  blog: 'Blog posts on the public website.',
  'case-studies': 'Case studies on the public website.',
  solutions: 'Solution pages on the public website.',
  industries: 'Industry pages on the public website.',
  testimonials: 'Client testimonials.',
  events: 'Events and media appearances.',
  'job-listings': 'Open job positions.',
  'page-meta': 'SEO meta titles/descriptions per page.',
  redirects: 'SEO URL redirects.',
}

export const payloadMcpPlugin = mcpPlugin({
  collections: Object.fromEntries(
    Object.entries(collections).map(([slug, description]) => [
      slug as CollectionSlug,
      { description, enabled: { find: true } },
    ]),
  ),
  mcp: {
    serverOptions: {
      serverInfo: { name: 'conversion-century-cms', version: '1.0.0' },
    },
  },
  // The eve agent sends its key in `X-Payload-MCP-Key`: eve manages the
  // `Authorization` header of MCP connections itself, which mangled the
  // Bearer key. Other clients (curl, Claude Code) can still use
  // `Authorization: Bearer <key>`.
  overrideAuth: (req, getDefaultMcpAccessSettings) =>
    getDefaultMcpAccessSettings(req.headers.get('x-payload-mcp-key') ?? undefined),
  // Only admins manage API keys (the plugin's default lets any signed-in
  // user create keys for themselves).
  overrideApiKeyCollection: (collection) => ({
    ...collection,
    admin: { ...collection.admin, hidden: ({ user }) => !isAdmin(user) },
    access: {
      ...collection.access,
      create: adminOnly,
      read: adminOnly,
      update: adminOnly,
      delete: adminOnly,
      unlock: adminOnly,
    },
  }),
})
