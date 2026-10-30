import { Handshake, Star } from "lucide-react";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import { useTranslations } from "next-intl";
import { RichText } from "@/components/rich-text";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClampedQuote } from "@/components/clamped-quote";
import { GoogleLogo } from "@/components/google-logo";
import { TimeAgo } from "@/components/time-ago";
import type { Testimonial } from "../../payload-types";

// ---------------------------------------------------------------------------
// Testimonial grid (reviews page)
// ---------------------------------------------------------------------------
//
// One card per review, whether written on our form, entered from Google,
// Clutch etc., or pulled live from Google. Every part but the author is
// optional: the client's logo (linking to their website when known); the star
// rating and how long ago it was given; the quote (rich text from Payload,
// plain text from Google); and the author with their photo or initials and
// where the review was left. Copy lives in the `Testimonial21` messages.

export type ReviewSource = Testimonial["source"];

export type Testimonial21Item = {
  source: ReviewSource;
  quote?: SerializedEditorState | string;
  // Without a name (e.g. a review entered without its author), it shows as
  // anonymous.
  author: {
    name?: string;
    role?: string;
    image?: string;
  };
  company?: {
    name: string;
    logo?: string;
    link?: string;
  };
  rating?: number;
  date?: string;
};

interface Testimonial21Props {
  testimonials: Testimonial21Item[];
  className?: string;
}

// "Jane Doe" -> "JD", "Acme" -> "A".
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const Testimonial21 = ({ testimonials, className }: Testimonial21Props) => {
  const t = useTranslations("Testimonial21");

  return (
    <section className={cn("py-32", className)}>
      <div>
        <div className="container flex flex-col gap-6 py-4 lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <Handshake className="size-4" aria-hidden="true" />
            <span>{t("badge")}</span>
          </Badge>
          <h1 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
            {t("heading")}
          </h1>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <p className="container mt-10 text-muted-foreground md:mt-14">{t("empty")}</p>
      ) : (
        <div className="container mt-10 grid auto-rows-fr gap-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const { source, quote, author: rawAuthor, company, rating, date } = testimonial;
            const author = { ...rawAuthor, name: rawAuthor.name || t("anonymous") };

            const logo = company ? (
              company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- client logos have no known dimensions; sized by height via CSS.
                <img
                  loading="lazy"
                  decoding="async"
                  src={company.logo}
                  alt={t("logoAlt", { name: company.name })}
                  className="h-9 w-auto max-w-[140px] object-contain object-left dark:invert"
                />
              ) : (
                <span className="text-lg font-semibold">{company.name}</span>
              )
            ) : null;

            const subtitle = company
              ? author.role
                ? t("roleAt", { role: author.role, company: company.name })
                : author.name !== company.name
                  ? company.name
                  : undefined
              : author.role;

            return (
              <Card
                key={index}
                className="flex flex-col gap-6 rounded-md bg-white p-6 shadow-sm dark:bg-card"
              >
                {company &&
                  (company.link ? (
                    <a href={company.link} target="_blank" rel={EXTERNAL_LINK_REL} className="w-fit">
                      {logo}
                    </a>
                  ) : (
                    <div className="w-fit">{logo}</div>
                  ))}

                {(rating || date) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {rating ? (
                      <span
                        role="img"
                        aria-label={t("ratingLabel", { rating })}
                        className="flex gap-px"
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            aria-hidden="true"
                            className={cn(
                              "size-3",
                              star <= rating
                                ? "fill-[#FBBC05] text-[#FBBC05]"
                                : "text-muted-foreground/40",
                            )}
                          />
                        ))}
                      </span>
                    ) : null}
                    {date && <TimeAgo date={date} />}
                  </div>
                )}

                {quote && (
                  <blockquote className="text-lg font-normal text-muted-foreground italic">
                    <ClampedQuote moreLabel={t("readFull")}>
                      {typeof quote === "string" ? (
                        <p className="whitespace-pre-line">{quote}</p>
                      ) : (
                        <RichText data={quote} className="space-y-3" />
                      )}
                    </ClampedQuote>
                  </blockquote>
                )}

                <div className="mt-auto flex items-center gap-4">
                  <Avatar className="size-12">
                    {author.image && (
                      <AvatarImage
                        src={author.image}
                        alt={t("photoAlt", { name: author.name })}
                        referrerPolicy="no-referrer"
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback>{initials(author.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg tracking-[-0.36px]">{author.name}</p>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      {source === "google" && <GoogleLogo className="size-3.5" />}
                      {t(`sources.${source}`)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

export { Testimonial21 };
