import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { CaseStudy1 } from "@/components/case-study1";
import type { Client, Industry, Media } from "../../../../../../payload-types";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { graph, articleSchema } from "@/lib/seo/schema";
import { toLocale } from "@/lib/seo/site";
import { slugStaticParams } from "@/lib/cms/slugs";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";

type CaseStudyPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Shared by generateMetadata and the page so the lookup runs once per
// request.
const getCaseStudy = cache((slug: string, locale: string) =>
  findByLocalizedSlug("case-studies", slug, locale, {
    depth: 2,
    // Clients is admin-only CRM data and the local API bypasses access
    // control, so only populate the client's public name, logo and
    // industries.
    populate: {
      clients: { companyName: true, logo: true, industries: true },
      industries: { title: true, slug: true },
    },
  }),
);

// Published docs are prerendered at build; new ones render on first visit
// and are then cached.
export const generateStaticParams = slugStaticParams("case-studies");

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = await getCaseStudy(slug, locale);

  if (!caseStudy) return {};

  return buildMetadata({
    title: caseStudy.meta?.title || caseStudy.title,
    description: caseStudy.meta?.description || truncate(caseStudy.overview),
    path: await localizedDocPath("case-studies", caseStudy.id, "/case-studies"),
    locale: toLocale(locale),
    image: mediaImage(caseStudy.meta?.image) ?? mediaImage(caseStudy.image),
    noindex: caseStudy.meta?.noindex,
    type: "article",
    publishedTime: caseStudy.createdAt,
    modifiedTime: caseStudy.updatedAt,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
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

  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("case-studies", caseStudy.id, "/case-studies");

  return (
    <>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ["caseStudies", { name: caseStudy.title, path }]),
          articleSchema({
            locale: seoLocale,
            path,
            headline: caseStudy.title,
            description: caseStudy.meta?.description || caseStudy.overview,
            image: image?.url,
            datePublished: caseStudy.publishedAt ?? caseStudy.createdAt,
            dateModified: caseStudy.updatedAt,
            about: client?.companyName,
          }),
        )}
      />
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
                    href: `/industries/${industry.slug ?? industry.id}`,
                  })),
              }
            : undefined
        }
      />
    </>
  );
}
