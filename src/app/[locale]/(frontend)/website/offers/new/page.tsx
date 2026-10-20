import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { OfferForm } from "@/components/offer/offer-form";
import type { OfferFormOptions } from "@/lib/offer-form";

export const metadata: Metadata = {
  title: "Нова оферта",
  robots: { index: false, follow: false },
};

// Offers are written in Bulgarian, so service names are read in `bg`.
const OFFER_LOCALE = "bg";

// Creates a record in the `offers` collection (admins only, like the admin panel).
export default async function NewOfferPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (user?.role !== "admin") notFound();

  const [clients, services] = await Promise.all([
    payload.find({
      collection: "clients",
      select: { companyName: true, logo: true, websiteLinks: true, contactName: true },
      sort: "companyName",
      // 1 so the logo media doc (and its `url`) is populated.
      depth: 1,
      pagination: false,
    }),
    payload.find({
      collection: "services",
      locale: OFFER_LOCALE,
      select: { name: true, price: true },
      sort: "name",
      depth: 0,
      pagination: false,
    }),
  ]);

  const options: OfferFormOptions = {
    clients: clients.docs.map((doc) => ({
      value: doc.id,
      label: doc.companyName,
      image: typeof doc.logo === "object" ? (doc.logo?.url ?? undefined) : undefined,
      description: [
        doc.websiteLinks?.[0]?.url?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        doc.contactName,
      ].filter((line): line is string => Boolean(line)),
    })),
    services: services.docs.map((doc) => ({
      value: doc.id,
      label: doc.name,
      rate: doc.price ?? null,
    })),
  };

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold">Нова оферта</h1>
        <p className="mb-10 text-muted-foreground">
          Текстовете, общи за всички оферти, са в шаблона; тук попълвате само данните за клиента.
        </p>
        <OfferForm
          options={options}
          className="rounded-lg border bg-white p-6 shadow-xs sm:p-8 dark:bg-gray-800"
        />
      </div>
    </section>
  );
}
