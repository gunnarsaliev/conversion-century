"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { QuickSearchButton } from "@/components/dashboard/quick-search-button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Page header banner — top of every dashboard section page
// ---------------------------------------------------------------------------
//
// A full-width white strip at the top of the content panel with the
// page's bold title (and
// optional count / description) on the left, and the page's actions on the
// right. Without `actions` it shows the ⚡ Quick search button, so every
// page has the same shape.
//
//   <PageHeaderBanner title={t("title")} description={t("description")} />
//
//   <PageHeaderBanner
//     title={t("title")}
//     count={clients.totalDocs}
//     actions={<ClientFormDrawer trigger={<button className={bannerPrimaryActionClassName}>…</button>} />}
//   />

// Blue primary action, matching the Quick search button. Use it for a
// page's main button passed in `actions`.
const bannerPrimaryActionClassName = cn(
  "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-(--action) px-4 text-sm font-semibold text-(--action-foreground) shadow-xs outline-none transition-colors",
  "hover:bg-(--action-hover) focus-visible:ring-3 focus-visible:ring-(--action)/40 motion-reduce:transition-none",
);

type PageHeaderBannerProps = {
  /** Bold page heading (the page's <h1>). */
  title: React.ReactNode;
  /** Shown after the title in muted text, e.g. the number of records. */
  count?: number;
  /** One muted line under the title. */
  description?: React.ReactNode;
  /** Parent section for sub-pages, shown as a link before the title. */
  parent?: { label: string; href: string };
  /** Right-side buttons. Omit for Quick search; pass `null` for none. */
  actions?: React.ReactNode;
  className?: string;
};

const PageHeaderBanner = ({
  title,
  count,
  description,
  parent,
  actions,
  className,
}: PageHeaderBannerProps) => {
  return (
    <section
      className={cn(
        // Full-bleed: the negative margins cancel the content area's padding
        // (#dashboard-main: p-3 / sm:p-4 / md:p-6), so the banner runs to the
        // top and both sides of the white panel, with a soft shadow below.
        "-mx-3 -mt-3 sm:-mx-4 sm:-mt-4 md:-mx-6 md:-mt-6",
        // Stays pinned to the top of the content panel while the page
        // scrolls. Sticky is bounded by the parent, so render the banner as
        // a direct child of #dashboard-main (not inside a short wrapper).
        "sticky top-0 z-20",
        "flex flex-col gap-4 bg-white px-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-4 md:px-6 dark:bg-background",
        "shadow-[0_6px_12px_-8px_rgb(0_0_0/0.14)] dark:shadow-[0_6px_12px_-8px_rgb(0_0_0/0.6)]",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-x-2 text-xl font-bold tracking-tight text-balance sm:text-2xl">
          {parent ? (
            <>
              <Link
                href={parent.href}
                className="font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {parent.label}
              </Link>
              <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
            </>
          ) : null}
          <span>{title}</span>
          {count !== undefined ? (
            <span className="text-base font-normal text-muted-foreground tabular-nums">
              ({count})
            </span>
          ) : null}
        </h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions === undefined ? (
        <QuickSearchButton />
      ) : actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </section>
  );
};

export { PageHeaderBanner, bannerPrimaryActionClassName };
