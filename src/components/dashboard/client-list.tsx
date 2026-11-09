"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClientLogo } from "@/components/dashboard/client-logo";
import {
  ClientQuickView,
  type ClientQuickViewData,
} from "@/components/dashboard/client-quick-view";
import { ClientStatusSelect } from "@/components/dashboard/client-status-select";
import type { ClientFormOptions } from "@/lib/client-form-schema";

// ---------------------------------------------------------------------------
// Client list (card grid)
// ---------------------------------------------------------------------------
//
// Adapted from settings-integrations3.tsx's integration card grid: each
// client is rendered as a card with a logo, name/description, and a status
// badge, linking through to its detail page.

type ClientListItem = ClientQuickViewData & {
  description?: string | null;
};

type ClientCardProps = {
  client: ClientListItem;
  options?: ClientFormOptions;
};

// The whole card opens the quick view, so the status dropdown sits on top
// of it as a sibling (a menu button can't be nested inside the card button).
const ClientCard = ({ client, options }: ClientCardProps) => {
  return (
    <div className="relative">
      <ClientQuickView
        client={client}
        options={options}
        trigger={
          <button
            type="button"
            className="group flex h-48 w-full cursor-pointer flex-col gap-4 rounded-lg border bg-white p-4 text-left transition-all outline-none hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between gap-4">
              <ClientLogo
                companyName={client.companyName}
                logoUrl={client.logoUrl}
                logoWidth={client.logoWidth}
                logoHeight={client.logoHeight}
                size={64}
              />
              {/* Right padding leaves room for the status dropdown. */}
              <div className="flex items-center gap-2 pr-28">
                <div className="opacity-0 group-hover:opacity-100">
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1 text-base">
              <p className="truncate font-medium">{client.companyName}</p>
              {client.description ? (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {client.description}
                </p>
              ) : null}
            </div>
          </button>
        }
      />
      <ClientStatusSelect
        clientId={client.id}
        status={client.status}
        className="absolute top-4 right-4"
      />
    </div>
  );
};

type ClientListProps = {
  clients: ClientListItem[];
  options?: ClientFormOptions;
};

const ClientList = ({ clients, options }: ClientListProps) => {
  const t = useTranslations("Clients");
  if (clients.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {clients.map((client) => (
        <li key={client.id}>
          <ClientCard client={client} options={options} />
        </li>
      ))}
    </ul>
  );
};

export { ClientList };
export type { ClientListItem };
