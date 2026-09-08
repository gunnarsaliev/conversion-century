import {
  Bell,
  ChevronRight,
  LayoutDashboard,
  Mail,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roleVariant: Record<string, "default" | "secondary"> = {
  admin: "default",
  user: "secondary",
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

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const avatar =
    user.profileImage && typeof user.profileImage === "object"
      ? user.profileImage
      : null;

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
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

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {name}
            </h1>
            {user.jobTitle ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {user.jobTitle}
              </p>
            ) : null}
            <Badge
              variant={roleVariant[user.role] ?? "secondary"}
              className="mt-1 capitalize"
            >
              {user.role}
            </Badge>
          </div>
          {avatar?.url ? (
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full">
              <Image
                src={avatar.url}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-24 shrink-0 items-center justify-center rounded-full border bg-muted text-lg font-medium text-muted-foreground">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {user.email ? (
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                <a href={`mailto:${user.email}`} className="hover:underline">
                  {user.email}
                </a>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
