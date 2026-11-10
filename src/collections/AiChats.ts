import type { Access, CollectionConfig } from 'payload'

import { hiddenFromEditors, isAdmin } from '../lib/roles'

// ---------------------------------------------------------------------------
// AI search chat history (dashboard → AI search, agent/)
// ---------------------------------------------------------------------------
//
// One doc per eve session. eve can't list sessions per user and expires idle
// ones, so we keep our own copy of each conversation's stream events and
// cursor to list it in the sidebar and resume or replay it later.
//
// Private: each user reads and changes only their own chats; admins see
// everyone's here in /admin. Written through src/lib/ai-chat-actions.ts.
// Deliberately not exposed to the MCP server (src/lib/mcp-plugin.ts).

const ownOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  const userId = user.id
  if (isAdmin(user)) return true
  return { owner: { equals: userId } }
}

export const AiChats: CollectionConfig = {
  slug: 'ai-chats',
  labels: { singular: 'AI chat', plural: 'AI chats' },
  admin: {
    hidden: hiddenFromEditors,
    useAsTitle: 'title',
    defaultColumns: ['title', 'owner', 'lastMessageAt'],
    description: "Dashboard AI search conversations. Each user sees only their own.",
  },
  defaultSort: '-lastMessageAt',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ownOrAdmin,
    update: ownOrAdmin,
    delete: ownOrAdmin,
  },
  hooks: {
    beforeChange: [
      // The owner is always the signed-in user creating the chat, never a
      // value from the client, and it never changes afterwards.
      ({ data, operation, originalDoc, req }) => {
        if (operation === 'create') {
          if (req.user) data.owner = req.user.id
        } else if (originalDoc) {
          data.owner =
            typeof originalDoc.owner === 'object' ? originalDoc.owner?.id : originalDoc.owner
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      index: true,
      admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      // eve's resumable session cursor ({ sessionId, streamIndex, inbox? }).
      name: 'session',
      type: 'json',
      admin: { readOnly: true },
    },
    {
      // The session's stream events, replayed by useEveAgent's initialEvents.
      name: 'events',
      type: 'json',
      admin: { readOnly: true },
    },
  ],
}
