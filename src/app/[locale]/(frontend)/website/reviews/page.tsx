import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Reviews22, type ReviewType } from "@/components/reviews22";
import type { Media } from "../../../../../../payload-types";

// An emptied Lexical editor still saves a root with an empty paragraph,
// so `exists` alone isn't enough to know a testimonial was written.
const hasText = (node: unknown): boolean => {
  if (!node || typeof node !== "object") return false;
  const { text, children } = node as { text?: unknown; children?: unknown };
  if (typeof text === "string" && text.trim().length > 0) return true;
  return Array.isArray(children) && children.some(hasText);
};

const toExternalUrl = (url: string | null | undefined) => {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default async function ReviewsPage() {
  const payload = await getPayload({ config });

  const { docs: clients } = await payload.find({
    collection: "clients",
    where: { testimonial: { exists: true } },
    depth: 1,
    limit: 100,
    sort: "-updatedAt",
    // Local API bypasses access control (Clients is admin-only CRM data),
    // so only select the fields that are meant to appear publicly.
    select: {
      companyName: true,
      logo: true,
      contactName: true,
      contactRole: true,
      websiteLinks: true,
      testimonial: true,
    },
  });

  const reviews: ReviewType[] = clients
    .filter((client) => client.testimonial && hasText(client.testimonial.root))
    .map((client) => {
      const logo =
        client.logo && typeof client.logo === "object"
          ? (client.logo as Media).url ?? undefined
          : undefined;

      return {
        author: {
          name: client.contactName?.trim() || client.companyName,
          role: client.contactRole ?? undefined,
        },
        comment: client.testimonial as SerializedEditorState,
        company: {
          name: client.companyName,
          image: logo,
          link: toExternalUrl(client.websiteLinks?.[0]?.url),
        },
      };
    });

  return <Reviews22 reviews={reviews} />;
}
