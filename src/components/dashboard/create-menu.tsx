"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import * as React from "react";

import { ClientFormDrawer } from "@/components/dashboard/client-form-drawer";
import { SidebarIcon } from "@/components/dashboard/sidebar-icon";
import { sidebarIcons } from "@/components/dashboard/sidebar-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ClientFormOptions } from "@/lib/client-form-schema";
import type { ClientStatus } from "@/lib/client-status";

// ---------------------------------------------------------------------------
// "+" create menu — top bar
// ---------------------------------------------------------------------------
//
// Consultations, leads and clients are all Clients records, so each opens
// the same create drawer with its status preselected. Offers are created in
// their own editor at /offers/new.

type CreateMenuProps = {
  // Trigger styling, shared with the top bar's other icon buttons.
  triggerClassName: string;
  formOptions?: ClientFormOptions;
};

const clientEntries: { status: ClientStatus; key: string; icon: keyof typeof sidebarIcons }[] = [
  { status: "consultation", key: "newConsultation", icon: "consultations" },
  { status: "lead", key: "newLead", icon: "leads" },
  { status: "active", key: "newClient", icon: "clients" },
];

const CreateMenu = ({ triggerClassName, formOptions }: CreateMenuProps) => {
  const t = useTranslations("TopBar");
  // The drawer is opened from a plain onClick rather than nested as a menu
  // item's dialog trigger, which Base UI's Menu doesn't support.
  const [drawerStatus, setDrawerStatus] = React.useState<ClientStatus>("lead");
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label={t("create")} title={t("create")} className={triggerClassName}>
          <Plus aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="min-w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("create")}</DropdownMenuLabel>
            {clientEntries.map((entry) => (
              <DropdownMenuItem
                key={entry.status}
                onClick={() => {
                  setDrawerStatus(entry.status);
                  setDrawerOpen(true);
                }}
              >
                <SidebarIcon icon={sidebarIcons[entry.icon]} className="size-4" />
                {t(entry.key)}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem render={<Link href="/offers/new" />}>
              <SidebarIcon icon={sidebarIcons.offers} className="size-4" />
              {t("newOffer")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keyed by status so the form starts fresh with that status. */}
      <ClientFormDrawer
        key={drawerStatus}
        defaultStatus={drawerStatus}
        options={formOptions}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
};

export { CreateMenu };
