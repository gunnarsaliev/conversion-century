import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { CaseStudy1 } from "@/components/case-study1";
import type { Client, Industry, Media } from "../../../../../../../payload-types";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

// Shared by generateMetadata and the page so the lookup runs once per
// request.
const getCaseStudy = cache(async (slug: string, locale: string) => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "case-studies",
    locale: locale as "en" | "bg",
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
    // Clients is admin-only CRM data and the local API bypasses access
    // control, so only populate the client's public name, logo and
    // industries.
    populate: {
      clients: { companyName: true, logo: true, industries: true },
      industries: { title: true, slug: true },
    },
  });

  return docs[0] ?? null;
});

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const caseStudy = await getCaseStudy(slug, locale);

  if (!caseStudy) return {};

  return {
    title: caseStudy.meta?.title || caseStudy.title,
    description:
      caseStudy.meta?.description || caseStudy.overview || undefined,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const caseStudy = await getCaseStudy(slug, locale);

  if (!caseStudy) {
    notFound();
  }

  const image =
    caseStudy.image && typeof caseStudy.image === "object"
      ? (caseStudy.image as Media)
      : null;
  const client =
    caseStudy.client && typeof caseStudy.client === "object"
      ? (caseStudy.client as Client)
      : null;
  const clientLogo =
    client?.logo && typeof client.logo === "object"
      ? (client.logo as Media)
      : null;

  return (
    <CaseStudy1
      title={caseStudy.title}
      overview={caseStudy.overview ?? undefined}
      image={image?.url ?? undefined}
      achievements={(caseStudy.achievements ?? []).map((achievement) => ({
        value: `${achievement.number}%`,
        metric: achievement.metric,
      }))}
      description={
        (caseStudy.description as SerializedEditorState | null) ?? undefined
      }
      client={
        client
          ? {
              name: client.companyName,
              logo: clientLogo?.url ?? undefined,
              industries: (client.industries ?? [])
                .filter(
                  (industry): industry is Industry =>
                    typeof industry === "object",
                )
                .map((industry) => ({
                  title: industry.title,
                  href: `/website/industries/${industry.slug ?? industry.id}`,
                })),
            }
          : undefined
      }
    />
  );
}
