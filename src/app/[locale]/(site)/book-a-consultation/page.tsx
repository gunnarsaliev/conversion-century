import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

import { BookADemo2 } from "@/components/book-a-demo2";
import { getApprovedTestimonials, mediaUrl } from "@/lib/client-testimonials";
import { ClientLogos } from "@/components/client-logos";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";

// BookADemo2Testimonials renders `author.profilePicture` as a plain <img>,
// so a "first letter" avatar has to actually be an image source — build
// one as an inline SVG data URI rather than pulling in an avatar library.
const letterAvatar = (letter: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#0f172a"/><text x="32" y="32" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="#ffffff">${letter}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

export async function generateMetadata() {
  return staticPageMetadata("bookAConsultation");
}

export default async function BookAConsultationPage() {
  const payload = await getPayload({ config });
  const t = await getTranslations("Consultation.page");

  const featured = await getApprovedTestimonials(payload, { featured: true });

  const testimonials = featured
    .filter(({ client }) => client !== null)
    .map(({ testimonial, client, contact }) => {
      const companyName = client!.companyName;
      const fullQuote = convertLexicalToPlaintext({ data: testimonial }).trim();

      return {
        companyLogo: mediaUrl(client!.logo) ?? "",
        quote: {
          fullQuote,
          highlightedWords: [],
        },
        author: {
          name: contact?.name ? `${contact.name}, ${companyName}` : companyName,
          designation: companyName,
          profilePicture:
            mediaUrl(contact?.profileImage) ??
            letterAvatar((contact?.name || companyName).charAt(0).toUpperCase()),
        },
      };
    })
    // A testimonial without text has nothing to show in the carousel.
    .filter((testimonial) => testimonial.quote.fullQuote.length > 0);

  return (
    <>
      <StaticPageJsonLd page="bookAConsultation" />
      <>
        <BookADemo2
          header={{
            heading: t("heading"),
            description: {
              // `hyperlink` must appear verbatim in `text`.
              text: t("description"),
              hyperlink: t("descriptionLink"),
              url: "/about",
            },
            avatars: [
              {
                image:
                  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/christian-buehner-DItYlc26zVI-unsplash 1.jpg",
                avatarClassName: "border-orange-500",
                cursorClassName: "text-orange-500 fill-orange-500",
              },
              {
                image:
                  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/portraits/nima-motaghian-nejad-_omdf_EgRUo-unsplash.jpg",
                avatarClassName: "border-blue-500",
                cursorClassName: "text-blue-500 fill-blue-500",
              },
            ],
          }}
          testimonials={testimonials.length > 0 ? testimonials : undefined}
        />
        <ClientLogos
          eyebrow={t("logosEyebrow")}
          heading={t("logosHeading")}
          footer={t("logosFooter")}
        />
      </>
    </>
  );
}
