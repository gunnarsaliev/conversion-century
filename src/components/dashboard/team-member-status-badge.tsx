"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User } from "../../../payload-types";

// ---------------------------------------------------------------------------
// Team member status badge
// ---------------------------------------------------------------------------
//
// A user's `status` (Users collection) as a small coloured badge with a dot.
// Used on the team list cards, the quick-view drawer and the team member page.

type TeamMemberStatus = User["status"];

const statusConfig: Record<TeamMemberStatus, { className: string; dot: string }> = {
  active: {
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  "on-leave": {
    className: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  inactive: {
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
};

export function TeamMemberStatusBadge({
  status,
  className,
}: {
  status: TeamMemberStatus;
  className?: string;
}) {
  const t = useTranslations("Team.status");
  const config = statusConfig[status] ? status : "active";
  const { className: statusClassName, dot } = statusConfig[config];

  return (
    <Badge className={cn("gap-1.5", statusClassName, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden="true" />
      {t(config)}
    </Badge>
  );
}

export type { TeamMemberStatus };
