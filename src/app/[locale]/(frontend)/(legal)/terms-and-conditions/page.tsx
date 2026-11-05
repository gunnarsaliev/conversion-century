import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { TermsAndConditionsBg } from "@/components/legal/bg/terms-and-conditions";
import { TermsAndConditionsEn } from "@/components/legal/en/terms-and-conditions";
import { staticPageMetadata } from "@/lib/seo/pages";

export function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("termsAndConditions");
}

export default async function TermsAndConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === "bg" ? <TermsAndConditionsBg /> : <TermsAndConditionsEn />;
}
