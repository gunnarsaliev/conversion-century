import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SolutionsPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: solutions } = await payload.find({
    collection: "solutions",
    locale: locale as "en" | "bg",
    depth: 1,
    limit: 100,
    sort: "name",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-poppins text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
          Our Solutions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore how we help businesses reach their organic growth goals.
        </p>
      </div>

      {solutions.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No solutions are available yet.
        </p>
      ) : (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => {
            const image =
              solution.image && typeof solution.image === "object"
                ? solution.image
                : null;
            const summary = solution.hero?.paragraphs?.split(/\n\s*\n/)[0];

            return (
              <Link
                key={solution.id}
                href={`/website/solutions/${solution.slug ?? solution.id}`}
                className="group"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  {image?.url && (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt ?? solution.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{solution.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4">
                    {summary && (
                      <p className="text-sm text-muted-foreground">
                        {summary}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Learn more
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
