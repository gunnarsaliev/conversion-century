"use client";

import { Bell, CalendarRange, ChevronDown, ChevronRight, LayoutDashboard, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Dashboard header (breadcrumb + toolbar + greeting)
// ---------------------------------------------------------------------------
//
// Reusable header for all dashboard pages. Renders a breadcrumb row with a
// toolbar (search / notifications / date filters), followed by a greeting
// row with an optional page action (e.g. "New Reservation").

type DashboardHeaderProps = {
  /** Breadcrumb label for the current page, e.g. "Dashboard", "Clients". */
  section: string;
  /** Full name used to derive the greeting, e.g. "Robert Austin". */
  userName?: string;
  /** Overrides the greeting heading entirely, e.g. "Hello, Robert 👋". */
  title?: string;
  /** Subtitle shown under the greeting. */
  description?: string;
  /** Optional action rendered at the end of the greeting row (e.g. a primary button). */
  action?: React.ReactNode;
  /** Hide the search/notifications/date toolbar. */
  hideToolbar?: boolean;
};

const DashboardHeader = ({
  section,
  userName = "Robert Austin",
  title,
  description = "Here is today's snapshot of arrivals, revenue, and operations.",
  action,
  hideToolbar = false,
}: DashboardHeaderProps) => {
  const firstName = userName.trim().split(/\s+/)[0] || "Robert";
  const heading = title ?? `Hello, ${firstName} 👋`;

  return (
    <section className="pb-4 sm:pb-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <LayoutDashboard className="size-3.5" aria-hidden="true" />
          <span>Overview</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{section}</span>
        </div>
        {!hideToolbar && (
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Search"
            >
              <Search className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              aria-label="Last 7 days"
            >
              Last 7 days
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              aria-label="Date range"
            >
              <CalendarRange className="size-3.5" aria-hidden="true" />
              Feb 04 - Feb 11, 2024
            </Button>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {heading}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
    </section>
  );
};

export { DashboardHeader };
export type { DashboardHeaderProps };
