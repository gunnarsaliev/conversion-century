"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { setDashboardLocale } from "@/lib/dashboard-locale-actions";
import { DASHBOARD_LOCALES } from "@/lib/dashboard-locale-shared";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Language preferences
// ---------------------------------------------------------------------------
//
// Lets the user pick the dashboard's UI language. Saved in a cookie by the
// setDashboardLocale server action (see lib/dashboard-locale); the route is
// then refreshed so server components re-render in the new language.
// Language names are always shown in their own language.

const LANGUAGE_NAMES = {
  en: "English",
  bg: "Български",
} as const;

const LanguagePreferencesForm = () => {
  const t = useTranslations("Preferences.language");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const select = (next: (typeof DASHBOARD_LOCALES)[number]) => {
    if (next === locale) return;
    startTransition(async () => {
      await setDashboardLocale(next);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium">{t("heading")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>

        <div
          role="radiogroup"
          aria-label={t("heading")}
          aria-busy={isPending}
          className={cn(
            "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2",
            isPending && "opacity-60",
          )}
        >
          {DASHBOARD_LOCALES.map((option) => {
            const isSelected = locale === option;

            return (
              <button
                key={option}
                type="button"
                role="radio"
                lang={option}
                aria-checked={isSelected}
                disabled={isPending}
                onClick={() => select(option)}
                className={cn(
                  "relative flex items-center justify-center gap-2 rounded-lg border p-4 text-sm outline-none transition-all hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  isSelected && "border-primary bg-primary/5",
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" aria-hidden="true" />
                  </div>
                )}
                <span className="font-medium">{LANGUAGE_NAMES[option]}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { LanguagePreferencesForm };
