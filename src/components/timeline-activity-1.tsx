"use client";

import { cn } from "cn";

export const title = "Purchase activity timeline";

export type ActivityEvent = {
  id: string;
  title: string;
  detail?: string;
  time: string;
  /** Omit for a neutral dot, e.g. in a plan that hasn't started. */
  state?: "complete" | "current" | "upcoming";
};

interface TimelineActivity1Props {
  heading?: string;
  subheading?: string;
  events?: ActivityEvent[];
  className?: string;
}

const defaultEvents: ActivityEvent[] = [
  {
    id: "1",
    title: "Order placed",
    detail: "Customer checked out with two hero items from the spring drop.",
    time: "Mar 18, 8:24 AM",
    state: "complete",
  },
  {
    id: "2",
    title: "Payment captured",
    detail: "Visa ending in 0198 was approved for the full order amount.",
    time: "Mar 18, 8:26 AM",
    state: "complete",
  },
  {
    id: "3",
    title: "Packing in progress",
    detail:
      "Warehouse team is assembling the bundle and gift sleeve before handoff.",
    time: "Today, 10:18 AM",
    state: "current",
  },
  {
    id: "4",
    title: "Review request scheduled",
    time: "After delivery",
    state: "upcoming",
  },
];

const TimelineActivity1 = ({
  heading = "ORD-34021",
  subheading = "Placed on Mar 18, 2026 • Online Store",
  events = defaultEvents,
  className,
}: TimelineActivity1Props) => (
  <div className={cn("w-full max-w-md rounded-lg border p-5", className)}>
    <div className="mb-5 flex flex-col gap-1">
      <h3 className="text-base font-semibold">{heading}</h3>
      {subheading && (
        <p className="text-sm text-muted-foreground">{subheading}</p>
      )}
    </div>
    <div className="flex flex-col gap-5">
      {events.map((activity, index) => (
        <div key={activity.id} className="relative pl-6">
          <span
            className={cn(
              "absolute top-1.5 left-0 size-2.5 rounded-full",
              activity.state === "current"
                ? "bg-primary"
                : activity.state === "upcoming"
                  ? "bg-muted-foreground/35"
                  : "bg-foreground/75",
            )}
          />
          {index < events.length - 1 ? (
            <span className="absolute top-5 bottom-[-1.25rem] left-[5px] w-px bg-border" />
          ) : null}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <p
                className={cn(
                  "text-sm font-medium",
                  activity.state === "upcoming" &&
                    "font-normal text-muted-foreground",
                )}
              >
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            {activity.detail ? (
              <p className="text-sm leading-6 text-muted-foreground">
                {activity.detail}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export { TimelineActivity1 };
export default TimelineActivity1;
