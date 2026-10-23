import { getLocale } from "next-intl/server";

import { TermsAndConditionsBg } from "@/components/legal/bg/terms-and-conditions";
import { TermsAndConditionsEn } from "@/components/legal/en/terms-and-conditions";

export default async function TermsAndConditionsPage() {
  return (await getLocale()) === "bg" ? <TermsAndConditionsBg /> : <TermsAndConditionsEn />;
}
