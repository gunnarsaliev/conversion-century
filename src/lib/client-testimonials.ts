import type { Payload } from "payload";

import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";

// Hand-picked clients whose testimonial may appear on the public website,
// in display order — not tied to `showOnWebsite` (that flag only governs the
// logo strip).
export const TESTIMONIAL_CLIENT_IDS = [47, 75, 90];

export type ClientTestimonial = {
  company: string;
  quote: string;
  name: string;
  role: string;
  logoUrl?: string;
};

// Testimonial and contact fields are admin-only, so this reads with
// overrideAccess and returns only the fields that are safe to publish.
export async function getClientTestimonials(
  payload: Payload,
): Promise<ClientTestimonial[]> {
  const { docs } = await payload.find({
    collection: "clients",
    where: {
      id: { in: TESTIMONIAL_CLIENT_IDS },
    },
    depth: 1,
    limit: TESTIMONIAL_CLIENT_IDS.length,
    overrideAccess: true,
  });

  return TESTIMONIAL_CLIENT_IDS.map((id): ClientTestimonial | null => {
    const client = docs.find((doc) => doc.id === id);
    if (!client) return null;

    const quote = richTextToPlainText(client.testimonial);
    if (!quote) return null;

    return {
      company: client.companyName,
      quote,
      name: client.contactName || client.companyName,
      role: client.contactRole || client.companyName,
      logoUrl:
        typeof client.logo === "object" && client.logo?.url
          ? client.logo.url
          : undefined,
    };
  }).filter((item): item is ClientTestimonial => item !== null);
}
