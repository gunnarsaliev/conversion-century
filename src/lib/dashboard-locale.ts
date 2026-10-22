import { cookies } from "next/headers";
import type { ReactNode } from "react";
import {
  createTranslator,
  type AbstractIntlMessages,
  type RichTranslationValues,
  type TranslationValues,
} from "next-intl";

import {
  DASHBOARD_LOCALE_COOKIE,
  DEFAULT_DASHBOARD_LOCALE,
  isDashboardLocale,
  type DashboardLocale,
} from "@/lib/dashboard-locale-shared";

// ---------------------------------------------------------------------------
// Dashboard UI language
// ---------------------------------------------------------------------------
//
// The dashboard's language is a per-browser preference (cookie, set from
// Dashboard → Preferences), independent of the site's URL locale. Its
// strings live in messages/dashboard/<locale>.json, separate from the public
// site's messages so they never ship to public pages.

export async function getDashboardLocale(): Promise<DashboardLocale> {
  const value = (await cookies()).get(DASHBOARD_LOCALE_COOKIE)?.value;
  return isDashboardLocale(value) ? value : DEFAULT_DASHBOARD_LOCALE;
}

export async function getDashboardMessages(
  locale: DashboardLocale,
): Promise<AbstractIntlMessages> {
  return (await import(`../../messages/dashboard/${locale}.json`)).default;
}

// The dashboard messages aren't registered as next-intl's global message
// type, so keys are plain strings here.
export type DashboardTranslator = {
  (key: string, values?: TranslationValues): string;
  rich(key: string, values?: RichTranslationValues): ReactNode;
  has(key: string): boolean;
};

// Server components and server actions: `t` for one namespace of the
// dashboard messages, in the current dashboard language.
export async function getDashboardTranslations(
  namespace: string,
): Promise<DashboardTranslator> {
  const locale = await getDashboardLocale();
  const messages = await getDashboardMessages(locale);
  return createTranslator({ locale, messages, namespace }) as unknown as DashboardTranslator;
}
