import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { IndustryDetail } from "@/components/industry-detail";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import type { Media } from "../../../../../../../payload-types";

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

const getSolution = cache((slug: string, locale: string) =>
  findByLocalizedSlug("solutions", slug, locale),
);

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const solution = await getSolution(slug, locale);

  if (!solution) return {};

  return {
    title: solution.meta?.title || solution.title,
    description: solution.meta?.description || undefined,
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const solution = await getSolution(slug, locale);

  if (!solution) {
    notFound();
  }

  const image =
    solution.image && typeof solution.image === "object"
      ? (solution.image as Media)
      : null;

  return (
    <IndustryDetail
      label="Solution"
      title={solution.title}
      image={image?.url ?? undefined}
      description={
        (solution.description as SerializedEditorState | null) ?? undefined
      }
      ctaHeading="Ready to get started?"
    />
  );
}
