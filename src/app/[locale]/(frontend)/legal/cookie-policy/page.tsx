import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CookiePolicyBg } from "@/components/legal/bg/cookie-policy";
import { CookiePolicyEn } from "@/components/legal/en/cookie-policy";
import { staticPageMetadata } from "@/lib/seo/pages";

export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("cookiePolicy");
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "bg" ? <CookiePolicyBg /> : <CookiePolicyEn />;
}
