import { Globe } from "lucide-react";

import { cn } from "@/lib/utils";

// A Google-style search result for a title/description/URL, so editors see
// roughly how a page reads in search before saving. Text is cut the way
// results usually are (≈60 / ≈160 characters); real results vary.

const clip = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;

export function SerpPreview({
  title,
  description,
  url,
  siteName,
  className,
}: {
  title: string;
  description?: string;
  url: string;
  siteName: string;
  className?: string;
}) {
  const { host, pathname } = new URL(url);
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <div className={cn("rounded-xl border bg-white p-4 font-[arial,sans-serif] dark:bg-gray-900", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full border bg-muted">
          <Globe className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm text-[#202124] dark:text-gray-100">{siteName}</span>
          <span className="block truncate text-xs text-[#4d5156] dark:text-gray-400">
            {`https://${host}`}
            {crumbs.length > 0 && ` › ${crumbs.join(" › ")}`}
          </span>
        </span>
      </div>
      <p className="mt-2 text-xl leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
        {clip(title, 60)}
      </p>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-[#4d5156] dark:text-gray-400">
          {clip(description, 160)}
        </p>
      )}
    </div>
  );
}
