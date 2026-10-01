import type { Event } from "../../payload-types";

export const eventTypeLabels: Record<Event["type"], string> = {
  conference: "Conference",
  webinar: "Webinar",
  workshop: "Workshop",
  podcast: "Podcast",
  interview: "Interview",
  press: "Press",
};

export function formatEventDate(event: Pick<Event, "startDate" | "endDate">, locale: string) {
  const format = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const start = new Date(event.startDate);
  if (!event.endDate) return format.format(start);
  return format.formatRange(start, new Date(event.endDate));
}

export function getEventImage(event: Pick<Event, "image">) {
  return event.image && typeof event.image === "object" && event.image.url
    ? { url: event.image.url, alt: event.image.alt }
    : null;
}

// An event counts as upcoming until it ends (or starts, if no end date).
// Expects events sorted newest first; returns upcoming soonest first.
export function splitEventsByTime<T extends Pick<Event, "startDate" | "endDate">>(
  events: T[],
  now = Date.now(),
) {
  const isUpcoming = (event: T) =>
    new Date(event.endDate ?? event.startDate).getTime() >= now;
  return {
    upcoming: events.filter(isUpcoming).reverse(),
    past: events.filter((event) => !isUpcoming(event)),
  };
}
