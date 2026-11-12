import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { routing } from "@/i18n/routing";
import { cmsCache } from "@/lib/cms/cache";
import { Hero104 } from "@/components/hero104";
import { getHomeHero } from "@/lib/home-hero";
import { cmsImage, filled, getHomePage } from "@/lib/page-content";
import { ClientLogos } from "@/components/client-logos";
import type { Client, Media } from "../../../../payload-types";
import { Feature13 } from "@/components/feature13";
import { Feature278 } from "@/components/feature278";
import { Feature104 } from "@/components/feature104";
import { Testimonial17, type Testimonial17Item } from "@/components/testimonial17";
import { getLatestBlogPosts } from "@/lib/latest-blog-posts";
import { getClientTestimonials } from "@/lib/client-testimonials";
import { Blog12, type Blog12Post } from "@/components/blog12";
import { Hero80 } from "@/components/hero80"; 
import { FounderLetter } from "@/components/founder-letter";
import { Hero262 } from "@/components/hero262";
import { CaseStudies8, type CaseStudies8Item } from "@/components/case-studies8";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { menuLinks, translated } from "@/utilities/findByLocalizedSlug";

export async function generateMetadata() {
  return staticPageMetadata("home");
}

// Everything the home page reads from Payload. Cached across requests; read
// times are returned in minutes and formatted by the page.
async function getHomeContent(locale: string) {
  "use cache";
  cmsCache("industries", "blog", "case-studies", "clients", "users", "media");
  const payload = await getPayload({ config });

  // Published industries for the Feature13 cards — which cards to show and
  // their images — keyed by the cards' internal hrefs (/industries/<en slug>).
  const { docs: industries } = await payload.find({
    collection: "industries",
    locale: "en",
    where: { _status: { equals: "published" } },
    depth: 1,
    pagination: false,
    select: { slug: true, image: true },
  });
  const industryCards = industries.flatMap((industry) => {
    if (!industry.slug) return [];
    const image =
      industry.image && typeof industry.image === "object"
        ? (industry.image as Media)
        : null;
    return [{ href: `/industries/${industry.slug}`, image: image?.url ?? undefined }];
  });

  const blogItems = await getLatestBlogPosts(locale);

  const { docs: caseStudies } = await payload.find({
    collection: "case-studies",
    locale: locale as "en" | "bg",
    where: translated,
    // depth: 2 so client.logo resolves to a Media object with its url.
    depth: 2,
    limit: 6,
    sort: "-createdAt",
    select: { title: true, slug: true, client: true, image: true, overview: true },
    // Clients is admin-only CRM data and the local API bypasses access
    // control, so only populate the public fields.
    populate: {
      clients: { companyName: true, logo: true, showOnWebsite: true },
    },
  });

  const caseStudyItems: CaseStudies8Item[] = caseStudies.map((caseStudy) => {
    const image =
      caseStudy.image && typeof caseStudy.image === "object"
        ? (caseStudy.image as Media)
        : null;
    const client =
      caseStudy.client && typeof caseStudy.client === "object"
        ? (caseStudy.client as Client)
        : null;
    // A client's logo is only public once it is marked showOnWebsite.
    const logo =
      client?.showOnWebsite && typeof client.logo === "object"
        ? client.logo?.url ?? undefined
        : undefined;

    return {
      id: String(caseStudy.id),
      logo,
      logoAlt: client?.companyName,
      title: caseStudy.title,
      description: caseStudy.overview ?? "",
      href: `/case-studies/${caseStudy.slug ?? caseStudy.id}`,
      image: image?.url ?? undefined,
    };
  });

  return { industryCards, blogItems, caseStudyItems };
}

// Tighter vertical rhythm than the sections' default py-32, on this page only.
const SECTION_SPACING = "py-12 lg:py-16";

export default async function WebsitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // /foo.txt lands here with "foo.txt" as the locale (see the (site) layout).
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [links, content, clientTestimonials, tCommon, home] = await Promise.all([
    menuLinks(locale),
    getHomeContent(locale),
    getClientTestimonials(),
    getTranslations("Common"),
    // Section copy and images (the `home-page` collection). A field left
    // empty there is passed as undefined, so the section's messages apply.
    getHomePage(locale),
  ]);
  const { industryCards, caseStudyItems } = content;

  const testimonials: Testimonial17Item[] = clientTestimonials.map(
    ({ quote, name, role, logoUrl }) => ({ quote, name, role, logoUrl }),
  );

  const blogItems: Blog12Post[] = content.blogItems.map(({ readMinutes, ...post }) => ({
    ...post,
    readTime: tCommon("readTime", { minutes: readMinutes }),
  }));

  return (
    <>
      <StaticPageJsonLd page="home" />
      <div>
        <Hero104
          {...await getHomeHero()}
          // Fluid so the short home heading stays on one line in both locales;
          // the coefficients track the column width at each breakpoint.
          headingClassName="text-[length:calc(6.9vw-4px)] sm:text-[length:min(calc(6.9vw-6px),3.25rem)] md:text-[length:min(calc(6.9vw-6px),3.25rem)] lg:text-[length:min(calc(4.6vw-6.5px),3.25rem)]"
        />
        <ClientLogos
          className={SECTION_SPACING}
          eyebrow={filled(home?.clients?.eyebrow)}
          heading={filled(home?.clients?.heading)}
          footer={filled(home?.clients?.footer)}
          viewAllHref={filled(home?.clients?.viewAll?.href)}
          viewAllLabel={filled(home?.clients?.viewAll?.label)}
        />
        <Hero262
          className={SECTION_SPACING}
          heading={filled(home?.intro?.heading)}
          description={filled(home?.intro?.paragraphs)}
          stats={home?.intro?.stats?.length ? home.intro.stats : undefined}
          ctaText={filled(home?.intro?.cta?.label)}
          ctaUrl={filled(home?.intro?.cta?.href)}
        />
        <Feature278
          {...links}
          className={SECTION_SPACING}
          heading={filled(home?.services?.heading)}
          description={filled(home?.services?.description)}
          items={home?.services?.items ?? undefined}
          viewAll={home?.services?.viewAll}
        />
        <CaseStudies8
          className={SECTION_SPACING}
          title={filled(home?.caseStudies?.heading)}
          description={filled(home?.caseStudies?.description)}
          viewAll={home?.caseStudies?.viewAll}
          items={caseStudyItems.length > 0 ? caseStudyItems : undefined}
        />
        <Feature13
          {...links}
          className={SECTION_SPACING}
          eyebrow={filled(home?.industries?.eyebrow)}
          heading={filled(home?.industries?.heading)}
          description={filled(home?.industries?.description)}
          items={home?.industries?.items ?? undefined}
          industries={industryCards}
        />
        <Feature104
          className={SECTION_SPACING}
          badge={filled(home?.whyUs?.badge)}
          heading={filled(home?.whyUs?.heading)}
          subheading={filled(home?.whyUs?.subheading)}
          image={cmsImage(home?.whyUs?.image, home?.whyUs?.imageAlt)}
          points={home?.whyUs?.points ?? undefined}
        />
        <FounderLetter
          contentClassName={SECTION_SPACING}
          eyebrow={filled(home?.founderLetter?.eyebrow)}
          heading={filled(home?.founderLetter?.heading)}
          portrait={cmsImage(home?.founderLetter?.portrait, home?.founderLetter?.portraitAlt)}
          quote={filled(home?.founderLetter?.quote)}
          name={filled(home?.founderLetter?.name)}
          role={filled(home?.founderLetter?.role)}
          ctaText={filled(home?.founderLetter?.cta?.label)}
          ctaUrl={filled(home?.founderLetter?.cta?.href)}
        />
        <Testimonial17
          className={SECTION_SPACING}
          heading={filled(home?.testimonials?.heading)}
          viewAll={home?.testimonials?.viewAll}
          testimonials={testimonials.length > 0 ? testimonials : undefined}
        />
        <Blog12
          className={SECTION_SPACING}
          content={home?.blog}
          posts={blogItems.length > 0 ? blogItems : undefined}
        />
      </div>
    </>
  );
}