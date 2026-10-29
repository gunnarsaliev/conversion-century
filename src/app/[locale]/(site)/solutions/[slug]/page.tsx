import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Faq28 } from "@/components/faq28";
import { ClientLogos } from "@/components/client-logos";
import { Testimonial30 } from "@/components/testimonial30";
import { getClientTestimonials } from "@/lib/client-testimonials";
import { slugStaticParams } from "@/lib/cms/slugs";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import { Hero297 } from "@/components/hero297";
import { Feature99 } from "@/components/feature99";
import { Feature18 } from "@/components/feature18";
import Priorities from "@/components/priorities";
import { WhyUs } from "@/components/why-us";
import SolutionHero from "@/components/solution-hero";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { graph, faqSchema, serviceSchema } from "@/lib/seo/schema";
import { toLocale } from "@/lib/seo/site";

type SolutionDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getSolution = cache((slug: string, locale: string) =>
  findByLocalizedSlug("solutions", slug, locale),
);

// Paragraph fields are stored as one textarea separated by blank lines.
function splitParagraphs(text?: string | null) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Published docs are prerendered at build; new ones render on first visit
// and are then cached.
export const generateStaticParams = slugStaticParams("solutions");

export async function generateMetadata({
  params,
}: SolutionDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = await getSolution(slug, locale);

  if (!solution) return {};

  return buildMetadata({
    title: solution.meta?.title || solution.name,
    description:
      solution.meta?.description ||
      truncate(splitParagraphs(solution.hero?.paragraphs)[0]),
    path: await localizedDocPath("solutions", solution.id, "/solutions"),
    locale: toLocale(locale),
    image: mediaImage(solution.image),
  });
}

export default async function SolutionDetailPage({
  params,
}: SolutionDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const solution = await getSolution(slug, locale);

  if (!solution) {
    notFound();
  }


  const testimonials = await getClientTestimonials();

  const {
    hero,
    concerns,
    businessGrowth,
    whyUs,
    includes,
    outcomes,
    process,
    faq,
    consultation,
  } = solution;

  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("solutions", solution.id, "/solutions");

  return (
    <div>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ["solutions", { name: solution.name, path }]),
          serviceSchema({
            locale: seoLocale,
            path,
            name: solution.name,
            description:
              solution.meta?.description ||
              splitParagraphs(solution.hero?.paragraphs)[0],
            image: mediaImage(solution.image)?.url,
          }),
          faqSchema(faq?.items),
        )}
      />
      <SolutionHero
        name={solution.name}
        eyebrow={hero?.eyebrow}
        heading={hero?.heading}
        paragraphs={splitParagraphs(hero?.paragraphs)}
        highlights={hero?.highlights?.map((h) => h.text)}
      />

      {concerns?.heading && concerns.items && concerns.items.length > 0 && (
        <Feature18 heading={concerns.heading} features={concerns.items} />
      )}

      {businessGrowth?.heading && (
        <Hero297
          badge={
            businessGrowth.eyebrow
              ? { text: businessGrowth.eyebrow }
              : undefined
          }
          heading={businessGrowth.heading}
          description={[businessGrowth.lead, businessGrowth.paragraphs]
            .filter(Boolean)
            .join("\n\n")}
        />
      )}

      <Priorities section={solution.audience} />
      <Priorities section={solution.partnerNeeds} className="bg-yellow-50 py-16" />

      <WhyUs items={whyUs?.items} />

      {includes?.heading && includes.items && includes.items.length > 0 && (
        <Feature18
          heading={includes.heading}
          description={includes.description}
          features={includes.items.map((item) => ({
            title: item.title,
            description: item.paragraphs,
          }))}
        />
      )}

      {outcomes?.heading && outcomes.items && outcomes.items.length > 0 && (
        <Feature18
          heading={outcomes.heading}
          description={outcomes.description}
          features={outcomes.items}
        />
      )}

      {process?.heading && process.steps && process.steps.length > 0 && (
        <Feature99
          heading={process.heading}
          steps={process.steps}
          note={process.note}
        />
      )}

      <ClientLogos />
      <Priorities section={solution.teamExtension} className="bg-yellow-50 py-16" />

      <Testimonial30 testimonials={testimonials} />

      {faq?.items && faq.items.length > 0 ? (
        <Faq28
          heading={faq.heading ?? undefined}
          items={faq.items.map(({ question, answer }) => ({ question, answer }))}
        />
      ) : (
        <Faq28 />
      )}

      {consultation?.heading && (
        <Hero297
          heading={consultation.heading}
          description={consultation.description ?? ""}
        />
      )}
    </div>
  );
}
