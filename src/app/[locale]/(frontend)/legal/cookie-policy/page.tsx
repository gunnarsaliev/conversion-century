import { getLocale } from "next-intl/server";

import { CookiePolicyBg } from "@/components/legal/bg/cookie-policy";
import { CookiePolicyEn } from "@/components/legal/en/cookie-policy";

export default async function CookiePolicyPage() {
  return (await getLocale()) === "bg" ? <CookiePolicyBg /> : <CookiePolicyEn />;
}
