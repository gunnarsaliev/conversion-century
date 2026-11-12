import { headers as getHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";
import { OfferForm } from "@/components/offer/offer-form";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import type { OfferFormOptions } from "@/lib/offer-form";
import { isAdmin } from "@/lib/roles";
import { primaryContactName } from "@/lib/primary-contact";

// Offers are written in Bulgarian, so service names are read in `bg`.
const OFFER_LOCALE = "bg";

// Creates a record in the `offers` collection (admins only, like the admin panel).
export default async function NewOfferPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  if (!isAdmin(user)) notFound();
  const t = await getDashboardTranslations("Offers");

  const [clients, services] = await Promise.all([
    payload.find({
      collection: "clients",
      select: { companyName: true, logo: true, websiteLinks: true, primaryContact: true },
      populate: { contacts: { name: true } },
      sort: "companyName",
      // 1 so the logo media doc (and its `url`) and the primary contact are populated.
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
        primaryContactName(doc),
      ].filter((line): line is string => Boolean(line)),
    })),
    services: services.docs.map((doc) => ({
      value: doc.id,
      label: doc.name,
      rate: doc.price ?? null,
    })),
  };

  return (
    <>
      <PageHeaderBanner
        title={t("new")}
        description={t("newDescription")}
        parent={{ label: t("title"), href: "/dashboard/offers" }}
      />

      <OfferForm
        options={options}
        className="mx-auto mt-4 w-full max-w-3xl rounded-lg border bg-white p-6 shadow-xs sm:mt-6 sm:p-8 dark:bg-gray-800"
      />
    </>
  );
}
