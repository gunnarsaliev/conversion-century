import { setRequestLocale } from "next-intl/server";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { Testimonial21, type Testimonial21Item } from "@/components/testimonial21";
import { AddReviewDialog } from "@/components/add-review-dialog";
import {
  getApprovedTestimonials,
  getPublicClientOptions,
  mediaUrl,
} from "@/lib/client-testimonials";
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

// 0: comment + brand, 1: comment without brand,
// 2: no comment, no brand, but a profile image, 3: everything else.
const reviewTier = ({ quote, company, author }: Testimonial21Item) => {
  if (quote && company) return 0;
  if (quote) return 1;
  if (!company && author?.image) return 2;
  return 3;
};

// Our Google Business profile, where every Google review can be read.
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?num=10&sa=X&sca_esv=ae1f6386fa4752fd&biw=2304&bih=1161&sxsrf=APpeQnt7gavxsKWJaH8BieM7mKMjVKukaQ:1792408134314&kgmid=/g/11s2q9smzc&q=Conversion+Century&shem=dlvs1,epsd1,esd2e,ltae,rimspwouoe,sdpie&shndl=30&source=sh/x/loc/uni/m1/1&kgs=0449fef1662cddfb&utm_source=dlvs1,epsd1,esd2e,ltae,rimspwouoe,sdpie,sh/x/loc/uni/m1/1";

export async function generateMetadata() {
  return staticPageMetadata("reviews");
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);

  const [testimonials, googleReviews, clientOptions] = await Promise.all([
    getApprovedTestimonials(),
    getGoogleReviews(),
    getPublicClientOptions(),
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
          sourceLink: source === "google" ? GOOGLE_REVIEWS_URL : undefined,
        };
      },
    ),
    ...googleReviews.map((review) => ({
      source: "google" as const,
      quote: review.text,
      author: { name: review.name, image: review.photo },
      rating: review.rating,
      date: review.date,
      sourceLink: GOOGLE_REVIEWS_URL,
    })),
  ]
    // Skip only the ones with nothing to show.
    .filter((review) => review.quote || review.rating)
    // Group by richness, newest first within each group.
    .sort(
      (a, b) =>
        reviewTier(a) - reviewTier(b) ||
        (b.date ?? "").localeCompare(a.date ?? ""),
    );

  return (
    <>
      <StaticPageJsonLd page="reviews" />
      <Testimonial21
        testimonials={reviews}
        action={<AddReviewDialog clients={clientOptions} />}
      />
    </>
  );
}
