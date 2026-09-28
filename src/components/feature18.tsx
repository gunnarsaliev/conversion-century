import { ChevronRight } from "lucide-react";
import { cn } from "cn";

interface Feature18Item {
  title: string;
  description?: string | null;
  icon?: React.ReactNode;
  href?: string;
}

interface Feature18Props {
  heading: string;
  description?: string | null;
  features: Feature18Item[];
  className?: string;
}

const Feature18 = ({
  heading,
  description,
  features,
  className,
}: Feature18Props) => {
  return (
    <section
      className={cn(
        "relative py-32 before:absolute before:inset-0 before:bg-primary/10 before:[mask-image:url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/waves.svg')] before:[mask-size:64px_32px] before:[mask-repeat:repeat]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent to-background"></div>
      <div className="container">
        <div className="relative">
          <h2 className="mb-8 max-w-xl text-2xl font-semibold tracking-tight text-balance lg:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="-mt-4 mb-8 max-w-2xl text-muted-foreground">
              {description}
            </p>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-10 rounded-lg border bg-background p-8"
              >
                <div>
                  {/* Icons hidden for now — restore this line and the h3's mt-6 to bring them back. */}
                  {/* {feature.icon} */}
                  <h3 className="mb-2 font-medium tracking-tight">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                </div>
                {feature.href && (
                  <a
                    href={feature.href}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    Learn more
                    <ChevronRight className="w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature18, type Feature18Props };
