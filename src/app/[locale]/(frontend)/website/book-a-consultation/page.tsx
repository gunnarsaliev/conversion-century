import { getPayload } from "payload";
import config from "@payload-config";
import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";

import { BookADemo2 } from "@/components/book-a-demo2";
import type { Media } from "../../../../../../payload-types";
import { Logos35 } from "@/components/logos35";

const FEATURED_CLIENT_IDS = [75, 47, 72, 83];

// BookADemo2Testimonials renders `author.profilePicture` as a plain <img>,
// so a "first letter" avatar has to actually be an image source — build
// one as an inline SVG data URI rather than pulling in an avatar library.
const letterAvatar = (letter: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#0f172a"/><text x="32" y="32" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="#ffffff">${letter}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

export default async function BookAConsultationPage() {
  const payload = await getPayload({ config });

  const { docs: logoClients } = await payload.find({
    collection: "clients",
    where: {
      showOnWebsite: { equals: true },
      logo: { exists: true },
    },
    depth: 1,
    limit: 50,
  });

  const clientLogos = logoClients
    .filter(
      (client): client is typeof client & { logo: Media } =>
        typeof client.logo === "object" &&
        client.logo !== null &&
        !!client.logo.url,
    )
    .map((client) => ({
      name: client.companyName,
      src: client.logo.url as string,
    }));

  const clients = await Promise.all(
    FEATURED_CLIENT_IDS.map((id) =>
      payload
        .findByID({
          collection: "clients",
          id,
          depth: 1,
          // Local API bypasses Clients' admin-only `read` access — needed
          // so a logged-out visitor can see these hand-picked testimonials
          // on this public page.
        })
        .catch(() => null),
    ),
  );

  const testimonials = clients
    .filter((client) => client !== null)
    .map((client) => {
      const logo =
        client.logo && typeof client.logo === "object"
          ? (client.logo as Media)
          : null;

      const fullQuote = client.testimonial
        ? convertLexicalToPlaintext({ data: client.testimonial }).trim()
        : "";

      const authorName = client.contactName
        ? `${client.contactName}, ${client.companyName}`
        : client.companyName;

      return {
        companyLogo: logo?.url ?? "",
        quote: {
          fullQuote,
          highlightedWords: [],
        },
        author: {
          name: authorName,
          designation: client.companyName,
          profilePicture: letterAvatar(
            (client.contactName || client.companyName).charAt(0).toUpperCase(),
          ),
        },
      };
    })
    // A client without a testimonial has nothing to show in the carousel.
    .filter((testimonial) => testimonial.quote.fullQuote.length > 0);

  return (
    <>
      <BookADemo2
        header={{
          heading: "Book Your Free SEO Consultation",
          description: {
            text: "Talk to one of our SEO strategists about your traffic, rankings and organic growth goals. If you have questions first, feel free to reach out to our team.",
            hyperlink: "reach out to our team",
            url: "/website/about",
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
      <Logos35
        eyebrow="Trusted by businesses at"
        heading="Real results for real SEO clients"
        footer="From local SEO to enterprise organic growth — see who we've helped rank higher."
        logos={clientLogos.length > 0 ? clientLogos : undefined}
      />
    </>
  );
}
