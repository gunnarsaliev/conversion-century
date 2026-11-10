import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { toDateInputValue } from "@/lib/celebrations";
import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";

export default async function SettingsPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  // Only team members (not MCP API keys, which Payload's types also allow).
  const { user: authUser } = await payload.auth({ headers });
  const user = authUser?.collection === "users" ? authUser : null;
  const locale = await getLocale();
  const t = await getDashboardTranslations("Settings");

  if (!user) {
    redirect({ href: "/login", locale });
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
      <PageHeaderBanner title={t("title")} description={t("description")} />

      <ProfileSettingsForm
        className="max-w-3xl rounded-lg border bg-white p-6 shadow-xs sm:p-8 dark:bg-gray-800"
        // Remount when the saved data actually changes (e.g. after a save
        // triggers router.refresh()) instead of relying on prop updates to
        // reset already-mounted form state.
        key={`${fullUser?.updatedAt}-${avatarUrl}`}
        user={{
          firstName: fullUser?.firstName ?? "",
          lastName: fullUser?.lastName ?? "",
          jobTitle: fullUser?.jobTitle,
          about: fullUser?.about,
          birthday: toDateInputValue(fullUser?.birthday),
          workBirthday: toDateInputValue(fullUser?.workBirthday),
          email: user.email,
          avatarUrl,
        }}
      />
    </>
  );
}
