import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Hero104 } from "@/components/hero104";
import { Logos35 } from "@/components/logos35";
import type { Media, User } from "../../../../../payload-types";
import { Feature13 } from "@/components/feature13";
import { Feature278 } from "@/components/feature278";
import { Feature104 } from "@/components/feature104";
import { Testimonial17, type Testimonial17Item } from "@/components/testimonial17";
import { richTextToPlainText } from "@/lib/rich-text-to-plain-text";
import { Blog12, type Blog12Post } from "@/components/blog12";
import { Hero80 } from "@/components/hero80"; 
import { FounderLetter } from "@/components/founder-letter";
import { Hero262 } from "@/components/hero262";
import { CaseStudies8 } from "@/components/case-studies8";

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

// Hand-picked clients whose testimonial should appear in the homepage
// carousel, in display order — not tied to `showOnWebsite` (that flag only
// governs the logo strip above).
const TESTIMONIAL_CLIENT_IDS = [47, 75, 90];

export default async function WebsitePage() {
  const locale = await getLocale();
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

  const { docs: testimonialClients } = await payload.find({
    collection: "clients",
    where: {
      id: { in: TESTIMONIAL_CLIENT_IDS },
    },
    depth: 1,
    limit: TESTIMONIAL_CLIENT_IDS.length,
    overrideAccess: true,
  });

  const testimonials: Testimonial17Item[] = TESTIMONIAL_CLIENT_IDS.map(
    (id): Testimonial17Item | null => {
      const client = testimonialClients.find((doc) => doc.id === id);
      if (!client) return null;

      const quote = richTextToPlainText(client.testimonial);
      if (!quote) return null;

      return {
        quote,
        name: client.contactName || client.companyName,
        role: client.contactRole || client.companyName,
        logoUrl:
          typeof client.logo === "object" && client.logo?.url
            ? client.logo.url
            : undefined,
      };
    },
  ).filter((item): item is Testimonial17Item => item !== null);

  const { docs: blogPosts } = await payload.find({
    collection: "blog",
    locale: locale as "en" | "bg",
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
      image: image?.url ?? "",
      author: authorName(post.author),
      authorAvatar: authorAvatar(post.author),
      readTime: `${readTime} Min Read`,
      link: `/website/blog/${post.slug ?? post.id}`,
    };
  });

  return (
    <div>
      <Hero104 />
      <Logos35 logos={clientLogos.length > 0 ? clientLogos : undefined} />
      <Hero262 />      
      <Feature278 />
      <CaseStudies8 />
      <Feature13 />
      <Feature104 />
      <FounderLetter />
      <Testimonial17
        testimonials={testimonials.length > 0 ? testimonials : undefined}
      />
      <Blog12 posts={blogItems.length > 0 ? blogItems : undefined} />
    </div>
  );
}