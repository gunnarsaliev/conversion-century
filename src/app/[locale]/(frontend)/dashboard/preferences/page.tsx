import { ChevronRight, LayoutDashboard, Search } from "lucide-react";
import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { LanguagePreferencesForm } from "@/components/dashboard/language-preferences-form";
import { ThemePreferencesForm } from "@/components/dashboard/theme-preferences-form";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/dashboard/notification-bell";

export default async function PreferencesPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const locale = await getLocale();
  const t = await getDashboardTranslations("Preferences");
  const tCommon = await getDashboardTranslations("Common");

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <>
      <section className="pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <LayoutDashboard className="size-3.5" aria-hidden="true" />
            <span>{tCommon("overview")}</span>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">{t("title")}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label={tCommon("search")}
            >
              <Search className="size-4" aria-hidden="true" />
            </Button>
            <NotificationBell />
          </div>
        </div>
        <div className="mt-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </section>

      <div className="max-w-2xl space-y-4">
        <LanguagePreferencesForm />
        <ThemePreferencesForm />
      </div>
    </>
  );
}
