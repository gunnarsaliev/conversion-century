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

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

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

  return {
    title: event.meta?.title || event.title,
    description: event.meta?.description || event.excerpt || undefined,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const event = await getEvent(slug, locale);

  if (!event) {
    notFound();
  }

  const image = getEventImage(event);

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <p className="text-sm font-semibold text-primary">
        {eventTypeLabels[event.type]}
      </p>
      <h1 className="mt-2 font-poppins text-4xl leading-tight font-semibold tracking-[-1px] sm:text-5xl">
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
