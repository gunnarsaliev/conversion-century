import { ArrowRight, Clock, MapPin, Timer } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
const jobs = [
  {
    title: "Part-time position",
    hours: "20 h/week",
    city: "Sofia, Bulgaria",
    type: "Part-time",
    link: "#",
  },
  {
    title: "Full-time position",
    hours: "40 h/week",
    city: "Sofia, Bulgaria",
    type: "Full-time",
    link: "#",
  },
];

interface Careers2Props {
  className?: string;
}

const Careers2 = ({ className }: Careers2Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container px-1">
        <div className="border-x border-dashed">
          <div className="relative flex flex-col gap-6 border-b border-dashed px-4 pt-10 pb-10 sm:items-center md:pb-20">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,transparent_60%,#000_100%)] bg-[size:64px_64px]"></div>
            <Badge variant="outline" className="w-fit">
              Careers available
            </Badge>
            <h1 className="text-2xl font-bold md:text-4xl">Open positions</h1>
            <div className="max-w-2xl space-y-4 text-center text-muted-foreground">
              <p>
                Are you looking for a new career? We&apos;re looking for amazing
                people to join our team! If you think you have what it takes to
                be a part of our ever-growing company, check out our open
                positions below and apply now!
              </p>
              <p>
                Due to our rapid growth, we are looking for motivated people to
                join our team. One for part-time (20 h/week) and one for
                full-time (40 h/week), Sofia, Bulgaria.
              </p>
            </div>
          </div>
          <div>
            {jobs.map((job) => (
              <div
                key={job.title}
                className="grid items-center gap-6 border-b border-dashed px-6 py-10 lg:grid-cols-4"
              >
                <h2 className="text-lg">{job.title}</h2>
                <div className="col-span-2 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8 lg:justify-center">
                  <div className="flex gap-2">
                    <Clock className="h-auto w-4" />
                    {job.type}
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="h-auto w-4" />
                    {job.city}
                  </div>
                  <div className="flex gap-2">
                    <Timer className="h-auto w-4" />
                    {job.hours}
                  </div>
                </div>
                <a
                  href={job.link}
                  className={cn(buttonVariants(), "w-fit gap-1 lg:ml-auto text-white")}
                >
                  Apply
                  <ArrowRight className="h-auto w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Careers2 };
