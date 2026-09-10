import {
  Bell,
  ChevronRight,
  FileText,
  Globe,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { AccountManagerBadge } from "@/components/dashboard/account-manager-badge";
import { ClientLogo } from "@/components/dashboard/client-logo";
import { regionLabel } from "@/lib/regions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusBadgeClassName: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  lead: "bg-amber-100 text-amber-800",
  inactive: "bg-muted text-muted-foreground",
};

type LeadPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadPage({ params }: LeadPageProps) {
  const { id } = await params;

  const payload = await getPayload({ config });

  const client = await payload
    .findByID({
      collection: "clients",
      id,
      depth: 2,
    })
    .catch(() => null);

  if (!client || client.status !== "lead") {
    notFound();
  }

  const accountManagers = (client["Account Manager"] ?? []).filter(
    (manager): manager is Exclude<typeof manager, string | number> =>
      typeof manager === "object" && manager !== null,
  );

  const publishers = (client["Publisher"] ?? []).filter(
    (publisher): publisher is Exclude<typeof publisher, string | number> =>
      typeof publisher === "object" && publisher !== null,
  );

  const services = (client.services ?? []).filter(
    (service): service is Exclude<typeof service, string | number> =>
      typeof service === "object" && service !== null,
  );

  const logo =
    client.logo && typeof client.logo === "object" ? client.logo : null;

  const websiteLinks = client.websiteLinks ?? [];
  const reportUrls = client.reportUrls ?? [];

  const stats: {
    label: string;
    value: number;
    icon: typeof Users;
  }[] = [
    { label: "Services", value: services.length, icon: FileText },
    { label: "Publishers", value: publishers.length, icon: Users },
    { label: "Website Links", value: websiteLinks.length, icon: Globe },
    { label: "Reports", value: reportUrls.length, icon: FileText },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>Overview</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link href="/dashboard/leads" className="hover:text-foreground">
            Leads
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{client.companyName}</span>
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
              <div className="-mt-12 rounded-md border-4 border-card bg-card shadow-lg sm:-mt-16">
                <ClientLogo
                  companyName={client.companyName}
                  logoUrl={logo?.url}
                  logoWidth={logo?.width}
                  logoHeight={logo?.height}
                  size={128}
                />
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-bold">{client.companyName}</h1>
                <p className="text-muted-foreground">
                  <Badge
                    className={
                      statusBadgeClassName[client.status] ??
                      statusBadgeClassName.inactive
                    }
                  >
                    <span className="capitalize">{client.status}</span>
                  </Badge>
                  {client.contactName && (
                    <span>
                      {" "}
                      contact:{" "}
                      <span className="font-medium">
                        {client.contactName}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Contact links */}
            <div className="mt-4 flex items-center gap-2">
              {client.email && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  render={<a href={`mailto:${client.email}`} />}
                  nativeButton={false}
                >
                  <Mail className="size-4" />
                </Button>
              )}
              {client.phone && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  render={<a href={`tel:${client.phone}`} />}
                  nativeButton={false}
                >
                  <Phone className="size-4" />
                </Button>
              )}
              {websiteLinks[0]?.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  render={
                    <a
                      href={websiteLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                >
                  <Globe className="size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
        <div className="flex min-h-0 flex-col gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {client.description ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <RichText data={client.description} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No description yet.
                </p>
              )}
            </CardContent>
          </Card>

          {services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/dashboard/services/${service.id}`}
                  >
                    <Badge variant="outline">{service.name}</Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {client.region && client.region.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Region</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {client.region.map((region) => (
                  <Badge key={region} variant="outline">
                    {regionLabel(region)}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {client.notes ? (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {client.notes}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {client.contactName ? (
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p>{client.contactName}</p>
                </div>
              ) : null}
              {client.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                  <a href={`mailto:${client.email}`} className="hover:underline">
                    {client.email}
                  </a>
                </div>
              ) : null}
              {client.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
                  <a href={`tel:${client.phone}`} className="hover:underline">
                    {client.phone}
                  </a>
                </div>
              ) : null}
              {accountManagers.length > 0 ? (
                <div>
                  <p className="text-muted-foreground">Account Managers</p>
                  <ul className="mt-1 flex flex-col gap-2">
                    {accountManagers.map((manager) => (
                      <li key={manager.id}>
                        <AccountManagerBadge
                          id={manager.id}
                          name={
                            [manager.firstName, manager.lastName]
                              .filter(Boolean)
                              .join(" ") || manager.email
                          }
                          avatarUrl={
                            manager.profileImage &&
                            typeof manager.profileImage === "object"
                              ? manager.profileImage.url
                              : null
                          }
                          avatarSize="6"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {publishers.length > 0 ? (
                <div>
                  <p className="text-muted-foreground">Publishers</p>
                  <ul className="mt-1 flex flex-col gap-2">
                    {publishers.map((publisher) => (
                      <li key={publisher.id}>
                        <AccountManagerBadge
                          id={publisher.id}
                          name={
                            [publisher.firstName, publisher.lastName]
                              .filter(Boolean)
                              .join(" ") || publisher.email
                          }
                          avatarUrl={
                            publisher.profileImage &&
                            typeof publisher.profileImage === "object"
                              ? publisher.profileImage.url
                              : null
                          }
                          avatarSize="6"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {client.websiteLinks && client.websiteLinks.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Website Links</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                {client.websiteLinks.map((link, index) => (
                  <a
                    key={link.id ?? index}
                    href={link.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <LinkIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    <span className="truncate">{link.url}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {client.reportUrls && client.reportUrls.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                {client.reportUrls.map((link, index) => (
                  <a
                    key={link.id ?? index}
                    href={link.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <LinkIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    <span className="truncate">{link.url}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
