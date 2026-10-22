import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

import { TestimonialForm, type TestimonialClientOption } from "@/components/testimonial-form";

export const metadata: Metadata = {
  title: "Share your testimonial",
  robots: { index: false, follow: false },
};

export default async function NewTestimonialPage() {
  const payload = await getPayload({ config });

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
          Share your experience
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us what it was like working with Conversion Century. Every
          testimonial is reviewed by our team before it goes live.
        </p>
      </div>
      <TestimonialForm clients={options} />
    </div>
  );
}
