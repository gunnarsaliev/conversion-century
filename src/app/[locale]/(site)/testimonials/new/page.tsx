import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublicClientOptions } from "@/lib/client-testimonials";
import { TestimonialForm } from "@/components/testimonial-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TestimonialForm.page");
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function NewTestimonialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("TestimonialForm.page");
  const options = await getPublicClientOptions();

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
