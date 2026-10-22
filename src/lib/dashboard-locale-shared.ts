// Shared by the server helpers (lib/dashboard-locale) and client code.

export const DASHBOARD_LOCALES = ["en", "bg"] as const;
export type DashboardLocale = (typeof DASHBOARD_LOCALES)[number];
export const DEFAULT_DASHBOARD_LOCALE: DashboardLocale = "en";
export const DASHBOARD_LOCALE_COOKIE = "dashboard-locale";

export function isDashboardLocale(value: unknown): value is DashboardLocale {
  return (DASHBOARD_LOCALES as readonly unknown[]).includes(value);
}

// Dates in the dashboard follow its UI language.
export function formatDashboardDate(
  value: string | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}
