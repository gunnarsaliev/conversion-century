import {
  Bell,
  Building2,
  ChevronRight,
  Euro,
  LayoutDashboard,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { ClientLogo } from "@/components/dashboard/client-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;

  const payload = await getPayload({ config });

  const service = await payload
    .findByID({
      collection: "services",
      id,
      depth: 1,
    })
    .catch(() => null);

  if (!service) {
    notFound();
  }

  const clientsUsingService = await payload.find({
    collection: "clients",
    where: { services: { equals: id } },
    depth: 1,
    limit: 100,
  });

  const image =
    service.image && typeof service.image === "object" ? service.image : null;

  const stats: { label: string; value: number }[] = [
    { label: "Clients", value: clientsUsingService.docs.length },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>Overview</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{service.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Search"
          >
            <Search className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            aria-label="Notifications"
          >
            <Bell className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="w-full space-y-4 sm:space-y-6">
        {/* Header card with cover — adapted from user-profile9.tsx */}
        <Card className="overflow-hidden pt-0">
          <div className="relative h-32 bg-muted sm:h-40">
            <Image
              src="https://pub-05efc1b2acd64b71beacdf66eed34654.r2.dev/banner-fallback.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-bottom"
              priority
            />
          </div>
          <CardContent className="relative pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <div className="-mt-12 sm:-mt-16">
                {image?.url ? (
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-card bg-background sm:size-32">
                    <Image
                      src={image.url}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-card bg-muted text-2xl font-medium text-muted-foreground sm:size-32">
                    {service.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-bold">{service.name}</h1>
                {service.shortDescription && (
                  <p className="text-muted-foreground">
                    {service.shortDescription}
                  </p>
                )}
              </div>
              {typeof service.price === "number" && (
                <Badge className="gap-1 bg-primary/10 text-primary">
                  <Euro className="size-3.5" aria-hidden="true" />
                  {service.price}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Building2 className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <div className="flex min-h-0 flex-col gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {service.description ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <RichText data={service.description} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No description yet.
                </p>
              )}
            </CardContent>
          </Card>

          {service.about && service.about.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {service.about.map((entry, index) => (
                  <div key={entry.id ?? index} className="flex gap-3">
                    {entry.icon && (
                      <Badge
                        variant="outline"
                        className="h-fit shrink-0 font-normal text-muted-foreground"
                      >
                        {entry.icon}
                      </Badge>
                    )}
                    <div className="space-y-0.5">
                      {entry.name && (
                        <p className="text-sm font-medium">{entry.name}</p>
                      )}
                      {entry.description && (
                        <p className="text-sm text-muted-foreground">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {service.includes && service.includes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {service.includes.map((entry, index) => (
                  <div key={entry.id ?? index}>
                    {entry.name && (
                      <p className="text-sm font-medium">{entry.name}</p>
                    )}
                    {entry.description && (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <RichText data={entry.description} />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex min-h-0 flex-col gap-4 sm:gap-6">
          {clientsUsingService.docs.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Clients</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-sm">
                {clientsUsingService.docs.map((client, index) => {
                  const logo =
                    client.logo && typeof client.logo === "object"
                      ? client.logo
                      : null;

                  return (
                    <Link
                      key={client.id}
                      href={`/dashboard/${
                        client.status === "lead" ? "leads" : "clients"
                      }/${client.id}`}
                      className={`flex items-center justify-between gap-2 py-2 hover:underline ${
                        index < clientsUsingService.docs.length - 1
                          ? "border-b"
                          : ""
                      }`}
                    >
                      <span>{client.companyName}</span>
                      <ClientLogo
                        companyName={client.companyName}
                        logoUrl={logo?.url}
                        logoWidth={logo?.width}
                        logoHeight={logo?.height}
                        size={20}
                        className="rounded-sm text-[10px]"
                      />
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
