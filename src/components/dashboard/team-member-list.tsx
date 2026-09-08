"use client";

import Image from "next/image";

import {
  TeamMemberQuickView,
  type TeamMemberQuickViewData,
} from "@/components/dashboard/team-member-quick-view";

// ---------------------------------------------------------------------------
// Team member list (card grid)
// ---------------------------------------------------------------------------
//
// Adapted from team55.tsx's editorial card grid: each team member is
// rendered as a photo + name/role card, opening the quick-view drawer on
// click (same interaction as client-list.tsx).

type TeamMemberListItem = TeamMemberQuickViewData;

type TeamMemberCardProps = {
  member: TeamMemberListItem;
};

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <TeamMemberQuickView
      member={member}
      trigger={
        <button
          type="button"
          className="flex w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card text-left outline-none transition-all hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {member.avatarUrl ? (
            <Image
              src={member.avatarUrl}
              alt={member.name}
              width={144}
              height={192}
              className="min-h-48 w-28 shrink-0 self-stretch object-cover sm:w-36"
            />
          ) : (
            <div className="flex min-h-48 w-28 shrink-0 items-center justify-center self-stretch bg-muted text-2xl font-medium text-muted-foreground sm:w-36">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col justify-center gap-0.5 py-6 pr-6 pl-6">
            <p className="font-serif text-lg leading-tight font-medium tracking-tight sm:text-xl">
              {member.name}
            </p>
            {member.jobTitle ? (
              <p className="text-sm text-muted-foreground">
                {member.jobTitle}
              </p>
            ) : null}
          </div>
        </button>
      }
    />
  );
};

type TeamMemberListProps = {
  members: TeamMemberListItem[];
};

const TeamMemberList = ({ members }: TeamMemberListProps) => {
  if (members.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted-foreground">
        No team members yet.
      </p>
    );
  }

  return (
    <ul className="mt-8 grid gap-8 sm:grid-cols-2">
      {members.map((member) => (
        <li key={member.id}>
          <TeamMemberCard member={member} />
        </li>
      ))}
    </ul>
  );
};

export { TeamMemberList };
export type { TeamMemberListItem };
