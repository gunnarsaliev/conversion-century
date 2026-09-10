import { Bell, ChevronRight, LayoutDashboard, Search } from "lucide-react";
import { getPayload } from "payload";
import config from "@payload-config";

import {
  TeamMemberList,
  type TeamMemberListItem,
} from "@/components/dashboard/team-member-list";
import { Button } from "@/components/ui/button";

export default async function TeamPage() {
  const payload = await getPayload({ config });
  const [users, clients] = await Promise.all([
    payload.find({
      collection: "users",
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: "clients",
      depth: 1,
      limit: 500,
    }),
  ]);

  // Group clients by user id for each relationship, so each team member's
  // quick view can show which clients they manage / publish for / write
  // for without a separate query per member.
  const clientAvatar = (client: (typeof clients.docs)[number]) => ({
    id: client.id,
    companyName: client.companyName,
    logoUrl:
      client.logo && typeof client.logo === "object"
        ? client.logo.url
        : null,
  });

  const addToGroup = (
    map: Map<string | number, ReturnType<typeof clientAvatar>[]>,
    userIds: (number | { id: number })[] | null | undefined,
    client: (typeof clients.docs)[number],
  ) => {
    for (const entry of userIds ?? []) {
      const userId = typeof entry === "object" ? entry.id : entry;
      const existing = map.get(userId) ?? [];
      existing.push(clientAvatar(client));
      map.set(userId, existing);
    }
  };

  const managedByUser = new Map<string | number, ReturnType<typeof clientAvatar>[]>();
  const publishedByUser = new Map<string | number, ReturnType<typeof clientAvatar>[]>();
  const copywrittenByUser = new Map<string | number, ReturnType<typeof clientAvatar>[]>();

  for (const client of clients.docs) {
    addToGroup(managedByUser, client["Account Manager"], client);
    addToGroup(publishedByUser, client["Publisher"], client);
    addToGroup(copywrittenByUser, client["Copywriter"], client);
  }

  const teamMemberListItems: TeamMemberListItem[] = users.docs.map(
    (user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      jobTitle: user.jobTitle,
      email: user.email,
      role: user.role,
      avatarUrl:
        user.profileImage && typeof user.profileImage === "object"
          ? user.profileImage.url
          : null,
      managedClients: managedByUser.get(user.id) ?? [],
      publishingFor: publishedByUser.get(user.id) ?? [],
      copywritingFor: copywrittenByUser.get(user.id) ?? [],
    }),
  );

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <LayoutDashboard className="size-3.5" aria-hidden="true" />
            <span>Overview</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">Team</span>
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
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Team
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everyone with access to the dashboard
            </p>
          </div>
        </div>
      </section>

      <TeamMemberList members={teamMemberListItems} />
    </>
  );
}
