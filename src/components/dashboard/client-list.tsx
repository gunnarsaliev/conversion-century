"use client";

import { ArrowRight } from "lucide-react";

import { ClientLogo } from "@/components/dashboard/client-logo";
import {
  ClientQuickView,
  type ClientQuickViewData,
} from "@/components/dashboard/client-quick-view";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Client list (card grid)
// ---------------------------------------------------------------------------
//
// Adapted from settings-integrations3.tsx's integration card grid: each
// client is rendered as a card with a logo, name/description, and a status
// badge, linking through to its detail page.

const statusBadgeClassName: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  lead: "bg-amber-100 text-amber-800",
  inactive: "bg-muted text-muted-foreground",
};

type ClientListItem = ClientQuickViewData & {
  description?: string | null;
};

type ClientCardProps = {
  client: ClientListItem;
};

const ClientCard = ({ client }: ClientCardProps) => {
  return (
    <ClientQuickView
      client={client}
      trigger={
        <button
          type="button"
          className="group flex w-full cursor-pointer flex-col gap-4 rounded-lg border p-4 text-left outline-none transition-all hover:bg-muted/30 hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="flex items-start justify-between gap-4">
            <ClientLogo
              companyName={client.companyName}
              logoUrl={client.logoUrl}
              logoWidth={client.logoWidth}
              logoHeight={client.logoHeight}
              size={64}
            />
            <div className="flex items-center gap-2">
              <Badge
                className={
                  statusBadgeClassName[client.status] ??
                  statusBadgeClassName.inactive
                }
              >
                <span className="capitalize">{client.status}</span>
              </Badge>
              <div className="opacity-0 group-hover:opacity-100">
                <ArrowRight className="size-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-base">
            <p className="font-medium">{client.companyName}</p>
            {client.description ? (
              <p className="text-sm text-muted-foreground">
                {client.description}
              </p>
            ) : null}
          </div>
        </button>
      }
    />
  );
};

type ClientListProps = {
  clients: ClientListItem[];
};

const ClientList = ({ clients }: ClientListProps) => {
  if (clients.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted-foreground">No clients yet.</p>
    );
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {clients.map((client) => (
        <li key={client.id}>
          <ClientCard client={client} />
        </li>
      ))}
    </ul>
  );
};

export { ClientList };
export type { ClientListItem };
