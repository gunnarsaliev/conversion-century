import { Handshake } from "lucide-react";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import { useTranslations } from "next-intl";
import { RichText } from "@/components/rich-text";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Testimonial grid (reviews page)
// ---------------------------------------------------------------------------
//
// One card per approved testimonial: the client's logo (linking to their
// website when known), the quote as rich text, and the author with their
// photo or initials. Copy lives in the `Testimonial21` messages.

export type Testimonial21Item = {
  quote: SerializedEditorState;
  author: {
    name: string;
    role?: string;
    image?: string;
  };
  company: {
    name: string;
    logo?: string;
    link?: string;
  };
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
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
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
        <div className="container mt-10 grid gap-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const { author, company } = testimonial;
            const logo = company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- client logos have no known dimensions; sized by height via CSS.
              <img
                src={company.logo}
                alt={t("logoAlt", { name: company.name })}
                className="h-9 w-auto max-w-[140px] object-contain object-left dark:invert"
              />
            ) : (
              <span className="text-lg font-semibold">{company.name}</span>
            );

            return (
              <Card
                key={index}
                className="flex flex-col gap-6 rounded-md bg-background p-6 shadow-sm"
              >
                {company.link ? (
                  <a
                    href={company.link}
                    target="_blank"
                    rel={EXTERNAL_LINK_REL}
                    className="w-fit"
                  >
                    {logo}
                  </a>
                ) : (
                  <div className="w-fit">{logo}</div>
                )}

                <blockquote className="text-lg font-normal text-muted-foreground italic">
                  <RichText data={testimonial.quote} className="space-y-3" />
                </blockquote>

                <div className="mt-auto flex items-center gap-4">
                  <Avatar className="size-12">
                    {author.image && (
                      <AvatarImage
                        src={author.image}
                        alt={t("photoAlt", { name: author.name })}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback>{initials(author.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg tracking-[-0.36px]">{author.name}</p>
                    <p className="text-muted-foreground">
                      {author.role
                        ? t("roleAt", { role: author.role, company: company.name })
                        : company.name}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12 h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export { Testimonial21 };
