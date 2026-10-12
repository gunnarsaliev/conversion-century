import type { Offer, OfferStatic } from "@/types/offer";
import { OfferSection } from "./offer-ui";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export function OfferTeam({
  offer,
  team,
}: {
  offer: Offer;
  team: OfferStatic["team"];
}) {
  return (
    <OfferSection id="team" heading={team.header} description={team.description}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {offer.team.map((member) => (
          <li key={member.name} className="flex flex-col gap-3">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="size-full object-cover" />
              ) : (
                <span aria-hidden="true" className="text-3xl font-semibold text-muted-foreground">
                  {initials(member.name)}
                </span>
              )}
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
