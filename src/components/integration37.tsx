import { cn } from "cn";

export interface Integration37Pill {
  name: string;
  src: string;
}

interface Integration37Props {
  label?: string;
  heading: string;
  description?: string;
  pills: Integration37Pill[];
  className?: string;
}

const Integration37 = ({
  label,
  heading,
  description,
  pills,
  className,
}: Integration37Props) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16">
            <div className="flex shrink-0 flex-col gap-3 md:w-72">
              {label && (
                <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                  {label}
                </span>
              )}
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {heading}
              </h2>
              {description && (
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            <ul className="flex flex-1 flex-wrap gap-2.5">
              {pills.map((pill) => (
                <li
                  key={pill.name}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2"
                >
                  <img src={pill.src} alt="" className="h-4 w-auto" />
                  <span className="text-xs font-medium">{pill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Integration37 };
