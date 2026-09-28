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
            <p className="max-w-4xl text-lg whitespace-pre-line text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero297, type Hero297Props };
