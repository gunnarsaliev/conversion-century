"use server";

import { cookies } from "next/headers";

import {
  DASHBOARD_LOCALE_COOKIE,
  isDashboardLocale,
} from "@/lib/dashboard-locale-shared";

// ---------------------------------------------------------------------------
// Set dashboard language (Server Action)
// ---------------------------------------------------------------------------
//
// Stores the signed-in user's dashboard language for this browser (see
// lib/dashboard-locale). The caller refreshes the route afterwards.

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function setDashboardLocale(locale: string): Promise<void> {
  if (!isDashboardLocale(locale)) return;

  (await cookies()).set(DASHBOARD_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
}
