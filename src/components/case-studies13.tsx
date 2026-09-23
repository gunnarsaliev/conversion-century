import { cn } from "cn";

import { Link } from "@/i18n/navigation";

export interface CaseStudies13Item {
  title: string;
  client?: string;
  overview?: string;
  metric?: string;
  metricLabel?: string;
  image?: string;
  href: string;
}

interface CaseStudies13Props {
  eyebrow?: string;
  heading?: string;
  cases: CaseStudies13Item[];
  className?: string;
}

const CaseStudies13 = ({
  eyebrow = "Case studies",
  heading = "Work that moved the needle.",
  cases,
  className,
}: CaseStudies13Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {heading}
          </h1>
        </div>

        {cases.length === 0 ? (
          <p className="text-muted-foreground">
            There are no case studies yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cases.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border transition-colors hover:border-primary/30"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.title}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {c.metric && (
                    <>
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-4xl leading-none font-black tracking-tighter text-background tabular-nums">
                          {c.metric}
                        </span>
                        {c.metricLabel && (
                          <p className="mt-0.5 text-xs text-background/60">
                            {c.metricLabel}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 bg-card p-5">
                  {c.client && (
                    <p className="text-xs font-medium text-muted-foreground">
                      {c.client}
                    </p>
                  )}
                  <h2 className="text-base leading-tight font-bold tracking-tight text-foreground">
                    {c.title}
                  </h2>
                  {c.overview && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                      {c.overview}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { CaseStudies13 };
