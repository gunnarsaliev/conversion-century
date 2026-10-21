import type { Metadata } from "next";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { DashboardLayout } from "@/components/dashboard16-layout";
import type { UserData } from "@/components/dashboard16-layout";
import { getNotificationsForUser, type NotificationFeed } from "@/lib/notifications";
import { isAdminOrEditor } from "@/lib/roles";

// Internal area: never indexed, even after launch.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  let sidebarUser: UserData | undefined;
  let notifications: NotificationFeed | undefined;

  if (user) {
    const [fullUser, feed] = await Promise.all([
      payload
        .findByID({
          collection: "users",
          id: user.id,
          depth: 1,
        })
        .catch(() => null),
      getNotificationsForUser(payload, user.id).catch(() => undefined),
    ]);
    notifications = feed;

    const avatar =
      fullUser?.profileImage && typeof fullUser.profileImage === "object"
        ? fullUser.profileImage.url
        : null;

    sidebarUser = {
      name:
        [fullUser?.firstName, fullUser?.lastName].filter(Boolean).join(" ") ||
        user.email,
      email: user.email,
      avatar: avatar ?? "",
    };
  }

  return (
    <DashboardLayout
      user={sidebarUser}
      isAdmin={isAdminOrEditor(user)}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}
