"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import * as React from "react";

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
import type { ClientStatus } from "@/lib/client-status";

// ---------------------------------------------------------------------------
// "+" create menu — top bar
// ---------------------------------------------------------------------------
//
// Consultations, leads and clients are all Clients records, so each opens
// the same create drawer with its status preselected. Offers are created in
// their own editor at /dashboard/offers/new. The drawer itself lives in the top bar,
// so the mobile account menu can open it too.

const createClientEntries: { status: ClientStatus; key: string; icon: keyof typeof sidebarIcons }[] = [
  { status: "consultation", key: "newConsultation", icon: "consultations" },
  { status: "lead", key: "newLead", icon: "leads" },
  { status: "active", key: "newClient", icon: "clients" },
];

const NEW_OFFER_HREF = "/dashboard/offers/new";

// The create entries as menu items, for any dropdown menu. Items open the
// drawer from a plain onClick rather than nesting a dialog trigger, which
// Base UI's Menu doesn't support.
const CreateMenuItems = ({ onCreate }: { onCreate: (status: ClientStatus) => void }) => {
  const t = useTranslations("TopBar");

  return (
    <>
      {createClientEntries.map((entry) => (
        <DropdownMenuItem key={entry.status} onClick={() => onCreate(entry.status)}>
          <SidebarIcon icon={sidebarIcons[entry.icon]} className="size-4" />
          {t(entry.key)}
        </DropdownMenuItem>
      ))}
      <DropdownMenuItem render={<Link href={NEW_OFFER_HREF} />}>
        <SidebarIcon icon={sidebarIcons.offers} className="size-4" />
        {t("newOffer")}
      </DropdownMenuItem>
    </>
  );
};

type CreateMenuProps = {
  // Trigger styling, shared with the top bar's other icon buttons.
  triggerClassName: string;
  onCreate: (status: ClientStatus) => void;
};

const CreateMenu = ({ triggerClassName, onCreate }: CreateMenuProps) => {
  const t = useTranslations("TopBar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t("create")} title={t("create")} className={triggerClassName}>
        <Plus aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("create")}</DropdownMenuLabel>
          <CreateMenuItems onCreate={onCreate} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CreateMenu, CreateMenuItems };
