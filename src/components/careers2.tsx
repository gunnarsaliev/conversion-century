import { ArrowRight, Clock, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
export interface Careers2Job {
  title: string;
  type: string;
  location?: string | null;
  link: string;
}

interface Careers2Props {
  jobs: Careers2Job[];
  className?: string;
}

const Careers2 = ({ jobs, className }: Careers2Props) => {
  const t = useTranslations("Careers.list");

  return (
    <section className={cn("py-32", className)}>
      <div className="container px-1">
        <div className="border-x border-dashed">
          <div className="relative flex flex-col gap-6 border-b border-dashed px-4 pt-10 pb-10 sm:items-center md:pb-20">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,transparent_60%,#000_100%)] bg-[size:64px_64px]"></div>
            <Badge variant="outline" className="w-fit">
              {t("badge")}
            </Badge>
            <p className="text-2xl font-bold md:text-4xl">{t("heading")}</p>
            <div className="max-w-2xl space-y-4 text-center text-muted-foreground">
              <p>{t("intro")}</p>
              <p>{t("growth")}</p>
            </div>
          </div>
          <div>
            {jobs.length === 0 && (
              <p className="border-b border-dashed px-6 py-10 text-center text-muted-foreground">
                {t("empty")}
              </p>
            )}
            {jobs.map((job) => (
              <div
                key={job.link}
                className="grid items-center gap-6 border-b border-dashed px-6 py-10 lg:grid-cols-4"
              >
                <h2 className="text-lg">{job.title}</h2>
                <div className="col-span-2 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8 lg:justify-center">
                  <div className="flex gap-2">
                    <Clock className="h-auto w-4" />
                    {job.type}
                  </div>
                  {job.location && (
                    <div className="flex gap-2">
                      <MapPin className="h-auto w-4" />
                      {job.location}
                    </div>
                  )}
                </div>
                <Link
                  href={job.link}
                  className={cn(buttonVariants(), "w-fit gap-1 lg:ml-auto text-white")}
                >
                  {t("apply")}
                  <ArrowRight className="h-auto w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Careers2 };
