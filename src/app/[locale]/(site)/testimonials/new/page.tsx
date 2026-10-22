import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { TestimonialForm, type TestimonialClientOption } from "@/components/testimonial-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TestimonialForm.page");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function NewTestimonialPage() {
  const payload = await getPayload({ config });
  const t = await getTranslations("TestimonialForm.page");

  // Only clients already public on the website (logo strip) are listed, so
  // the form never reveals other CRM client names.
  const { docs: clients } = await payload.find({
    collection: "clients",
    where: { showOnWebsite: { equals: true } },
    depth: 1,
    limit: 500,
    sort: "companyName",
    select: { companyName: true, logo: true },
  });

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
