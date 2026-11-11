"use server";

import { getPayload } from "payload";
import config from "@payload-config";

import { clientSection } from "@/lib/client-status";
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

export type ClientCardData = {
  id: number;
  companyName: string;
  status: string;
  /** Dashboard section the record lives under (clients, leads). */
  section: string;
  logoUrl?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  accountManagers: string[];
  services: string[];
  contractDate?: string;
  regions: string[];
  industries: string[];
  businessSize?: "small-business" | "midmarket" | "enterprise";
  publishers: string[];
  copywriters: string[];
  /** When the record was created (client since). */
  createdAt: string;
  notes?: string;
  offers: { total: number; accepted: number; pending: number; acceptedValue: number };
  checklist: { done: number; total: number };
};

const userName = (user: unknown) => {
  if (!user || typeof user !== "object") return undefined;
  const { firstName, lastName, email } = user as {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
  return [firstName, lastName].filter(Boolean).join(" ") || email || undefined;
};

export async function getClientCards(ids: number[]): Promise<ClientCardData[]> {
  const user = await getDashboardUser();
  if (!user) return [];

  const wanted = [...new Set(ids)].filter((id) => Number.isInteger(id) && id > 0).slice(0, MAX_CARDS);
  if (wanted.length === 0) return [];

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "clients",
    // Consultations have their own card (getConsultationCards).
    where: { and: [{ id: { in: wanted } }, { status: { not_equals: "consultation" } }] },
    select: {
      companyName: true,
      status: true,
      logo: true,
      primaryContact: true,
      email: true,
      phone: true,
      websiteLinks: true,
      "Account Manager": true,
      services: true,
      contractDate: true,
      region: true,
      industries: true,
      businessSize: true,
      Publisher: true,
      Copywriter: true,
      notes: true,
      createdAt: true,
    },
    populate: {
      contacts: { name: true },
      users: { firstName: true, lastName: true, email: true },
      services: { name: true },
      industries: { title: true },
      // url/thumbnailURL are built from the filename by the storage plugin, so
      // it must be selected too (without it thumbnailURL ends in "/undefined").
      media: { url: true, thumbnailURL: true, filename: true, sizes: true },
    },
    // 1 so the contact, managers, services and logo are populated.
    depth: 1,
    limit: MAX_CARDS,
    pagination: false,
  });

  const found = docs.map((doc) => doc.id);

  // Offers and checklist progress for these clients, counted per client.
  const [offers, checklist] = found.length
    ? await Promise.all([
        payload.find({
          collection: "offers",
          where: { client: { in: found } },
          // No `select`: `price` is a virtual field computed on read from the
          // fixed price or the services' hours, which a narrow select omits.
          depth: 0,
          limit: 1000,
          pagination: false,
        }),
        payload.find({
          collection: "client-checklist-progress",
          where: { client: { in: found } },
          select: { client: true, status: true },
          depth: 0,
          limit: 5000,
          pagination: false,
        }),
      ])
    : [{ docs: [] }, { docs: [] }];

  const idOf = (value: unknown) =>
    typeof value === "object" && value !== null ? (value as { id: number }).id : (value as number);

  const offerStats = new Map<number, ClientCardData["offers"]>();
  for (const offer of offers.docs) {
    const clientId = idOf(offer.client);
    const stats = offerStats.get(clientId) ?? { total: 0, accepted: 0, pending: 0, acceptedValue: 0 };
    stats.total += 1;
    if (offer.status === "accepted") {
      stats.accepted += 1;
      stats.acceptedValue += offer.price ?? 0;
    }
    if (offer.status === "sent") stats.pending += 1;
    offerStats.set(clientId, stats);
  }

  const checklistStats = new Map<number, ClientCardData["checklist"]>();
  for (const entry of checklist.docs) {
    const clientId = idOf(entry.client);
    const stats = checklistStats.get(clientId) ?? { done: 0, total: 0 };
    stats.total += 1;
    if (entry.status === "done") stats.done += 1;
    checklistStats.set(clientId, stats);
  }

  const names = (users: unknown[] | null | undefined) =>
    (users ?? []).flatMap((user) => {
      const name = userName(user);
      return name ? [name] : [];
    });

  const byId = new Map(docs.map((doc) => [doc.id, doc]));
  return wanted.flatMap((id) => {
    const doc = byId.get(id);
    if (!doc) return [];
    const logo = doc.logo && typeof doc.logo === "object" ? doc.logo : null;
    return [
      {
        id: doc.id,
        companyName: doc.companyName,
        status: doc.status,
        section: clientSection(doc.status),
        logoUrl: logo?.filename ? (logo.thumbnailURL ?? logo.url ?? undefined) : undefined,
        contactName: primaryContactName(doc) ?? undefined,
        email: doc.email ?? undefined,
        phone: doc.phone ?? undefined,
        website: doc.websiteLinks?.find((link) => link.url)?.url ?? undefined,
        accountManagers: names(doc["Account Manager"]),
        services: (doc.services ?? []).flatMap((service) =>
          service && typeof service === "object" && service.name ? [service.name] : [],
        ),
        contractDate: doc.contractDate ?? undefined,
        regions: doc.region ?? [],
        industries: (doc.industries ?? []).flatMap((industry) =>
          industry && typeof industry === "object" && industry.title ? [industry.title] : [],
        ),
        businessSize: doc.businessSize ?? undefined,
        publishers: names(doc.Publisher),
        copywriters: names(doc.Copywriter),
        createdAt: doc.createdAt,
        notes: doc.notes ?? undefined,
        offers: offerStats.get(doc.id) ?? { total: 0, accepted: 0, pending: 0, acceptedValue: 0 },
        checklist: checklistStats.get(doc.id) ?? { done: 0, total: 0 },
      },
    ];
  });
}
