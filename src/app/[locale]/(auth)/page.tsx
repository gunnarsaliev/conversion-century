import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPayload } from "payload";

import config from "@payload-config";
import { routing } from "@/i18n/routing";
import { Signup10 } from "@/components/signup10";

// The `redirect` query param (set by proxy.ts when it bounces an
// unauthenticated request) carries a locale-prefixed pathname, e.g.
// "/en/website" or "/dashboard/clients". next-intl's `redirect()` helper
// expects a locale-agnostic pathname and adds the prefix itself, so strip
// a leading locale segment before handing it off.
function stripLocalePrefix(pathname: string): string {
  const [, maybeLocale, ...rest] = pathname.split("/");
  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    return "/" + rest.join("/");
  }
  return pathname;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const locale = await getLocale();
  const { redirect: redirectTo } = await searchParams;
  const destination = redirectTo ? stripLocalePrefix(redirectTo) : "/dashboard";

  if (user) {
    redirect({ href: destination, locale });
  }

  return <Signup10 redirectTo={destination} />;
}
