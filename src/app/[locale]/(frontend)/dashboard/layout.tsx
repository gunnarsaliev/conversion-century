import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { DashboardLayout } from "@/components/dashboard16-layout";
import type { UserData } from "@/components/dashboard16-layout";

export default async function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  let sidebarUser: UserData | undefined;

  if (user) {
    const fullUser = await payload
      .findByID({
        collection: "users",
        id: user.id,
        depth: 1,
      })
      .catch(() => null);

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
    <DashboardLayout user={sidebarUser} isAdmin={user?.role === "admin"}>
      {children}
    </DashboardLayout>
  );
}
