"use client";

import { Bell, CircleHelp, Menu, Search, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

import { useOpenCommandMenu } from "@/components/dashboard/command-menu";
import { ClientFormDrawer } from "@/components/dashboard/client-form-drawer";
import { CreateMenu, CreateMenuItems } from "@/components/dashboard/create-menu";
import { NotificationBell, useNotifications } from "@/components/dashboard/notification-bell";
import { useModKey } from "@/components/dashboard/nav-utils";
import { UserMenu } from "@/components/dashboard/user-menu";
import type { SidebarData, UserData } from "@/components/dashboard16-layout";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ClientFormOptions } from "@/lib/client-form-schema";
import type { ClientStatus } from "@/lib/client-status";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dashboard top bar
// ---------------------------------------------------------------------------
//
// Sits on the same tinted surface as the sidebar, so the two read as one
// frame around the content card. Left: sidebar toggle + brand. Right: a row
// of quiet outline icons (each one does something), a divider, and the
// account pill. Below md the icon row is hidden and its actions move into
// the account menu, so the bar fits a phone.

// Quiet icon buttons: muted until hovered, rounded hover tile.
const barButtonClassName = cn(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/70 outline-none transition-colors",
  "hover:bg-sidebar-accent hover:text-sidebar-foreground",
  "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
  "data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-foreground",
  "motion-reduce:transition-none [&_svg]:size-5 [&_svg]:stroke-[1.75]",
);

// An icon button (or link) with a tooltip that can also name a shortcut.
const BarButton = ({
  label,
  shortcut,
  href,
  children,
  ...props
}: React.ComponentProps<"button"> & { label: string; shortcut?: string; href?: string }) => (
  <Tooltip>
    <TooltipTrigger
      render={
        href ? (
          <Link href={href} aria-label={label} className={barButtonClassName} />
        ) : (
          <button type="button" aria-label={label} className={barButtonClassName} {...props} />
        )
      }
    >
      {children}
    </TooltipTrigger>
    <TooltipContent side="bottom">
      {label}
      {shortcut ? <span className="ml-1.5 opacity-70">{shortcut}</span> : null}
    </TooltipContent>
  </Tooltip>
);

type TopBarProps = {
  logo: SidebarData["logo"];
  user?: UserData;
  /** Services and team members for the "+" menu's create drawer. */
  formOptions?: ClientFormOptions;
};

const TopBar = ({ logo, user, formOptions }: TopBarProps) => {
  const t = useTranslations("TopBar");
  const tNav = useTranslations("Nav");
  const { open, isMobile, openMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const modKey = useModKey();
  const openCommandMenu = useOpenCommandMenu();
  const tNotifications = useTranslations("Notifications");
  const notifications = useNotifications();
  const unreadCount = notifications?.feed.unreadCount ?? 0;
  // The bell is hidden on mobile, so its panel opens from the account pill.
  const accountRef = React.useRef<HTMLSpanElement>(null);

  // One create drawer for both the "+" menu and the mobile account menu.
  // Keyed by status so the form starts fresh with that status.
  const [createStatus, setCreateStatus] = React.useState<ClientStatus>("lead");
  const [createOpen, setCreateOpen] = React.useState(false);
  const openCreate = React.useCallback((status: ClientStatus) => {
    setCreateStatus(status);
    setCreateOpen(true);
  }, []);

  // Links navigate client-side, which keeps the mobile sheet mounted, so
  // close it once the route changes.
  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const sidebarIsOpen = isMobile ? openMobile : open;
  const toggleLabel = isMobile
    ? tNav("openMenu")
    : open
      ? tNav("collapseSidebar", { shortcut: `${modKey}B` })
      : tNav("expandSidebar", { shortcut: `${modKey}B` });

  return (
    <header
      aria-label={t("label")}
      className="flex h-14 w-full shrink-0 items-center gap-2 bg-sidebar pr-3 pl-3 text-sidebar-foreground md:pl-4"
    >
      <BarButton
        label={toggleLabel}
        aria-expanded={sidebarIsOpen}
        aria-keyshortcuts={isMobile ? undefined : modKey === "⌘" ? "Meta+B" : "Control+B"}
        onClick={toggleSidebar}
      >
        <Menu aria-hidden="true" />
      </BarButton>

      {/* Brand: logo, bold name and a muted product line on one row. */}
      <Link
        href="/dashboard"
        className="flex min-w-0 items-center gap-2 rounded-lg py-1 pr-2 pl-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <Image src={logo.src} alt="" width={28} height={28} className="size-7 shrink-0" />
        <span className="truncate text-[17px] leading-none tracking-tight">
          <span className="font-bold">{logo.title}</span>
          <span className="ml-1.5 hidden font-normal text-sidebar-foreground/55 md:inline">
            {t("product")}
          </span>
        </span>
      </Link>

      <nav aria-label={t("actions")} className="ml-auto hidden items-center gap-0.5 md:flex">
        <CreateMenu triggerClassName={barButtonClassName} onCreate={openCreate} />
        <NotificationBell
          anchor={isMobile ? accountRef : undefined}
          className={cn(
            barButtonClassName,
            "border-transparent bg-transparent shadow-none dark:border-transparent dark:bg-transparent dark:hover:bg-sidebar-accent",
          )}
        />
        <BarButton label={t("invite")} href="/dashboard/team">
          <UserPlus aria-hidden="true" />
        </BarButton>
        <BarButton
          label={t("search")}
          shortcut={`${modKey} K`}
          aria-keyshortcuts={modKey === "⌘" ? "Meta+K" : "Control+K"}
          aria-haspopup="dialog"
          onClick={openCommandMenu}
        >
          <Search aria-hidden="true" />
        </BarButton>
        <BarButton label={t("help")} href="/docs/getting-started">
          <CircleHelp aria-hidden="true" />
        </BarButton>
      </nav>

      {user && (
        <>
          <span aria-hidden="true" className="mx-1.5 hidden h-6 w-px bg-sidebar-border md:block" />
          <span ref={accountRef} className="ml-auto flex md:ml-0">
            <UserMenu
              user={user}
              logoSrc={logo.src}
              showDot={unreadCount > 0}
              mobileItems={
                <>
                  <DropdownMenuLabel>{t("create")}</DropdownMenuLabel>
                  <CreateMenuItems onCreate={openCreate} />
                  <DropdownMenuSeparator />
                  {notifications ? (
                    <DropdownMenuItem
                      // Wait for the menu to close (and return focus) before
                      // opening the panel, so its outside-press doesn't
                      // dismiss it straight away.
                      onClick={() => setTimeout(() => notifications.setOpen(true), 0)}
                    >
                      <Bell className="size-4" aria-hidden="true" />
                      {tNotifications("title")}
                      {unreadCount > 0 ? (
                        <span className="ml-auto rounded-full bg-destructive px-1.5 text-[10px] leading-4 font-medium text-white tabular-nums">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      ) : null}
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem onClick={openCommandMenu}>
                    <Search className="size-4" aria-hidden="true" />
                    {t("search")}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dashboard/team" />}>
                    <UserPlus className="size-4" aria-hidden="true" />
                    {t("invite")}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/docs/getting-started" />}>
                    <CircleHelp className="size-4" aria-hidden="true" />
                    {t("help")}
                  </DropdownMenuItem>
                </>
              }
            />
          </span>
        </>
      )}

      <ClientFormDrawer
        key={createStatus}
        defaultStatus={createStatus}
        options={formOptions}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </header>
  );
};

export { TopBar };
