import { getLocale } from "next-intl/server";

import { PrivacyPolicyBg } from "@/components/legal/bg/privacy-policy";
import { PrivacyPolicyEn } from "@/components/legal/en/privacy-policy";

export default async function PrivacyPolicyPage() {
  return (await getLocale()) === "bg" ? <PrivacyPolicyBg /> : <PrivacyPolicyEn />;
}
