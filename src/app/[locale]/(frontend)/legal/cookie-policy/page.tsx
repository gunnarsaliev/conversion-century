import { setRequestLocale } from "next-intl/server";

import { CookiePolicyBg } from "@/components/legal/bg/cookie-policy";
import { CookiePolicyEn } from "@/components/legal/en/cookie-policy";

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "bg" ? <CookiePolicyBg /> : <CookiePolicyEn />;
}
