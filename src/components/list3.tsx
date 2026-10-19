import React from "react";
import { Check } from "lucide-react";
import { cn } from "cn";

import { Separator } from "@/components/ui/separator";

export interface List3Row {
  /** Left column. */
  title: string;
  /** Right column, muted. */
  text: string;
}

export interface List3Group {
  /** Omit to show the rows without a group heading. */
  title?: string;
  rows: List3Row[];
}

interface List3Props {
  /** Optional heading above all groups. */
  heading?: string | null;
  description?: string;
  groups?: List3Group[];
  /** Numbers the group titles ("1. …"); otherwise they get a "/ " prefix. */
  numbered?: boolean;
  className?: string;
}

const defaultGroups: List3Group[] = [
  {
    title: "EXPERIENCE",
    rows: [
      { title: "SENIOR SOFTWARE ENGINEER", text: "TECHNOLOGY INNOVATIONS CORP" },
      { title: "FULL-STACK DEVELOPER", text: "DIGITAL SOLUTIONS & STARTUP COLLABORATIONS" },
      { title: "FRONTEND DEVELOPER", text: "WEB CRAFT STUDIO" },
      { title: "JUNIOR DEVELOPER", text: "CODE FORGE LABS" },
      { title: "INTERN DEVELOPER", text: "INNOVATION TECH" },
    ],
  },
  {
    title: "ACHIEVEMENTS",
    rows: [
      { title: "BEST NEWCOMER DEVELOPER", text: "TECH EXCELLENCE AWARDS" },
      { title: "INNOVATION IN WEB DEVELOPMENT", text: "DIGITAL CREATORS UK" },
      { title: "OUTSTANDING CODE QUALITY", text: "BRITISH SOFTWARE ASSOCIATION" },
      { title: "RISING STAR IN TECH", text: "GLOBAL DEVELOPER AWARDS" },
      { title: "DEVELOPER OF THE YEAR", text: "CODE EXCELLENCE AWARDS" },
    ],
  },
];

const List3 = ({
  heading,
  description,
  groups = defaultGroups,
  numbered = false,
  className,
}: List3Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div>
        {heading && <h2 className="mb-4 text-3xl font-semibold md:text-4xl">{heading}</h2>}
        {description && <p className="mb-8 text-muted-foreground">{description}</p>}
        <div className="flex flex-col gap-12">
          {groups.map((group, i) => (
            <div key={group.title ?? i} className="flex flex-col gap-7">
              {group.title && (
                <h3 className="text-xl">
                  {numbered ? `${i + 1}. ` : "/ "}
                  {group.title}
                </h3>
              )}
              <div>
                {group.rows.map((row) => (
                  <React.Fragment key={row.title}>
                    <Separator />
                    <div className="my-1 grid gap-1 text-sm sm:grid-cols-[1fr_2fr]">
                      <p className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                        {row.title}
                      </p>
                      <p className="text-muted-foreground">{row.text}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { List3 };
