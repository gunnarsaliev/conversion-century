"use client";

import { useSyncExternalStore } from "react";
import { useFormatter } from "next-intl";

// One "now" per page load in the browser, so every TimeAgo agrees.
let loadedAt: number | undefined;
const getNow = () => (loadedAt ??= Date.now());
const getServerNow = () => null;
const subscribe = () => () => {};

// "3 years ago", worked out in the browser: pages are prerendered and cached,
// so a server-side "now" would go stale. On the server (and until hydration)
// it shows the month and year, which is also the tooltip.
export function TimeAgo({ date, className }: { date: string; className?: string }) {
  const format = useFormatter();
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);

  const value = new Date(date);
  const absolute = format.dateTime(value, { year: "numeric", month: "long" });

  return (
    <time dateTime={date} title={absolute} className={className}>
      {now === null ? absolute : format.relativeTime(value, now)}
    </time>
  );
}
