import type { Payload, PayloadRequest } from "payload";

import type { Notification } from "../../payload-types";
import { clientSection } from "./client-status";

// ---------------------------------------------------------------------------
// Dashboard notifications (bell + toasts)
// ---------------------------------------------------------------------------
//
// Notifications are stored in the `notifications` collection and shared by
// every signed-in user; `readBy` records who has seen each one. They are
// created server-side only, by:
//   - the Book a Consultation server action  → "consultation"
//   - the Offers afterChange hook            → "offer-accepted"
//   - the daily notifyContractRenewals task  → "contract-renewal"

type NotificationType = Notification["type"];

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string | null;
  href: string | null;
  createdAt: string;
  read: boolean;
};

type NotificationFeed = {
  items: NotificationItem[];
  unreadCount: number;
};

// How many recent notifications the bell loads (and counts unread among).
const FEED_LIMIT = 30;

// Never throws: a notification must not break the flow that triggered it
// (a form submission, an offer save, a scheduled task).
async function createNotification(
  payload: Payload,
  data: {
    type: NotificationType;
    title: string;
    message?: string;
    href?: string;
    dedupeKey?: string;
  },
  req?: PayloadRequest,
): Promise<boolean> {
  try {
    if (data.dedupeKey) {
      const { totalDocs } = await payload.count({
        collection: "notifications",
        where: { dedupeKey: { equals: data.dedupeKey } },
        req,
      });
      if (totalDocs > 0) return false;
    }

    await payload.create({
      collection: "notifications",
      data: { ...data, readBy: [] },
      req,
    });
    return true;
  } catch (error) {
    console.error("Failed to create notification", data, error);
    return false;
  }
}

async function getNotificationsForUser(
  payload: Payload,
  userId: number,
): Promise<NotificationFeed> {
  const { docs } = await payload.find({
    collection: "notifications",
    sort: "-createdAt",
    limit: FEED_LIMIT,
    depth: 0,
    select: {
      type: true,
      title: true,
      message: true,
      href: true,
      readBy: true,
      createdAt: true,
    },
  });

  const items = docs.map((doc) => ({
    id: doc.id,
    type: doc.type,
    title: doc.title,
    message: doc.message ?? null,
    href: doc.href ?? null,
    createdAt: doc.createdAt,
    read: readerIds(doc.readBy).includes(userId),
  }));

  return { items, unreadCount: items.filter((item) => !item.read).length };
}

// Consultations, leads and clients have separate, status-gated detail pages.
function clientHref(client: { id: number; status?: string | null }) {
  return `/dashboard/${clientSection(client.status)}/${client.id}`;
}

function readerIds(readBy: Notification["readBy"]): number[] {
  return (readBy ?? []).map((reader) => (typeof reader === "object" ? reader.id : reader));
}

export { clientHref, createNotification, getNotificationsForUser, readerIds };
export type { NotificationFeed, NotificationItem, NotificationType };
