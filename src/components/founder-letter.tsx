import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface Image {
  src: string;
  alt: string;
}

interface FounderLetterProps {
  eyebrow?: string;
  heading?: string;
  portrait?: Image;
  quote?: string;
  name?: string;
  role?: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

const defaultProps: Required<
  Omit<FounderLetterProps, "className">
> = {
  eyebrow: "A Personal Commitment",
  heading: "From the Owner",
  portrait: {
    src: "https://pub-76ccbd1b05d242bb95e33c78f3b52f32.r2.dev/maria-avatar-image.png",
    alt: "Portrait of Maria Sivkova",
  },
  quote:
    "Conversion Century is much more than a company to me. I have grown alongside it, dedicated my professional life to SEO and built a team of people who care about our clients as deeply as I do. That is why I remain personally involved in every business that places its trust in us.\n\nWhen we take on a client, I want to understand what they are building, why it matters and what success would mean for their company. Their website becomes something I think about, question and genuinely want to improve, not simply another project in a report.\n\nThat commitment also requires honesty. We accept projects where we believe we can create meaningful value, and we expect trust, responsiveness and dedication from our clients in return. Our best results happen when both teams care about the outcome and work toward the same goal.",
  name: "Maria Sivkova",
  role: "Owner and Managing Director, Conversion Century",
  ctaText: "Meet Maria and the Team",
  ctaUrl: "/website/team",
};

type Props = Partial<FounderLetterProps>;

const FounderLetter = (props: Props) => {
  const {
    eyebrow,
    heading,
    portrait,
    quote,
    name,
    role,
    ctaText,
    ctaUrl,
    className,
  } = {
    ...defaultProps,
    ...props,
  };

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
              <img
                src={portrait.src}
                alt={portrait.alt}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
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
                  className="bg-yellow-400 p-6 rounded-full hover:bg-yellow-300"
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
