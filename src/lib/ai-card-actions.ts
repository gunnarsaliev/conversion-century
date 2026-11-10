"use server";

import { getPayload } from "payload";
import config from "@payload-config";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { primaryContactName } from "@/lib/primary-contact";

// ---------------------------------------------------------------------------
// Data for the AI search's cards (src/components/dashboard/ai-search-cards.tsx)
// ---------------------------------------------------------------------------
//
// The agent's card tools pass only record ids; the card loads the record here
// with the signed-in user's session, like every dashboard page does, so it
// always shows real, current data and never anything the dashboard wouldn't.

export type ConsultationCardData = {
  id: number;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  message?: string;
  createdAt: string;
};

const MAX_CARDS = 10;

export async function getConsultationCards(ids: number[]): Promise<ConsultationCardData[]> {
  const user = await getDashboardUser();
  if (!user) return [];

  const wanted = [...new Set(ids)].filter((id) => Number.isInteger(id) && id > 0).slice(0, MAX_CARDS);
  if (wanted.length === 0) return [];

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "clients",
    where: { and: [{ id: { in: wanted } }, { status: { equals: "consultation" } }] },
    select: {
      companyName: true,
      primaryContact: true,
      email: true,
      phone: true,
      websiteLinks: true,
      notes: true,
      createdAt: true,
    },
    populate: { contacts: { name: true } },
    // 1 so the primary contact's name is populated.
    depth: 1,
    limit: MAX_CARDS,
    pagination: false,
  });

  // Keep the agent's order (most relevant first).
  const byId = new Map(docs.map((doc) => [doc.id, doc]));
  return wanted.flatMap((id) => {
    const doc = byId.get(id);
    if (!doc) return [];
    return [
      {
        id: doc.id,
        companyName: doc.companyName,
        contactName: primaryContactName(doc) ?? undefined,
        email: doc.email ?? undefined,
        phone: doc.phone ?? undefined,
        website: doc.websiteLinks?.find((link) => link.url)?.url ?? undefined,
        message: doc.notes ?? undefined,
        createdAt: doc.createdAt,
      },
    ];
  });
}
