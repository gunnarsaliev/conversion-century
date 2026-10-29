import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/cms-image";

interface Image {
  src: string;
  alt: string;
}

interface FounderLetterProps {
  eyebrow?: string;
  heading?: string;
  portrait?: Image;
  /** Optional paragraphs shown above the quote (separated by blank lines). */
  intro?: string;
  quote?: string;
  name?: string;
  role?: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

const PORTRAIT_SRC =
  "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/maria-avatar-image.png";

type Props = Partial<FounderLetterProps>;

const FounderLetter = (props: Props) => {
  const t = useTranslations("FounderLetter");
  const {
    eyebrow = t("eyebrow"),
    heading = t("heading"),
    portrait = { src: PORTRAIT_SRC, alt: t("portraitAlt") },
    intro,
    quote = t("quote"),
    name = t("name"),
    role = t("role"),
    ctaText = t("cta"),
    ctaUrl = "/about#team",
    className,
  } = props;

  const paragraphs = quote.split("\n\n");

  return (
    <section className={className}>
      <div className="container mx-auto py-16 lg:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
              {heading}
            </h2>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start lg:gap-16">
          {portrait && (
            <div className="mx-auto aspect-3/4 w-full max-w-xs overflow-hidden rounded-2xl bg-muted lg:mx-0">
              <CmsImage
                src={portrait.src}
                alt={portrait.alt}
                sizes="320px"
                wrapperClassName="h-full w-full"
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
            {intro && (
              <div className="flex flex-col gap-4 text-base text-muted-foreground">
                {intro.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            <blockquote className="flex flex-col gap-4 text-lg text-balance lg:text-xl">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>
                  {index === 0 && "“"}
                  {paragraph}
                  {index === paragraphs.length - 1 && "”"}
                </p>
              ))}
            </blockquote>

            <div>
              {name && <p className="font-semibold">{name}</p>}
              {role && (
                <p className="text-sm text-muted-foreground">{role}</p>
              )}
            </div>

            {ctaText && ctaUrl && (
              <div>
                <Button
                  variant="outline"
                  className="bg-warning p-6 rounded-full hover:bg-warning/85"
                  render={<Link href={ctaUrl} />}
                  nativeButton={false}
                >
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { FounderLetter };
