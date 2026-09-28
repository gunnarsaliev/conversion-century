import { cn } from "cn";

interface Feature99Step {
  title: string;
  description?: string | null;
}

interface Feature99Props {
  heading: string;
  steps: Feature99Step[];
  note?: string | null;
  className?: string;
}

const Feature99 = ({ heading, steps, note, className }: Feature99Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <h2 className="mb-11 text-3xl lg:text-5xl">{heading}</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 border-l pr-4 pl-4 md:pl-8"
            >
              <span className="font-mono text-4xl lg:text-6xl">{i + 1}</span>
              <h3 className="mt-2 text-xl font-medium">{step.title}</h3>
              {step.description && (
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          ))}
          {note && (
            <div className="flex items-center rounded-lg bg-yellow-50 p-6 md:p-8">
              <p className="text-sm text-muted-foreground">{note}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Feature99, type Feature99Props };
