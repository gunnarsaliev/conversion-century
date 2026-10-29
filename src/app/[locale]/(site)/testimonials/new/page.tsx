import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { TestimonialForm, type TestimonialClientOption } from "@/components/testimonial-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TestimonialForm.page");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

// Only clients already public on the website (logo strip) are listed, so
// the form never reveals other CRM client names. Cached across requests.
async function getPublicClients() {
  "use cache";
  cmsCache("clients", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "clients",
    where: { showOnWebsite: { equals: true } },
    depth: 1,
    limit: 500,
    sort: "companyName",
    select: { companyName: true, logo: true },
  });
}

export default async function NewTestimonialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("TestimonialForm.page");
  const { docs: clients } = await getPublicClients();

  const options: TestimonialClientOption[] = clients.map((client) => ({
    value: String(client.id),
    label: client.companyName,
    logo:
      client.logo && typeof client.logo === "object" ? client.logo.url : null,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("description")}
        </p>
      </div>
      <TestimonialForm clients={options} />
    </div>
  );
}
