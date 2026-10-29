import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { cmsCache } from "@/lib/cms/cache";
import { CardGridSkeleton } from "@/components/skeletons";
import { EventCard } from "@/components/event-card";
import { PaginationNav } from "@/components/pagination-nav";
import {
  formatEventDate,
  getEventImage,
  splitEventsByTime,
} from "@/lib/events";
import type { Event } from "../../../../../payload-types";
import { StaticPageJsonLd } from "@/components/static-page-json-ld";
import { staticPageMetadata } from "@/lib/seo/pages";
import {
  PAGE_SIZE,
  getPage,
  paginatedMetadata,
  type PageSearchParams,
} from "@/lib/pagination";
import { translated } from "@/utilities/findByLocalizedSlug";

type EventsAndMediaPageProps = {
  searchParams: PageSearchParams;
};

export async function generateMetadata({ searchParams }: EventsAndMediaPageProps) {
  const page = await getPage(searchParams);
  const t = await getTranslations("Pagination");
  return paginatedMetadata(
    await staticPageMetadata("eventsAndMedia"),
    page,
    t("page", { page }),
  );
}

// Cached across requests; refreshed when an event changes.
async function getEvents(locale: string, page: number) {
  "use cache";
  cmsCache("events", "media");
  const payload = await getPayload({ config });
  return payload.find({
    collection: "events",
    locale: locale as "en" | "bg",
    // Local API bypasses access control, so filter out drafts explicitly.
    where: { _status: { equals: "published" }, ...translated },
    depth: 1,
    limit: PAGE_SIZE,
    page,
    sort: "-startDate",
  });
}

export default async function EventsAndMediaPage({
  params,
  searchParams,
}: EventsAndMediaPageProps & { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Events");

  return (
    <>
      <StaticPageJsonLd page="eventsAndMedia" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {/* ?page= is only known per request; the header above is prerendered. */}
        <Suspense fallback={<CardGridSkeleton className="mt-16" imageClassName="aspect-square h-auto" />}>
          <EventsListing locale={locale} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function EventsListing({
  locale,
  searchParams,
}: EventsAndMediaPageProps & { locale: string }) {
  const page = await getPage(searchParams);
  const t = await getTranslations("Events");

  const { docs: events, totalPages } = await getEvents(locale, page);

  if (page > 1 && page > totalPages) notFound();

  // Newest start dates first, so upcoming events land on the first page(s).
  const { upcoming, past } = splitEventsByTime(events);

  const renderGrid = (items: Event[]) => (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          href={`/events-and-media/${event.slug ?? event.id}`}
          dateLabel={formatEventDate(event, locale)}
          excerpt={event.excerpt}
          image={getEventImage(event)}
          location={event.location}
          typeLabel={t(`types.${event.type}`)}
        />
      ))}
    </div>
  );

  if (events.length === 0) {
    return (
      <p className="mt-16 text-center text-muted-foreground">
        {t("empty")}
      </p>
    );
  }

  return (
    <>
      {upcoming.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">{t("upcoming")}</h2>
          {renderGrid(upcoming)}
        </section>
      )}
      {past.length > 0 && (
        <section className="mt-16">
          {renderGrid(past)}
        </section>
      )}
      <PaginationNav
        basePath="/events-and-media"
        page={page}
        totalPages={totalPages}
      />
    </>
  );
}
