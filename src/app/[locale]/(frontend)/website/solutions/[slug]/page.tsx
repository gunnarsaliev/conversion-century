import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Faq28 } from "@/components/faq28";
import { Logos35 } from "@/components/logos35";
import { Testimonial30 } from "@/components/testimonial30";
import { getClientTestimonials } from "@/lib/client-testimonials";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import type { Media } from "../../../../../../../payload-types";
import { Hero297 } from "@/components/hero297";
import { Feature99 } from "@/components/feature99";
import { Feature18 } from "@/components/feature18";
import Priorities from "@/components/priorities";
import { WhyUs } from "@/components/why-us";
import SolutionHero from "@/components/solution-hero";

type SolutionDetailPageProps = {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({
  params,
}: SolutionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const solution = await getSolution(slug, locale);

  if (!solution) return {};

  return {
    title: solution.meta?.title || solution.name,
    description:
      solution.meta?.description ||
      splitParagraphs(solution.hero?.paragraphs)[0] ||
      undefined,
  };
}

export default async function SolutionDetailPage({
  params,
}: SolutionDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const solution = await getSolution(slug, locale);

  if (!solution) {
    notFound();
  }

  const payload = await getPayload({ config });
  const { docs: clients } = await payload.find({
    collection: "clients",
    where: {
      showOnWebsite: { equals: true },
      logo: { exists: true },
    },
    depth: 1,
    limit: 50,
  });

  const clientLogos = clients
    .filter(
      (client): client is typeof client & { logo: Media } =>
        typeof client.logo === "object" && client.logo !== null && !!client.logo.url,
    )
    .map((client) => ({
      name: client.companyName,
      src: client.logo.url as string,
    }));

  const testimonials = await getClientTestimonials(payload);

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

  return (
    <div>
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

      <Logos35 logos={clientLogos.length > 0 ? clientLogos : undefined} />
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
