import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { translated } from "@/utilities/findByLocalizedSlug";

export async function generateMetadata() {
  return staticPageMetadata("solutions");
}

// Cached across requests; refreshed when the collection changes.
async function getSolutions(locale: string) {
  "use cache";
  cmsCache("solutions", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "solutions",
    locale: locale as "en" | "bg",
    where: translated,
    depth: 1,
    limit: 100,
    sort: "name",
  });
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("SolutionsPage");

  const { docs: solutions } = await getSolutions(locale);

  return (
    <>
      <StaticPageJsonLd
        page="solutions"
        items={solutions.map((solution) => ({
          name: solution.name,
          path: `/solutions/${solution.slug ?? solution.id}`,
        }))}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {solutions.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            {t("empty")}
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
                  href={`/solutions/${solution.slug ?? solution.id}`}
                  className="group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    {image?.url && (
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt ?? solution.name}
                          fill
                          // 1 / 2 / 3 columns inside the 80rem container.
                          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <h3>{solution.name}</h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-4">
                      {summary && (
                        <p className="text-sm text-muted-foreground">
                          {summary}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {t("learnMore")}
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
    </>
  );
}
