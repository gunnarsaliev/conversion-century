import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

import { ClientLogos } from "@/components/client-logos";
import { Hero118 } from "@/components/hero118";
import {
  IndustryDetail,
  splitAfterFirstParagraph,
} from "@/components/industry-detail";
import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { slugStaticParams } from "@/lib/cms/slugs";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import { getRelated } from "@/lib/cms/related";
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
    image: mediaImage(industry.meta?.image) ?? mediaImage(industry.image),
    noindex: industry.meta?.noindex,
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

  const [{ docs: clients }, otherIndustries] = await Promise.all([
    getIndustryClients(industry.id),
    getRelated("industries", locale, industry.id),
  ]);

  const image =
    industry.image && typeof industry.image === "object"
      ? (industry.image as Media)
      : null;

  const t = await getTranslations("IndustryDetail");
  const tCommon = await getTranslations("Common");

  // First paragraph becomes the hero copy; the rest is the page body.
  const [intro, body] = splitAfterFirstParagraph(
    (industry.description as SerializedEditorState | null) ?? undefined,
  );

  const clientLogos = clients.flatMap((client) => {
    const logo =
      client.logo && typeof client.logo === "object"
        ? (client.logo as Media).url
        : null;
    return logo ? [{ src: logo, alt: client.companyName }] : [];
  });

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
      <Hero118
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>
                  {tCommon("home")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/industries" />}>
                  {t("breadcrumb")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{industry.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        badge={{ text: t("label") }}
        heading={industry.title}
        description={richTextToPlainText(intro)}
        buttons={{
          primary: {
            text: tCommon("bookConsultation"),
            url: "/book-a-consultation",
          },
        }}
        images={
          image?.url
            ? [
                {
                  src: image.url,
                  alt: image.alt || industry.title,
                  width: image.width ?? undefined,
                  height: image.height ?? undefined,
                },
              ]
            : undefined
        }
        logos={clientLogos.length > 0 ? clientLogos : undefined}
        logosLabel={t("clientsIn", { title: industry.title })}
      />
      <IndustryDetail
        description={body}
        afterDescription={<ClientLogos className="mt-20 py-12" />}
        otherIndustries={otherIndustries}
      />
    </>
  );
}
