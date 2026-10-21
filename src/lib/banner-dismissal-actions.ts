"use server";

import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { DISMISS_KEY_PATTERN, getDismissedBanners } from "@/lib/banner-dismissal";

// ---------------------------------------------------------------------------
// Dismiss banner (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Adds a banner key to the signed-in user's own `dismissedBanners` (see
// lib/banner-dismissal). The user comes from the request headers, never the
// client, so a user can only dismiss banners for themselves. Users' `update`
// access is admin-only, hence the local API's default overrideAccess.

export async function dismissBanner(dismissKey: string): Promise<void> {
  if (!DISMISS_KEY_PATTERN.test(dismissKey)) return;

  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  if (!user) return;

  const current = await payload.findByID({ collection: "users", id: user.id, depth: 0 });
  const thisYear = new Date().getFullYear();
  const kept = [...getDismissedBanners(current.dismissedBanners)].filter(
    (key) => Number(DISMISS_KEY_PATTERN.exec(key)?.[1]) >= thisYear - 1,
  );

  if (kept.includes(dismissKey)) return;

  await payload.update({
    collection: "users",
    id: user.id,
    data: { dismissedBanners: [...kept, dismissKey] },
    depth: 0,
  });
}
