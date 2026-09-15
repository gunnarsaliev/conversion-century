import { Check } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { Button } from "@/components/ui/button";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "services",
    locale: locale as "en" | "bg",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });

  const service = docs[0] ?? null;

  if (!service) {
    notFound();
  }

  const image =
    service.image && typeof service.image === "object" ? service.image : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-poppins text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            {service.name}
          </h1>
          {service.shortDescription && (
            <p className="mt-4 text-lg text-muted-foreground">
              {service.shortDescription}
            </p>
          )}
          {typeof service.price === "number" && (
            <p className="mt-4 text-2xl font-semibold">
              €{service.price.toLocaleString()}
            </p>
          )}
          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        {image?.url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src={image.url}
              alt={image.alt ?? service.name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {service.about && service.about.length > 0 && (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.about.map((item, i) => (
            <div key={item.id ?? i} className="rounded-2xl border p-6">
              {item.name && (
                <h3 className="text-lg font-semibold">{item.name}</h3>
              )}
              {item.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {service.description && (
        <div className="prose dark:prose-invert mt-16 max-w-none">
          <RichText data={service.description} />
        </div>
      )}

      {service.includes && service.includes.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold">What&rsquo;s included</h2>
          <div className="mt-6 flex flex-col gap-8">
            {service.includes.map((item, i) => (
              <div key={item.id ?? i} className="flex gap-3">
                <Check className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  {item.name && (
                    <h3 className="font-semibold">{item.name}</h3>
                  )}
                  {item.description && (
                    <div className="prose dark:prose-invert mt-1 max-w-none text-sm">
                      <RichText data={item.description} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
