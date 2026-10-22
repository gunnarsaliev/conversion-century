import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Testimonial21, type Testimonial21Item } from "@/components/testimonial21";
import { getApprovedTestimonials, mediaUrl } from "@/lib/client-testimonials";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";

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

export async function generateMetadata() {
  return staticPageMetadata("reviews");
}

export default async function ReviewsPage() {
  const payload = await getPayload({ config });

  const testimonials = await getApprovedTestimonials(payload);

  const reviews: Testimonial21Item[] = testimonials
    .filter(({ testimonial, client }) => client && hasText(testimonial.root))
    .map(({ testimonial, client, contact }) => ({
      quote: testimonial as SerializedEditorState,
      author: {
        name: contact?.name || client!.companyName,
        role: contact?.role ?? undefined,
        image: mediaUrl(contact?.profileImage),
      },
      company: {
        name: client!.companyName,
        logo: mediaUrl(client!.logo),
        link: toExternalUrl(client!.websiteLinks?.[0]?.url),
      },
    }));

  return (
    <>
      <StaticPageJsonLd page="reviews" />
      <Testimonial21 testimonials={reviews} />
    </>
  );
}
