import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ---------------------------------------------------------------------------
// Account manager badge
// ---------------------------------------------------------------------------
//
// Small avatar + name for an account manager, linking to their team page
// when an id is available. Used in the client quick-view drawer and the
// client detail page.

type AccountManagerBadgeProps = {
  id?: string | number | null;
  name: string;
  avatarUrl?: string | null;
  /** Size (in Tailwind `size-*` units) of the avatar. Defaults to 5 (20px). */
  avatarSize?: "5" | "6" | "8";
  className?: string;
};

const avatarSizeClassName: Record<
  NonNullable<AccountManagerBadgeProps["avatarSize"]>,
  string
> = {
  "5": "size-5",
  "6": "size-6",
  "8": "size-8",
};

const avatarFallbackTextClassName: Record<
  NonNullable<AccountManagerBadgeProps["avatarSize"]>,
  string
> = {
  "5": "text-[10px]",
  "6": "text-xs",
  "8": "text-sm",
};

const AccountManagerBadge = ({
  id,
  name,
  avatarUrl,
  avatarSize = "5",
  className = "",
}: AccountManagerBadgeProps) => {
  const content = (
    <>
      <Avatar className={avatarSizeClassName[avatarSize]}>
        <AvatarImage src={avatarUrl ?? undefined} alt={name} />
        <AvatarFallback className={avatarFallbackTextClassName[avatarSize]}>
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium">{name}</span>
    </>
  );

  if (id) {
    return (
      <Link
        href={`/dashboard/team/${id}`}
        className={`flex items-center gap-1.5 text-foreground hover:underline ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      {content}
    </span>
  );
};

export { AccountManagerBadge };
