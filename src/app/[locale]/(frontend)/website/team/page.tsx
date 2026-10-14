import { Team39 } from "@/components/team39";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import { getTeamMembers } from "@/lib/team-members";

export async function generateMetadata() {
  return staticPageMetadata("team");
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <>
      <StaticPageJsonLd page="team" />
      <Team39
        heading="Meet the team behind your growth"
        description="Real people, real SEO expertise - get to know who works on your account."
        members={members}
      />
    </>
  );
}
