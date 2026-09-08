import {
  Bell,
  ChevronRight,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { ClientLogo } from "@/components/dashboard/client-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  lead: "secondary",
  inactive: "outline",
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

  const accountManager =
    client["Account Manager"] &&
    typeof client["Account Manager"] === "object"
      ? client["Account Manager"]
      : null;

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

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
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

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {client.companyName}
            </h1>
            <Badge
              variant={statusVariant[client.status] ?? "outline"}
              className="mt-1 capitalize"
            >
              {client.status}
            </Badge>
          </div>
          {logo?.url ? (
            <ClientLogo
              companyName={client.companyName}
              logoUrl={logo.url}
              logoWidth={logo.width}
              logoHeight={logo.height}
              size={96}
            />
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start">
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
                  <Badge key={service.id} variant="outline">
                    {service.name}
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
              {accountManager ? (
                <div>
                  <p className="text-muted-foreground">Account Manager</p>
                  <p>
                    {[accountManager.firstName, accountManager.lastName]
                      .filter(Boolean)
                      .join(" ") || accountManager.email}
                  </p>
                </div>
              ) : null}
              {publishers.length > 0 ? (
                <div>
                  <p className="text-muted-foreground">Publishers</p>
                  <ul className="mt-1 flex flex-col gap-1">
                    {publishers.map((publisher) => (
                      <li key={publisher.id}>
                        {[publisher.firstName, publisher.lastName]
                          .filter(Boolean)
                          .join(" ") || publisher.email}
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
