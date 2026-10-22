import type { Payload } from "payload";

import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";
import type { Client, Contact, Media, Testimonial } from "../../payload-types";

export type ClientTestimonial = {
  company: string;
  quote: string;
  name: string;
  role: string;
  logoUrl?: string;
};

export type PublicTestimonial = {
  testimonial: Testimonial["testimonial"];
  client: Client | null;
  contact: Contact | null;
};

const populated = <T extends object>(value: unknown): T | null =>
  value && typeof value === "object" ? (value as T) : null;

export const mediaUrl = (value: unknown) => populated<Media>(value)?.url ?? undefined;

// Testimonials, Clients and Contacts are admin-only, so this reads with
// overrideAccess and keeps only the fields that are safe to publish.
// `featured` limits it to the hand-picked ones, in their set order.
export async function getApprovedTestimonials(
  payload: Payload,
  { featured = false }: { featured?: boolean } = {},
): Promise<PublicTestimonial[]> {
  const { docs } = await payload.find({
    collection: "testimonials",
    where: {
      status: { equals: "approved" },
      ...(featured ? { featured: { equals: true } } : {}),
    },
    sort: featured ? ["order", "-createdAt"] : "-createdAt",
    // 2 levels: testimonial → client/contact → logo/profile image.
    depth: 2,
    limit: 100,
    overrideAccess: true,
    select: { testimonial: true, client: true, contact: true },
    populate: {
      clients: { companyName: true, logo: true, websiteLinks: true },
      contacts: { name: true, role: true, profileImage: true },
    },
  });

  return docs.map((doc) => ({
    testimonial: doc.testimonial,
    client: populated<Client>(doc.client),
    contact: populated<Contact>(doc.contact),
  }));
}

export async function getClientTestimonials(
  payload: Payload,
): Promise<ClientTestimonial[]> {
  const testimonials = await getApprovedTestimonials(payload, { featured: true });

  return testimonials
    .map(({ testimonial, client, contact }): ClientTestimonial | null => {
      const quote = richTextToPlainText(testimonial);
      if (!quote || !client) return null;

      return {
        company: client.companyName,
        quote,
        name: contact?.name || client.companyName,
        role: contact?.role || client.companyName,
        logoUrl: mediaUrl(client.logo),
      };
    })
    .filter((item): item is ClientTestimonial => item !== null);
}
