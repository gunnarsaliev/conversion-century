import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import type { Offer, OfferContact } from "@/types/offer";
import type { Offer as OfferDoc, User } from "../../payload-types";
import { metricsSourceOptions } from "@/collections/Offers";

// Reads client offers from the `offers` collection and maps them onto the
// `Offer` shape the offer components and PDF were built against.
// Offers are written in Bulgarian, so related docs (service name) are read
// in the `bg` locale. Wrapped in React `cache` so the page, its metadata and
// sections share one query per request.

const OFFER_LOCALE = "bg";

const userName = (user: number | User | null | undefined) =>
  typeof user === "object" && user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : undefined;

// The person who prepared the offer, shown under "Контакт".
const userContact = (user: number | User | null | undefined): OfferContact | undefined =>
  typeof user === "object" && user
    ? {
        name: userName(user) ?? user.email,
        role: user.jobTitle ?? undefined,
        email: user.email,
        avatar:
          typeof user.profileImage === "object" ? (user.profileImage?.url ?? undefined) : undefined,
      }
    : undefined;

// Package hours and price come from the collection's virtual fields
// (fixed price, or Σ hours × each service's hourly rate).
function toOffer(doc: OfferDoc): Offer {
  const client = typeof doc.client === "object" ? doc.client : null;
  const lines = doc.services ?? [];
  // The offer's services are the ones it has hours for.
  const services = [
    ...new Set(
      lines.flatMap((line) => (typeof line.service === "object" ? [line.service.name] : [])),
    ),
  ];
  // The technical brief: each service's Includes items, under its name.
  const seen = new Set<number>();
  const technicalGroups = lines.flatMap(({ service }) => {
    if (typeof service !== "object" || seen.has(service.id)) return [];
    seen.add(service.id);
    const items = (service.includes?.items ?? []).map(({ title, paragraphs }) => ({
      label: title,
      text: paragraphs ?? "",
    }));
    return items.length > 0 ? [{ title: service.name, items }] : [];
  });
  const logo = client && typeof client.logo === "object" ? client.logo : null;
  if (lines.length > 0 && typeof doc.price !== "number") {
    console.warn(
      `Offer ${doc.id}: no price (set the services' hourly rates, or a fixed price).`,
    );
  }

  return {
    id: String(doc.id),
    client: {
      slug: String(client?.id ?? ""),
      name: client?.companyName ?? "",
      logo: logo?.url ?? "",
      url: client?.websiteLinks?.[0]?.url ?? "",
    },
    service: services.join(", "),
    services,
    preparedBy: userName(doc.preparedBy),
    contact: userContact(doc.preparedBy),
    // Not stored per offer; headings read without it.
    siteType: "",
    date: doc.date,
    validUntil: doc.validUntil,
    metrics: {
      source:
        metricsSourceOptions.find((option) => option.value === doc.metrics?.source)?.label ?? "",
      date: doc.metrics?.date ?? doc.date,
      domainRating: doc.metrics?.domainRating ?? 0,
      backlinks: doc.metrics?.backlinks ?? 0,
      organicKeywords: doc.metrics?.organicKeywords ?? 0,
      organicTraffic: doc.metrics?.organicTraffic ?? 0,
    },
    keywords: (doc.keywords ?? []).map(({ keyword, position, volume }) => ({
      keyword,
      position,
      volume,
    })),
    // Not stored per offer; only the older /website/offer sections use them.
    startLabel: "",
    timeline: [],
    responsibilities: "",
    pageTypes: [],
    competitors: [],
    includeLocalization: true,
    content: { blogArticles: 0, categoryPages: 0, brandPages: 0 },
    scopeSummary: [],
    supportWeeks: 0,
    // The offer as one package; none until it has service hours or a fixed price.
    packages:
      lines.length > 0 || typeof doc.fixedPrice === "number"
        ? [
            {
              name: "",
              hours: doc.hours ?? undefined,
              lines: lines.map((line) => ({
                service: typeof line.service === "object" ? line.service.name : "",
                hours: line.hours,
              })),
              price: doc.price ?? 0,
              currency: "EUR",
              includesContent: true,
              recommended: true,
              features: [],
              description: doc.description ?? null,
            },
          ]
        : [],
    teamUserIds: [],
    technicalGroups,
  };
}

// One offer by its numeric id, or null when the id is invalid or unknown.
export const getOffer = cache(async (id: string): Promise<Offer | null> => {
  if (!/^\d+$/.test(id)) return null;
  const payload = await getPayload({ config });
  const doc = await payload
    .findByID({
      collection: "offers",
      id: Number(id),
      locale: OFFER_LOCALE,
      // 2 so the client's logo media doc is populated (its `url` is built by
      // the storage adapter).
      depth: 2,
    })
    .catch(() => null);
  return doc ? toOffer(doc) : null;
});

export type OfferListItem = {
  id: number;
  status: OfferDoc["status"];
  offer: Offer;
};

// Every offer, newest first, for the /website/offers index.
export const getOffers = cache(async (): Promise<OfferListItem[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "offers",
    locale: OFFER_LOCALE,
    sort: "-date",
    depth: 2,
    limit: 100,
  });
  return docs.map((doc) => ({
    id: doc.id,
    status: doc.status,
    offer: toOffer(doc),
  }));
});
