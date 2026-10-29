import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { IndustryDetail } from "@/components/industry-detail";
import { slugStaticParams } from "@/lib/cms/slugs";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";
import type { Media } from "../../../../../../payload-types";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { graph, serviceSchema } from "@/lib/seo/schema";
import { toLocale } from "@/lib/seo/site";

type IndustryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Local API bypasses access control, so hide drafts explicitly.
const getIndustry = cache(async (slug: string, locale: string) => {
  const industry = await findByLocalizedSlug("industries", slug, locale);
  return industry?._status === "published" ? industry : null;
});

// Published docs are prerendered at build; new ones render on first visit
// and are then cached.
export const generateStaticParams = slugStaticParams("industries");

export async function generateMetadata({
  params,
}: IndustryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const industry = await getIndustry(slug, locale);

  if (!industry) return {};

  return buildMetadata({
    title: industry.meta?.title || industry.title,
    description:
      industry.meta?.description ||
      truncate(
        richTextToPlainText(industry.description as SerializedEditorState | null),
      ),
    path: await localizedDocPath("industries", industry.id, "/industries"),
    locale: toLocale(locale),
    image: mediaImage(industry.image),
  });
}

// Only clients flagged as public on the website, and only their name and
// logo — Clients is admin-only CRM data and the local API bypasses access
// control. Cached across requests.
async function getIndustryClients(industryId: number) {
  "use cache";
  cmsCache("clients", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "clients",
    where: {
      and: [
        { showOnWebsite: { equals: true } },
        { logo: { exists: true } },
        { industries: { in: [industryId] } },
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
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const industry = await getIndustry(slug, locale);

  if (!industry) {
    notFound();
  }

  const { docs: clients } = await getIndustryClients(industry.id);

  const image =
    industry.image && typeof industry.image === "object"
      ? (industry.image as Media)
      : null;

  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("industries", industry.id, "/industries");

  return (
    <>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ["industries", { name: industry.title, path }]),
          serviceSchema({
            locale: seoLocale,
            path,
            name: industry.meta?.title || industry.title,
            description:
              industry.meta?.description ||
              truncate(
                richTextToPlainText(industry.description as SerializedEditorState | null),
                300,
              ),
            image: image?.url,
            audience: industry.title,
          }),
        )}
      />
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
    </>
  );
}
