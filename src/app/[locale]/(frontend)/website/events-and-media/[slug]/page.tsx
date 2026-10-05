import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { getLocale } from "next-intl/server";

import { PostRichText } from "@/components/blog-rich-text";
import { EventPill } from "@/components/event-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { eventTypeLabels, formatEventDate, getEventImage } from "@/lib/events";
import { findByLocalizedSlug } from "@/utilities/findByLocalizedSlug";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, mediaImage, truncate } from "@/lib/seo/metadata";
import { localizedDocPath, pageBreadcrumbs } from "@/lib/seo/pages";
import { graph, articleSchema, eventSchema } from "@/lib/seo/schema";
import { toLocale } from "@/lib/seo/site";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// Conferences/webinars/workshops are real events (schema.org Event);
// podcasts, interviews and press are published media (Article).
const LIVE_EVENT_TYPES = new Set(["conference", "webinar", "workshop"]);

// Local API bypasses access control, so hide drafts explicitly.
const getEvent = cache(async (slug: string, locale: string) => {
  const event = await findByLocalizedSlug("events", slug, locale);
  return event?._status === "published" ? event : null;
});

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const event = await getEvent(slug, locale);

  if (!event) return {};

  const isArticle = !LIVE_EVENT_TYPES.has(event.type);
  return buildMetadata({
    title: event.meta?.title || event.title,
    description: event.meta?.description || truncate(event.excerpt),
    path: await localizedDocPath("events", event.id, "/website/events-and-media"),
    locale: toLocale(locale),
    image: mediaImage(event.image),
    type: isArticle ? "article" : "website",
    publishedTime: isArticle ? event.startDate : undefined,
  });
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const event = await getEvent(slug, locale);

  if (!event) {
    notFound();
  }

  const image = getEventImage(event);

  const seoLocale = toLocale(locale);
  const path = await localizedDocPath("events", event.id, "/website/events-and-media");
  const description = event.meta?.description || event.excerpt;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ["eventsAndMedia", { name: event.title, path }]),
          LIVE_EVENT_TYPES.has(event.type)
            ? eventSchema({
                locale: seoLocale,
                path,
                name: event.title,
                description,
                image: image?.url,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                externalUrl: event.externalUrl,
              })
            : articleSchema({
                locale: seoLocale,
                path,
                headline: event.title,
                description,
                image: image?.url,
                datePublished: event.startDate,
                dateModified: event.updatedAt,
              }),
        )}
      />
      <p className="text-sm font-semibold text-primary">
        {eventTypeLabels[event.type]}
      </p>
      <h1 className="mt-2 text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
        {event.title}
      </h1>
      {event.excerpt && (
        <p className="mt-4 text-lg text-muted-foreground">{event.excerpt}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <EventPill icon={<CalendarDays className="h-4 w-4" />}>
          {formatEventDate(event, locale)}
        </EventPill>
        {event.location && (
          <EventPill icon={<MapPin className="h-4 w-4" />}>
            {event.location}
          </EventPill>
        )}
        {event.externalUrl && (
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), "ml-auto rounded-full")}
          >
            Learn more
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>

      {image && (
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={image.url}
            alt={image.alt ?? event.title}
            fill
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {event.content && (
        <div className="prose dark:prose-invert mt-10 max-w-none">
          <PostRichText data={event.content} locale={locale as "en" | "bg"} />
        </div>
      )}
    </article>
  );
}
