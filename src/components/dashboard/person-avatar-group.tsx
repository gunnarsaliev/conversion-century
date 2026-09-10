import Link from "next/link";

import { AvatarGroup } from "@/components/shadcnblocks/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Person avatar group
// ---------------------------------------------------------------------------
//
// Overlapping avatars with a name tooltip per person, based on
// avatar-group-tooltip-1.tsx. Each avatar links to the person's team page
// when an id is available.

type Person = {
  id?: string | number | null;
  name: string;
  avatarUrl?: string | null;
};

type PersonAvatarGroupProps = {
  people: Person[];
  size?: number;
};

const PersonAvatarGroup = ({ people, size = 28 }: PersonAvatarGroupProps) => {
  if (people.length === 0) return null;

  return (
    <TooltipProvider>
      <AvatarGroup size={size}>
        {people.map((person, index) => {
          const avatar = (
            <Avatar
              className="border-2 border-background"
              style={{ width: size, height: size }}
            >
              <AvatarImage src={person.avatarUrl ?? undefined} alt={person.name} />
              <AvatarFallback className="text-xs">
                {person.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          );

          return (
            <Tooltip key={person.id ?? index}>
              <TooltipTrigger
                render={
                  person.id ? (
                    <Link href={`/dashboard/team/${person.id}`} />
                  ) : (
                    <span />
                  )
                }
              >
                {avatar}
              </TooltipTrigger>
              <TooltipContent>
                <p>{person.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </AvatarGroup>
    </TooltipProvider>
  );
};

export { PersonAvatarGroup };
export type { Person };
