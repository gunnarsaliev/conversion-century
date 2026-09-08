import { Bell, ChevronRight, LayoutDashboard, Search } from "lucide-react";
import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const locale = await getLocale();

  if (!user) {
    redirect({ href: "/", locale });
    return null;
  }

  const fullUser = await payload
    .findByID({
      collection: "users",
      id: user.id,
      depth: 1,
    })
    .catch(() => null);

  const avatarUrl =
    fullUser?.profileImage && typeof fullUser.profileImage === "object"
      ? fullUser.profileImage.url
      : null;

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <LayoutDashboard className="size-3.5" aria-hidden="true" />
            <span>Overview</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">Settings</span>
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
        <div className="mt-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile
          </p>
        </div>
      </section>

      <ProfileSettingsForm
        // Remount when the saved data actually changes (e.g. after a save
        // triggers router.refresh()) instead of relying on prop updates to
        // reset already-mounted form state.
        key={`${fullUser?.updatedAt}-${avatarUrl}`}
        user={{
          firstName: fullUser?.firstName ?? "",
          lastName: fullUser?.lastName ?? "",
          jobTitle: fullUser?.jobTitle,
          email: user.email,
          avatarUrl,
        }}
      />
    </>
  );
}
