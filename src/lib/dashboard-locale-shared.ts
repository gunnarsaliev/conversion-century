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

// "today", "3 days ago", "2 months ago"… in the dashboard's UI language.
export function formatDashboardTimeAgo(value: string | Date, locale: string, now = new Date()) {
  const days = Math.round((new Date(value).getTime() - now.getTime()) / 86_400_000);
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const abs = Math.abs(days);
  if (abs < 7) return format.format(days, "day");
  if (abs < 30) return format.format(Math.round(days / 7), "week");
  if (abs < 365) return format.format(Math.round(days / 30), "month");
  return format.format(Math.round(days / 365), "year");
}
