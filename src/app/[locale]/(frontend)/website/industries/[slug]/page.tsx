import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { IndustryDetail } from "@/components/industry-detail";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import type { Media } from "../../../../../../../payload-types";

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

const getIndustry = cache((slug: string, locale: string) =>
  findByLocalizedSlug("industries", slug, locale),
);

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const industry = await getIndustry(slug, locale);

  if (!industry) return {};

  return {
    title: industry.meta?.title || industry.title,
    description: industry.meta?.description || undefined,
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const industry = await getIndustry(slug, locale);

  if (!industry) {
    notFound();
  }

  const payload = await getPayload({ config });

  // Only clients flagged as public on the website, and only their name and
  // logo — Clients is admin-only CRM data and the local API bypasses access
  // control.
  const { docs: clients } = await payload.find({
    collection: "clients",
    where: {
      and: [
        { showOnWebsite: { equals: true } },
        { logo: { exists: true } },
        { industries: { in: [industry.id] } },
      ],
    },
    depth: 1,
    limit: 100,
    sort: "companyName",
    select: {
      companyName: true,
      logo: true,
    },
  });

  const image =
    industry.image && typeof industry.image === "object"
      ? (industry.image as Media)
      : null;

  return (
    <IndustryDetail
      title={industry.title}
      image={image?.url ?? undefined}
      description={
        (industry.description as SerializedEditorState | null) ?? undefined
      }
      clients={clients.flatMap((client) => {
        const logo =
          client.logo && typeof client.logo === "object"
            ? (client.logo as Media).url
            : null;
        return logo ? [{ name: client.companyName, logo }] : [];
      })}
    />
  );
}
