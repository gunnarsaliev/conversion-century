import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { LanguagePreferencesForm } from "@/components/dashboard/language-preferences-form";
import { ThemePreferencesForm } from "@/components/dashboard/theme-preferences-form";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";

export default async function PreferencesPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const locale = await getLocale();
  const t = await getDashboardTranslations("Preferences");

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <>
      <PageHeaderBanner title={t("title")} description={t("description")} />

      <div className="max-w-2xl space-y-4">
        <LanguagePreferencesForm />
        <ThemePreferencesForm />
      </div>
    </>
  );
}
