import { setRequestLocale } from "next-intl/server";

import { TermsAndConditionsBg } from "@/components/legal/bg/terms-and-conditions";
import { TermsAndConditionsEn } from "@/components/legal/en/terms-and-conditions";

export default async function TermsAndConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "bg" ? <TermsAndConditionsBg /> : <TermsAndConditionsEn />;
}
