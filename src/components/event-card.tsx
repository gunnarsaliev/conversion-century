import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Based on card-standard-4: image card with pill badges in the footer.
type EventCardProps = {
  title: string;
  href: string;
  dateLabel: string;
  excerpt?: string | null;
  image?: { url: string; alt?: string | null } | null;
  location?: string | null;
  typeLabel?: string | null;
};

export const EventCard = ({
  title,
  href,
  dateLabel,
  excerpt,
  image,
  location,
  typeLabel,
}: EventCardProps) => (
  <Link href={href} className="group">
    <Card className="h-full w-full overflow-hidden transition-shadow group-hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {excerpt && (
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        )}
      </CardHeader>
      {image?.url && (
        <CardContent className="p-0">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt ?? title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <EventPill icon={<CalendarDays className="h-4 w-4" />}>
            {dateLabel}
          </EventPill>
          {location && (
            <EventPill icon={<MapPin className="h-4 w-4" />}>{location}</EventPill>
          )}
        </div>
        {typeLabel && (
          <span className="text-sm font-semibold text-primary">{typeLabel}</span>
        )}
      </CardFooter>
    </Card>
  </Link>
);

export const EventPill = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 rounded-full border px-4 py-2">
    {icon}
    <span className="text-sm font-medium">{children}</span>
  </div>
);
