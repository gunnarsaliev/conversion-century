import { getLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { EventCard } from "@/components/event-card";
import {
  eventTypeLabels,
  formatEventDate,
  getEventImage,
  splitEventsByTime,
} from "@/lib/events";
import type { Event } from "../../../../../../payload-types";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";

export async function generateMetadata() {
  return staticPageMetadata("eventsAndMedia");
}

export default async function EventsAndMediaPage() {
  const locale = await getLocale();
  const payload = await getPayload({ config });

  const { docs: events } = await payload.find({
    collection: "events",
    locale: locale as "en" | "bg",
    // Local API bypasses access control, so filter out drafts explicitly.
    where: { _status: { equals: "published" } },
    depth: 1,
    limit: 100,
    sort: "-startDate",
  });

  const { upcoming, past } = splitEventsByTime(events);

  const renderGrid = (items: Event[]) => (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          href={`/website/events-and-media/${event.slug ?? event.id}`}
          dateLabel={formatEventDate(event, locale)}
          excerpt={event.excerpt}
          image={getEventImage(event)}
          location={event.location}
          typeLabel={eventTypeLabels[event.type]}
        />
      ))}
    </div>
  );

  return (
    <>
      <StaticPageJsonLd page="eventsAndMedia" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            Events &amp; Media
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Conferences, webinars, podcasts and press featuring our team.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            No events are available yet.
          </p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-semibold">Upcoming</h2>
                {renderGrid(upcoming)}
              </section>
            )}
            {past.length > 0 && (
              <section className="mt-16">
                {renderGrid(past)}
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
