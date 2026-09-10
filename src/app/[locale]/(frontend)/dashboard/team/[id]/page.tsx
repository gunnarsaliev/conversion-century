import {
  Bell,
  ChevronRight,
  FileEdit,
  LayoutDashboard,
  Mail,
  Megaphone,
  Search,
  Users,
} from "lucide-react";
import Image from "next/image";
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

const roleBadgeClassName: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  user: "bg-muted text-muted-foreground",
};

type TeamMemberPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamMemberPage({
  params,
}: TeamMemberPageProps) {
  const { id } = await params;

  const payload = await getPayload({ config });

  const user = await payload
    .findByID({
      collection: "users",
      id,
      depth: 1,
    })
    .catch(() => null);

  if (!user) {
    notFound();
  }

  const [managedClients, publishedClients, copywritingClients] =
    await Promise.all([
      payload.find({
        collection: "clients",
        where: { "Account Manager": { equals: id } },
        depth: 1,
        limit: 100,
      }),
      payload.find({
        collection: "clients",
        where: { Publisher: { equals: id } },
        depth: 1,
        limit: 100,
      }),
      payload.find({
        collection: "clients",
        where: { Copywriter: { equals: id } },
        depth: 1,
        limit: 100,
      }),
    ]);

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const avatar =
    user.profileImage && typeof user.profileImage === "object"
      ? user.profileImage
      : null;

  const clientGroups: {
    label: string;
    icon: typeof Users;
    docs: (typeof managedClients)["docs"];
  }[] = [
    { label: "Managed Clients", icon: Users, docs: managedClients.docs },
    {
      label: "Publishing For",
      icon: Megaphone,
      docs: publishedClients.docs,
    },
    {
      label: "Copywriting For",
      icon: FileEdit,
      docs: copywritingClients.docs,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 sm:pb-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>Overview</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link href="/dashboard/team" className="hover:text-foreground">
            Team
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{name}</span>
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
                {avatar?.url ? (
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-card sm:size-32">
                    <Image
                      src={avatar.url}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-card bg-muted text-2xl font-medium text-muted-foreground sm:size-32">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-muted-foreground">
                  <Badge
                    className={
                      roleBadgeClassName[user.role] ?? roleBadgeClassName.user
                    }
                  >
                    <span className="capitalize">{user.role}</span>
                  </Badge>
                  {user.jobTitle && (
                    <span> {user.jobTitle}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Contact links */}
            <div className="mt-4 flex items-center gap-2">
              {user.email && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  render={<a href={`mailto:${user.email}`} />}
                  nativeButton={false}
                >
                  <Mail className="size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clientGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {group.label}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {group.docs.length}
                  </div>
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
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {user.email ? (
                <div className="flex items-center gap-2">
                  <Mail
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:underline"
                  >
                    {user.email}
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="flex min-h-0 flex-col gap-4 sm:gap-6">
          {clientGroups.map((group) =>
            group.docs.length > 0 ? (
              <Card key={group.label}>
                <CardHeader>
                  <CardTitle>{group.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col text-sm">
                  {group.docs.map((client, index) => {
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
                          index < group.docs.length - 1 ? "border-b" : ""
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
            ) : null,
          )}
        </div>
      </div>
    </>
  );
}
