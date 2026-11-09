import { getPayload } from "payload";
import config from "@payload-config";

import {
  TeamMemberList,
  type TeamMemberListItem,
} from "@/components/dashboard/team-member-list";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";

export default async function TeamPage() {
  await requireDashboardUser();
  const t = await getDashboardTranslations("Team");
  const payload = await getPayload({ config });
  const [users, clients] = await Promise.all([
    payload.find({
      collection: "users",
      // Inactive members are hidden from the team list.
      where: { status: { not_equals: "inactive" } },
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
      status: user.status,
      about: user.about,
      birthday: user.birthday,
      workBirthday: user.workBirthday,
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
      <PageHeaderBanner title={t("title")} description={t("description")} />

      <TeamMemberList members={teamMemberListItems} />
    </>
  );
}
