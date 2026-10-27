import { getLocale, getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Hero104 } from "@/components/hero104";
import { getHomeHero } from "@/lib/home-hero";
import { ClientLogos } from "@/components/client-logos";
import type { Client, Media, User } from "../../../../payload-types";
import { Feature13 } from "@/components/feature13";
import { Feature278 } from "@/components/feature278";
import { Feature104 } from "@/components/feature104";
import { Testimonial17, type Testimonial17Item } from "@/components/testimonial17";
import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";
import { getClientTestimonials } from "@/lib/client-testimonials";
import { Blog12, type Blog12Post } from "@/components/blog12";
import { Hero80 } from "@/components/hero80"; 
import { FounderLetter } from "@/components/founder-letter";
import { Hero262 } from "@/components/hero262";
import { CaseStudies8, type CaseStudies8Item } from "@/components/case-studies8";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { translated, untranslatedHrefs } from "@/utilities/findByLocalizedSlug";

const WORDS_PER_MINUTE = 200;

const authorName = (author: number | User | null | undefined) => {
  if (!author || typeof author !== "object") return "";
  return [author.firstName, author.lastName].filter(Boolean).join(" ") || author.email;
};

const authorAvatar = (author: number | User | null | undefined) => {
  if (!author || typeof author !== "object") return undefined;
  return typeof author.profileImage === "object" && author.profileImage?.url
    ? author.profileImage.url
    : undefined;
};

export async function generateMetadata() {
  return staticPageMetadata("home");
}

export default async function WebsitePage() {
  const locale = await getLocale();
  const hiddenHrefs = await untranslatedHrefs(locale);
  const payload = await getPayload({ config });
  const tCommon = await getTranslations("Common");


  const testimonials: Testimonial17Item[] = (
    await getClientTestimonials(payload)
  ).map(({ quote, name, role, logoUrl }) => ({ quote, name, role, logoUrl }));

  const { docs: blogPosts } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
    where: translated,
    // depth: 2 so post.author.profileImage resolves to a Media object
    // (not just an ID) for the author avatar.
    depth: 2,
    limit: 3,
    sort: "-publishedAt",
    // Local API calls bypass access control by default; the collection's
    // own `read` access already restricts logged-out visitors to
    // published posts, so this still only ever serves public content.
  });

  const blogItems: Blog12Post[] = blogPosts.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === "object"
        ? (post.featuredImage as Media)
        : null;
    const wordCount = richTextToPlainText(post.content).split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

    return {
      title: post.title,
      description: post.excerpt ?? "",
      image: image?.url ?? undefined,
      author: authorName(post.author),
      authorAvatar: authorAvatar(post.author),
      readTime: tCommon("readTime", { minutes: readTime }),
      link: `/blog/${post.slug ?? post.id}`,
    };
  });

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

  return (
    <>
      <StaticPageJsonLd page="home" />
      <div>
        <Hero104 {...await getHomeHero()} />
        <ClientLogos viewAllHref="/clients" />
        <Hero262 />      
        <Feature278 hiddenHrefs={hiddenHrefs} />
        <CaseStudies8 items={caseStudyItems.length > 0 ? caseStudyItems : undefined} />
        <Feature13 hiddenHrefs={hiddenHrefs} />
        <Feature104 />
        <FounderLetter />
        <Testimonial17
          testimonials={testimonials.length > 0 ? testimonials : undefined}
        />
        <Blog12 posts={blogItems.length > 0 ? blogItems : undefined} />
      </div>
    </>
  );
}