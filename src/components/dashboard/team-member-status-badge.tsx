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

const statusConfig: Record<TeamMemberStatus, { label: string; className: string; dot: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  "on-leave": {
    label: "On leave",
    className: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  inactive: {
    label: "Inactive",
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
  const config = statusConfig[status] ?? statusConfig.active;

  return (
    <Badge className={cn("gap-1.5", config.className, className)}>
      <span className={cn("size-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

export type { TeamMemberStatus };
