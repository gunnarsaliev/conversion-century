import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { redirect } from "@/i18n/navigation";

// ---------------------------------------------------------------------------
// Dashboard auth
// ---------------------------------------------------------------------------
//
// src/proxy.ts only checks that a `payload-token` cookie exists, so every
// dashboard page and server action must verify the session itself. Pages
// read through the local API, which bypasses collection access control.

export async function getDashboardUser() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await getHeaders() });
  return user;
}

// For pages: the signed-in user, or a redirect to the login page.
export async function requireDashboardUser() {
  const user = await getDashboardUser();
  if (!user) {
    redirect({ href: "/login", locale: await getLocale() });
  }
  return user!;
}
