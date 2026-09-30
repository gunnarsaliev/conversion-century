import { cn } from "cn";

import { Badge } from "@/components/ui/badge";

interface Hero297Badge {
  text: string;
}

interface Hero297Props {
  heading: string;
  description: string;
  badge?: Hero297Badge;
  className?: string;
}

const Hero297 = ({ badge, heading, description, className }: Hero297Props) => {
  return (
    <section className={cn("py-12 md:py-20", className)}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-8 lg:max-w-xl">
            {badge && (
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                {badge.text}
              </Badge>
            )}
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-pretty md:text-5xl lg:text-6xl">
              {heading}
            </h1>
          </div>
          <div className="w-full lg:max-w-xl">
            <div className="flex max-w-4xl flex-col gap-6 text-lg text-muted-foreground">
              {description
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero297, type Hero297Props };
