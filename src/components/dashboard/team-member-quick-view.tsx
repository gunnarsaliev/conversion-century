"use client";

import { ExternalLink, Mail, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Team member quick view (drawer)
// ---------------------------------------------------------------------------
//
// Mirrors client-quick-view.tsx's Sheet-based drawer for previewing a team
// member without leaving the list.

const roleBadgeClassName: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  user: "bg-muted text-muted-foreground",
};

type TeamMemberQuickViewData = {
  id: string | number;
  name: string;
  jobTitle?: string | null;
  email?: string | null;
  role: string;
  avatarUrl?: string | null;
};

type TeamMemberQuickViewProps = {
  member: TeamMemberQuickViewData;
  trigger: React.ReactElement;
};

const TeamMemberQuickView = ({
  member,
  trigger,
}: TeamMemberQuickViewProps) => {
  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent showCloseButton={false} aria-describedby={undefined}>
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">Team Member</SheetTitle>
          <SheetClose render={<Button size="icon" variant="secondary" />}>
            <X />
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto px-5 pt-5 pb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">{member.name}</p>
              {member.jobTitle ? (
                <p className="text-sm text-muted-foreground">
                  {member.jobTitle}
                </p>
              ) : null}
              <Badge
                className={`mt-1 ${
                  roleBadgeClassName[member.role] ?? roleBadgeClassName.user
                }`}
              >
                <span className="capitalize">{member.role}</span>
              </Badge>
            </div>
            {member.avatarUrl ? (
              <div className="relative size-24 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full border bg-muted text-lg font-medium text-muted-foreground">
                {member.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            {member.email ? (
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <a href={`mailto:${member.email}`} className="hover:underline">
                    {member.email}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <SheetFooter>
          <Button render={<Link href={`/dashboard/team/${member.id}`} />}>
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View full profile
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { TeamMemberQuickView };
export type { TeamMemberQuickViewData };
