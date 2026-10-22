import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferArticle } from "@/components/offer/offer-article";
import staticData from "@/data/offers/static.json";
import { getClientLogos } from "@/lib/client-logos";
import { getOffer } from "@/lib/offers";
import type { OfferStatic } from "@/types/offer";
import { getDashboardUser, requireDashboardUser } from "@/lib/dashboard-auth";

type OfferPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { id } = await params;
  // The title names the client, so only for signed-in users.
  const offer = (await getDashboardUser()) ? await getOffer(id) : null;
  return {
    title: offer ? `${offer.service} на ${offer.client.name}` : "Оферта",
    // Offers are private, so keep them out of search and the sitemap.
    robots: { index: false, follow: false },
  };
}

// One client's offer, from the `offers` collection.
export default async function OfferPage({ params }: OfferPageProps) {
  // proxy.ts only checks for a session cookie; offers are private.
  await requireDashboardUser();
  const { id } = await params;
  const [offer, clientLogos] = await Promise.all([getOffer(id), getClientLogos()]);
  if (!offer) notFound();

  return (
    <OfferArticle
      content={staticData as OfferStatic}
      offer={offer}
      pdfHref={`/offers/${id}/pdf`}
      clientLogos={clientLogos}
    />
  );
}
