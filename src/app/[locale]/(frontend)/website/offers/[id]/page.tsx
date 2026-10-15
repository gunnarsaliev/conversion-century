import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferArticle } from "@/components/offer/offer-article";
import staticData from "@/data/offers/static.json";
import { getOffer } from "@/lib/offers";
import type { OfferStatic } from "@/types/offer";

type OfferPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOffer(id);
  return {
    title: offer ? `${offer.service} на ${offer.client.name}` : "Оферта",
    // Offers are private, so keep them out of search and the sitemap.
    robots: { index: false, follow: false },
  };
}

// One client's offer, from the `offers` collection.
export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) notFound();

  return (
    <OfferArticle
      content={staticData as OfferStatic}
      offer={offer}
      pdfHref={`/website/offers/${id}/pdf`}
    />
  );
}
