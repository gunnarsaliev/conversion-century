import { cn } from "cn";

interface Logo {
  src: string;
  alt: string;
  srcDark?: string;
  className?: string;
}

interface LogosGridStaticProps {
  logos: Logo[];
  className?: string;
}

type Props = Partial<LogosGridStaticProps>;

const defaultProps: LogosGridStaticProps = {
  logos: [
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-1.svg",
      alt: "Company logo 1",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-2.svg",
      alt: "Company logo 2",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-3.svg",
      alt: "Company logo 3",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-4.svg",
      alt: "Company logo 4",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-5.svg",
      alt: "Company logo 5",
      className: "h-5 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-6.svg",
      alt: "Company logo 6",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-7.svg",
      alt: "Company logo 7",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-8.svg",
      alt: "Company logo 8",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-9.svg",
      alt: "Company logo 9",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-10.svg",
      alt: "Company logo 10",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-11.svg",
      alt: "Company logo 11",
      className: "h-7 w-auto",
    },
    {
      src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/logos/fictional-company-logo-12.svg",
      alt: "Company logo 12",
      className: "h-7 w-auto",
    },
  ],
};

const Logos30 = (props: Props) => {
  const { logos, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto">
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-8 lg:gap-y-3">
          {logos.map((logo, index) => (
            <div
              key={`${logo.src}-${index}`}
              className="flex h-16 items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                // `m-0` so a surrounding `prose` doesn't add its image margins.
                className="m-0 h-auto max-h-12 w-auto max-w-full object-contain opacity-70 grayscale dark:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Logos30 };
