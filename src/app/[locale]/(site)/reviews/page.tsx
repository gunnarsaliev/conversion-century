import { setRequestLocale } from "next-intl/server";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Testimonial21, type Testimonial21Item } from "@/components/testimonial21";
import { getApprovedTestimonials, mediaUrl } from "@/lib/client-testimonials";
import { getGoogleReviews } from "@/lib/google-reviews";
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

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);

  const [testimonials, googleReviews] = await Promise.all([
    getApprovedTestimonials(),
    getGoogleReviews(),
  ]);

  // Every approved testimonial, with or without a client, text or rating,
  // plus the live Google reviews, all newest first.
  const reviews: Testimonial21Item[] = [
    ...testimonials.map(
      ({ testimonial, source, rating, date, client, contact, submittedBy, newClient }) => {
        const companyName = client?.companyName || newClient?.companyName || undefined;
        return {
          source,
          quote: hasText(testimonial?.root)
            ? (testimonial as SerializedEditorState)
            : undefined,
          author: {
            name: contact?.name || submittedBy?.name || companyName,
            role: contact?.role || submittedBy?.role || undefined,
            image: mediaUrl(contact?.profileImage ?? submittedBy?.profileImage),
          },
          company: companyName
            ? {
                name: companyName,
                logo: mediaUrl(client ? client.logo : newClient?.logo),
                link: toExternalUrl(
                  client ? client.websiteLinks?.[0]?.url : newClient?.website,
                ),
              }
            : undefined,
          rating: rating ?? undefined,
          date,
        };
      },
    ),
    ...googleReviews.map((review) => ({
      source: "google" as const,
      quote: review.text,
      author: { name: review.name, image: review.photo },
      rating: review.rating,
      date: review.date,
    })),
  ]
    // Skip only the ones with nothing to show.
    .filter((review) => review.quote || review.rating)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <>
      <StaticPageJsonLd page="reviews" />
      <Testimonial21 testimonials={reviews} />
    </>
  );
}
