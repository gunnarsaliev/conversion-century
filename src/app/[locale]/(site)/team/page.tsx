import { getTranslations } from "next-intl/server";

import { Team39 } from "@/components/team39";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { getTeamMembers } from "@/lib/team-members";

export async function generateMetadata() {
  return staticPageMetadata("team");
}

export default async function TeamPage() {
  const members = await getTeamMembers();
  const t = await getTranslations("TeamPage");

  return (
    <>
      <StaticPageJsonLd page="team" />
      <Team39
        heading={t("heading")}
        description={t("description")}
        members={members}
      />
    </>
  );
}
