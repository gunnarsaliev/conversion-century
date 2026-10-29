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
  return staticPageMetadata("services");
}

// Cached across requests; refreshed when the collection changes.
async function getServices(locale: string) {
  "use cache";
  cmsCache("services", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "services",
    locale: locale as "en" | "bg",
    where: translated,
    depth: 1,
    limit: 100,
    sort: "name",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ServicesPage");

  const { docs: services } = await getServices(locale);

  return (
    <>
      <StaticPageJsonLd
        page="services"
        items={services.map((service) => ({
          name: service.name,
          path: `/services/${service.slug ?? service.id}`,
        }))}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {services.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const image =
                service.image && typeof service.image === "object"
                  ? service.image
                  : null;

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug ?? service.id}`}
                  className="group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    {image?.url && (
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt ?? service.name}
                          fill
                          // 1 / 2 / 3 columns inside the 80rem container.
                          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-4">
                      {service.hero?.description && (
                        <p className="text-sm text-muted-foreground">
                          {service.hero?.description}
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
