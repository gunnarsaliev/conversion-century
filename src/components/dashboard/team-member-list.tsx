"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

import {
  TeamMemberQuickView,
  type TeamMemberQuickViewData,
} from "@/components/dashboard/team-member-quick-view";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Team member list (card grid)
// ---------------------------------------------------------------------------
//
// Mirrors client-list.tsx's card grid: each team member is rendered as a
// card with an avatar, name/job title, and a role badge, opening the
// quick-view drawer on click.

const roleBadgeClassName: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  user: "bg-muted text-muted-foreground",
};

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
          className="group flex w-full cursor-pointer flex-col gap-4 rounded-lg border p-4 text-left outline-none transition-all hover:bg-muted/30 hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="flex items-start justify-between gap-4">
            {member.avatarUrl ? (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium text-muted-foreground">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge
                className={
                  roleBadgeClassName[member.role] ?? roleBadgeClassName.user
                }
              >
                <span className="capitalize">{member.role}</span>
              </Badge>
              <div className="opacity-0 group-hover:opacity-100">
                <ArrowRight className="size-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-base">
            <p className="font-medium">{member.name}</p>
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
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
