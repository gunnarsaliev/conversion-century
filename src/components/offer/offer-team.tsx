import { getTeamMembers } from "@/lib/team-members";
import type { Offer, OfferStatic } from "@/types/offer";
import { OfferSection } from "./offer-ui";

export async function OfferTeam({
  offer,
  team,
}: {
  offer: Offer;
  team: OfferStatic["team"];
}) {
  const members = await getTeamMembers(offer.teamUserIds);

  return (
    <OfferSection id="team" heading={team.header} description={team.description}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <li key={member.id} className="flex flex-col gap-3">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
              <img src={member.image} alt={member.name} className="size-full object-cover" />
            </div>
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </OfferSection>
  );
}
