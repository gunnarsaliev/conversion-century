import { cn } from "cn";

interface Feature99Step {
  title: string;
  description?: string | null;
  /** Shown in place of the step number. */
  icon?: React.ReactNode;
  /** Optional bullet points under the description. */
  items?: string[];
}

interface Feature99Props {
  /** Pass `null` to render without a heading (e.g. inside a titled section). */
  heading?: string | null;
  steps: Feature99Step[];
  note?: string | null;
  /** Steps per row from `md` up. */
  columns?: 2 | 3;
  className?: string;
}

const Feature99 = ({ heading, steps, note, columns = 3, className }: Feature99Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        {heading && <h2 className="mb-11 text-3xl lg:text-5xl">{heading}</h2>}
        <div
          className={cn("grid gap-8", columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}
        >
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-1 pr-4">
              {step.icon ?? <span className="font-mono text-4xl lg:text-6xl">{i + 1}</span>}
              <h3 className="mt-2 text-xl font-medium">{step.title}</h3>
              {step.description && (
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              )}
              {step.items && step.items.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {note && (
            <div className="flex items-center rounded-lg bg-yellow-50 p-6 md:p-8">
              <p className="text-sm text-muted-foreground"><span className="font-bold">Note:</span> {note}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Feature99, type Feature99Props };
