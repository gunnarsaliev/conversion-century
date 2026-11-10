"use server";

import type { ClientSessionState, SessionStreamEvent } from "eve/client";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

// ---------------------------------------------------------------------------
// AI search chat history (Server Actions, Payload local API)
// ---------------------------------------------------------------------------
//
// The user always comes from the request headers, never the client, and every
// call runs with overrideAccess: false so the `ai-chats` access rules apply:
// a user only ever reads or changes their own chats (admins can browse all
// of them in /admin, not here).

export type ChatSummary = { id: number; title: string; lastMessageAt: string | null };

export type SavedChat = {
  id: number;
  title: string;
  session: ClientSessionState | null;
  events: SessionStreamEvent[];
};

async function getSignedInUser() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  return { payload, user };
}

const TITLE_LENGTH = 60;

const toTitle = (text: string) => {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > TITLE_LENGTH
    ? `${oneLine.slice(0, TITLE_LENGTH - 1).trimEnd()}…`
    : oneLine || "Untitled";
};

/** The signed-in user's own chats, newest first (admins included: only their own). */
export async function listMyChats(limit = 30): Promise<ChatSummary[]> {
  const { payload, user } = await getSignedInUser();
  if (!user) return [];

  const { docs } = await payload.find({
    collection: "ai-chats",
    where: { owner: { equals: user.id } },
    select: { title: true, lastMessageAt: true },
    sort: "-lastMessageAt",
    limit,
    depth: 0,
    overrideAccess: false,
    user,
  });
  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    lastMessageAt: doc.lastMessageAt ?? null,
  }));
}

/** One of the signed-in user's chats, or null if it doesn't exist or isn't theirs. */
export async function getChat(id: number): Promise<SavedChat | null> {
  const { payload, user } = await getSignedInUser();
  if (!user || !Number.isInteger(id)) return null;

  const { docs } = await payload.find({
    collection: "ai-chats",
    // Own chats only, even for admins: the dashboard is a personal view.
    where: { and: [{ id: { equals: id } }, { owner: { equals: user.id } }] },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  });
  const doc = docs[0];
  if (!doc) return null;

  return {
    id: doc.id,
    title: doc.title,
    session: (doc.session as ClientSessionState | null) ?? null,
    events: Array.isArray(doc.events) ? (doc.events as SessionStreamEvent[]) : [],
  };
}

/** Records a new chat as soon as eve creates its session. */
export async function createChat(input: {
  sessionId: string;
  firstMessage: string;
}): Promise<number | null> {
  const { payload, user } = await getSignedInUser();
  if (!user || !input.sessionId) return null;

  const doc = await payload.create({
    collection: "ai-chats",
    data: {
      title: toTitle(input.firstMessage),
      sessionId: input.sessionId,
      // Set again by the collection's beforeChange hook from req.user.
      owner: user.id,
      lastMessageAt: new Date().toISOString(),
    },
    overrideAccess: false,
    user,
  });
  return doc.id;
}

/** Stores the conversation after each finished turn. */
export async function saveChat(
  id: number,
  input: { session: ClientSessionState | null; events: readonly SessionStreamEvent[] },
): Promise<void> {
  const { payload, user } = await getSignedInUser();
  if (!user) throw new Error("Not signed in");

  await payload.update({
    collection: "ai-chats",
    id,
    data: {
      // JSON fields: plain, serialisable values straight from the eve client.
      session: input.session ? { ...input.session } : null,
      events: [...input.events],
      lastMessageAt: new Date().toISOString(),
    },
    overrideAccess: false,
    user,
  });
}

export async function deleteChat(id: number): Promise<void> {
  const { payload, user } = await getSignedInUser();
  if (!user) throw new Error("Not signed in");

  await payload.delete({ collection: "ai-chats", id, overrideAccess: false, user });
}
