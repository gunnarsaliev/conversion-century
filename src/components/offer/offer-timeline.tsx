import type { Offer, OfferStatic } from "@/types/offer";
import { OfferSection } from "./offer-ui";

export function OfferTimeline({
  offer,
  timeline,
}: {
  offer: Offer;
  timeline: OfferStatic["timeline"];
}) {
  const totalWeeks = Math.max(...offer.timeline.map((phase) => phase.endWeek));
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekRange = (start: number, end: number) =>
    start === end ? `${timeline.weekLabel} ${start}` : `${timeline.weekLabel} ${start}–${end}`;

  return (
    <OfferSection id="timeline" heading={timeline.header}>
      {/* Gantt on wide screens; each phase stacks as a card on mobile. */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div
          className="hidden border-b border-border bg-muted text-xs font-medium text-muted-foreground md:grid"
          style={{ gridTemplateColumns: `14rem repeat(${totalWeeks}, minmax(0, 1fr))` }}
        >
          <div className="px-4 py-3" />
          {weeks.map((week) => (
            <div key={week} className="border-l border-border px-4 py-3 text-center">
              {timeline.weekLabel} {week}
            </div>
          ))}
        </div>

        <ol className="divide-y divide-border">
          {offer.timeline.map((phase) => (
            <li
              key={phase.label}
              className="flex flex-col gap-3 p-4 md:grid md:items-center md:gap-0 md:p-0"
              style={{ gridTemplateColumns: `14rem repeat(${totalWeeks}, minmax(0, 1fr))` }}
            >
              <div className="md:px-4 md:py-4">
                <p className="font-semibold">{phase.label}</p>
                <p className="text-xs text-muted-foreground md:hidden">
                  {weekRange(phase.startWeek, phase.endWeek)}
                </p>
              </div>
              <div
                className="rounded-lg bg-primary/10 p-3 text-sm md:mx-2 md:my-3"
                style={{ gridColumn: `${phase.startWeek + 1} / ${phase.endWeek + 2}` }}
              >
                <ul className="flex flex-col gap-1">
                  {phase.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-2 font-semibold">{timeline.responsibilitiesHeader}</h3>
        <p className="text-sm text-muted-foreground">{offer.responsibilities}</p>
      </div>
    </OfferSection>
  );
}
