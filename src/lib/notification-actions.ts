"use server";

import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { getNotificationsForUser, readerIds, type NotificationFeed } from "@/lib/notifications";

// ---------------------------------------------------------------------------
// Notification actions (Server Actions, Payload local API)
// ---------------------------------------------------------------------------
//
// The user always comes from the request headers, never the client, so a
// user can only read and mark notifications for themselves. Notifications'
// `update` access is admin-only, hence the local API's default
// overrideAccess.

async function getSignedInUser() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  return { payload, user };
}

// Polled by the bell so new notifications (and toasts) show up while the
// dashboard stays open.
export async function fetchNotifications(): Promise<NotificationFeed | null> {
  const { payload, user } = await getSignedInUser();
  if (!user) return null;
  return getNotificationsForUser(payload, user.id);
}

export async function markNotificationRead(id: number): Promise<void> {
  const { payload, user } = await getSignedInUser();
  if (!user) throw new Error("Not signed in");

  const doc = await payload.findByID({
    collection: "notifications",
    id,
    depth: 0,
    select: { readBy: true },
  });
  const readers = readerIds(doc.readBy);
  if (readers.includes(user.id)) return;

  await payload.update({
    collection: "notifications",
    id,
    data: { readBy: [...readers, user.id] },
    depth: 0,
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  const { payload, user } = await getSignedInUser();
  if (!user) throw new Error("Not signed in");

  const { docs } = await payload.find({
    collection: "notifications",
    select: { readBy: true },
    pagination: false,
    depth: 0,
  });

  await Promise.all(
    docs
      .map((doc) => ({ id: doc.id, readers: readerIds(doc.readBy) }))
      .filter(({ readers }) => !readers.includes(user.id))
      .map(({ id, readers }) =>
        payload.update({
          collection: "notifications",
          id,
          data: { readBy: [...readers, user.id] },
          depth: 0,
        }),
      ),
  );
}
