import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies, headers as getHeaders } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getPayload } from "payload";
import config from "@payload-config";

import { DashboardLayout } from "@/components/dashboard16-layout";
import { DashboardSkeleton } from "@/components/skeletons";
import type { UserData } from "@/components/dashboard16-layout";
import { getClientFormOptions } from "@/lib/client-form-options";
import type { ClientFormOptions } from "@/lib/client-form-schema";
import { getNotificationsForUser, type NotificationFeed } from "@/lib/notifications";
import { getDashboardLocale, getDashboardMessages } from "@/lib/dashboard-locale";
import { isAdminOrEditor } from "@/lib/roles";

// Internal area: never indexed, even after launch.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Everything here is per user (session cookie, dashboard language), so it
// renders per request behind a skeleton of the dashboard shell.
export default function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardWithUser>{children}</DashboardWithUser>
    </Suspense>
  );
}

async function DashboardWithUser({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();
  // Written by the sidebar when it's collapsed/expanded; read here so the
  // first render matches (no flash of an expanded sidebar).
  const sidebarState = (await cookies()).get("sidebar_state")?.value;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const locale = await getDashboardLocale();
  const messages = await getDashboardMessages(locale);

  let sidebarUser: UserData | undefined;
  let notifications: NotificationFeed | undefined;
  let formOptions: ClientFormOptions | undefined;

  if (user) {
    const [fullUser, feed, options] = await Promise.all([
      payload
        .findByID({
          collection: "users",
          id: user.id,
          depth: 1,
        })
        .catch(() => null),
      getNotificationsForUser(payload, user.id).catch(() => undefined),
      // For the top bar's "+" create drawer. Cached per request, so pages
      // that also load it don't query twice.
      getClientFormOptions().catch(() => undefined),
    ]);
    notifications = feed;
    formOptions = options;

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

  // The dashboard's own language and messages (see lib/dashboard-locale)
  // override the site's for everything below.
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div lang={locale} className="contents">
        <DashboardLayout
          user={sidebarUser}
          isAdmin={isAdminOrEditor(user)}
          notifications={notifications}
          formOptions={formOptions}
          defaultSidebarOpen={sidebarState !== "false"}
        >
          {children}
        </DashboardLayout>
      </div>
    </NextIntlClientProvider>
  );
}
