import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDashed,
  FileText,
  Globe,
  Info,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { AccountManagerBadge } from "@/components/dashboard/account-manager-badge";
import { ClientLogo } from "@/components/dashboard/client-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const statusBadgeClassName: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  lead: "bg-amber-100 text-amber-800",
  inactive: "bg-muted text-muted-foreground",
};

const checklistStatusLabel: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  done: "Done",
};

const checklistStatusBadgeClassName: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

type ChecklistEntry = {
  id: string | number;
  status: string;
  notes?: string | null;
  completedAt?: string | null;
  name: string;
  type?: string | null;
  priority?: string | null;
  team?: string | null;
  label?: string | null;
  shortDescription?: SerializedEditorState | null;
};

const ChecklistEntryHoverCard = ({ entry }: { entry: ChecklistEntry }) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        className="inline-flex shrink-0 cursor-default items-center rounded-full text-muted-foreground outline-none hover:text-foreground"
        aria-label={`${entry.name} details`}
      >
        <Info className="size-3.5" />
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium">{entry.name}</p>
          <Badge
            className={
              checklistStatusBadgeClassName[entry.status] ??
              checklistStatusBadgeClassName.pending
            }
          >
            {checklistStatusLabel[entry.status] ?? entry.status}
          </Badge>
        </div>
        {entry.shortDescription ? (
          <div className="prose prose-sm dark:prose-invert mt-2 max-w-none text-xs [&_p]:my-1">
            <RichText data={entry.shortDescription} />
          </div>
        ) : null}
        <dl className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          {entry.type ? (
            <div className="flex justify-between gap-2">
              <dt>Type</dt>
              <dd className="text-right text-foreground">{entry.type}</dd>
            </div>
          ) : null}
          {entry.team ? (
            <div className="flex justify-between gap-2">
              <dt>Team</dt>
              <dd className="text-right text-foreground capitalize">
                {entry.team}
              </dd>
            </div>
          ) : null}
          {entry.priority ? (
            <div className="flex justify-between gap-2">
              <dt>Priority</dt>
              <dd className="text-right text-foreground capitalize">
                {entry.priority}
              </dd>
            </div>
          ) : null}
          {entry.label ? (
            <div className="flex justify-between gap-2">
              <dt>Label</dt>
              <dd className="text-right text-foreground capitalize">
                {entry.label}
              </dd>
            </div>
          ) : null}
          {entry.completedAt ? (
            <div className="flex justify-between gap-2">
              <dt>Completed</dt>
              <dd className="text-right text-foreground">
                {new Date(entry.completedAt).toLocaleDateString()}
              </dd>
            </div>
          ) : null}
        </dl>
        {entry.notes ? (
          <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">
            {entry.notes}
          </p>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
};

type ClientPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params;

  const payload = await getPayload({ config });

  const client = await payload
    .findByID({
      collection: "clients",
      id,
      depth: 2,
    })
    .catch(() => null);

  if (!client || client.status === "lead") {
    notFound();
  }

  const checklistProgress = await payload.find({
    collection: "client-checklist-progress",
    where: { client: { equals: id } },
    depth: 1,
    limit: 500,
    sort: "checklistItem",
  });

  const checklistEntries = checklistProgress.docs
    .map((entry) => {
      const checklistItem =
        entry.checklistItem && typeof entry.checklistItem === "object"
          ? entry.checklistItem
          : null;

      return {
        id: entry.id,
        status: entry.status,
        notes: entry.notes,
        completedAt: entry.completedAt,
        name: checklistItem?.name ?? null,
        type: checklistItem?.type ?? null,
        priority: checklistItem?.priority ?? null,
        team: checklistItem?.team ?? null,
        label: checklistItem?.label ?? null,
        shortDescription: checklistItem?.shortDescription ?? null,
      };
    })
    .filter((entry) => Boolean(entry.name)) as {
    id: string | number;
    status: string;
    notes?: string | null;
    completedAt?: string | null;
    name: string;
    type?: string | null;
    priority?: string | null;
    team?: string | null;
    label?: string | null;
    shortDescription?: SerializedEditorState | null;
  }[];

  const doneItems = checklistEntries.filter((entry) => entry.status === "done");
  const notDoneItems = checklistEntries.filter(
    (entry) => entry.status !== "done",
  );

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
    {
      label: "Checklist Done",
      value: doneItems.length,
      icon: CheckCircle2,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>Overview</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link href="/dashboard/clients" className="hover:text-foreground">
            Clients
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
                  <Badge key={service.id} variant="outline">
                    {service.name}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {checklistEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Checklist ({doneItems.length}/{checklistEntries.length}{" "}
                  done)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Done
                  </p>
                  {doneItems.length > 0 ? (
                    <ul className="flex flex-col gap-1.5 text-sm">
                      {doneItems.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2
                            className="size-3.5 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span className="flex-1 truncate">
                            {entry.name}
                          </span>
                          <ChecklistEntryHoverCard entry={entry} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">None yet.</p>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Not Done
                  </p>
                  {notDoneItems.length > 0 ? (
                    <ul className="flex flex-col gap-1.5 text-sm">
                      {notDoneItems.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-center gap-2"
                        >
                          {entry.status === "in-progress" ? (
                            <CircleDashed
                              className="size-3.5 shrink-0 text-amber-600"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              className="size-3.5 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                          <span className="flex-1 truncate">
                            {entry.name}
                          </span>
                          <ChecklistEntryHoverCard entry={entry} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Everything&apos;s done.
                    </p>
                  )}
                </div>
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
                  <div className="mt-1">
                    <AccountManagerBadge
                      id={accountManager.id}
                      name={
                        [accountManager.firstName, accountManager.lastName]
                          .filter(Boolean)
                          .join(" ") || accountManager.email
                      }
                      avatarUrl={
                        accountManager.profileImage &&
                        typeof accountManager.profileImage === "object"
                          ? accountManager.profileImage.url
                          : null
                      }
                      avatarSize="6"
                    />
                  </div>
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
