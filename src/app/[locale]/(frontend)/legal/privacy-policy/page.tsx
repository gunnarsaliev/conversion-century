import { setRequestLocale } from "next-intl/server";

import { PrivacyPolicyBg } from "@/components/legal/bg/privacy-policy";
import { PrivacyPolicyEn } from "@/components/legal/en/privacy-policy";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "bg" ? <PrivacyPolicyBg /> : <PrivacyPolicyEn />;
}
