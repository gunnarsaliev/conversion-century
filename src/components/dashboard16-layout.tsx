"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { ClientFormOptions } from "@/lib/client-form-schema";
import type { NotificationFeed } from "@/lib/notifications";
import { routing } from "@/i18n/routing";
import { isAppRoute } from "@/components/dashboard/nav-utils";
import { NotificationsProvider } from "@/components/dashboard/notification-bell";
import { RecentChats } from "@/components/dashboard/recent-chats";
import { SidebarIcon, type SidebarIconData } from "@/components/dashboard/sidebar-icon";
import { sidebarIcons } from "@/components/dashboard/sidebar-icons";
import { CommandMenuProvider } from "@/components/dashboard/command-menu";
import { TopBar } from "@/components/dashboard/top-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

// ---------------------------------------------------------------------------
// Sidebar navigation types & data
// ---------------------------------------------------------------------------

// `key` names the item's label in the dashboard `Nav` messages.
type NavItem = {
  key: string;
  icon: SidebarIconData;
  href: string;
  /** Only shown to admins and editors. */
  adminOnly?: boolean;
  /** A separate app (Payload's /admin): opens in a new tab. */
  external?: boolean;
};

// Whether a nav item matches the current route. Section items also match
// their sub-pages (/dashboard/leads/42 → Leads); the Overview and website
// links only match exactly, or they'd light up everywhere.
const isNavItemActive = (href: string, pathname: string) => {
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);
  const path = pathname.replace(localePattern, "") || "/";
  if (href === "/" || href === "/dashboard") return path === href;
  return path === href || path.startsWith(`${href}/`);
};

type NavGroup = {
  key: string;
  items: NavItem[];
};

type UserData = {
  name: string;
  email: string;
  avatar: string;
};

type SidebarData = {
  logo: {
    src: string;
    alt: string;
    title: string;
  };
  navGroups: NavGroup[];
  footerGroup: NavGroup;
  user?: UserData;
};

const sidebarData: SidebarData = {
  logo: {
    src: "https://pub-05efc1b2acd64b71beacdf66eed34654.r2.dev/icon.png",
    alt: "Conversion Century",
    title: "Conversion Century",
  },
  navGroups: [
    {
      key: "frontOffice",
      items: [
        { key: "dashboard", icon: sidebarIcons.dashboard, href: "/dashboard" },
        { key: "admin", icon: sidebarIcons.admin, href: "/admin", adminOnly: true, external: true },
        { key: "media", icon: sidebarIcons.media, href: "/dashboard/media" },
      ],
    },
    {
      key: "salesFunnel",
      items: [
        { key: "consultations", icon: sidebarIcons.consultations, href: "/dashboard/consultations" },
        { key: "leads", icon: sidebarIcons.leads, href: "/dashboard/leads" },
        { key: "clients", icon: sidebarIcons.clients, href: "/dashboard/clients" },
      ],
    },
    {
      key: "marketing",
      items: [
        { key: "offers", icon: sidebarIcons.offers, href: "/dashboard/offers" },
        { key: "seo", icon: sidebarIcons.seo, href: "/dashboard/seo", adminOnly: true },
        { key: "pricelist", icon: sidebarIcons.pricelist, href: "/dashboard/pricelist" },
      ],
    },
    {
      key: "administration",
      items: [
        { key: "team", icon: sidebarIcons.team, href: "/dashboard/team" },
      ],
    },
  ],
  footerGroup: {
    key: "settings",
    items: [{ key: "settings", icon: sidebarIcons.settings, href: "/dashboard/settings" }],
  },
};

// ---------------------------------------------------------------------------
// Sidebar sub-components
// ---------------------------------------------------------------------------

// Shared look for nav rows: roomy 40px rows, muted until hovered, and the
// current page as a light-blue pill with bold text (tokens in tailwind.css,
// `.dashboard-shell`).
const navButtonClassName = cn(
  "h-10 gap-3 rounded-lg px-2.5 text-[15px] font-medium text-sidebar-foreground/80 transition-colors",
  "hover:bg-sidebar-accent hover:text-sidebar-foreground",
  "data-active:bg-(--nav-active) data-active:font-semibold data-active:text-(--nav-active-foreground)",
  "data-active:hover:bg-(--nav-active) data-active:hover:text-(--nav-active-foreground)",
);

const navIconClassName = "size-5! group-data-[collapsible=icon]:size-4!";

const NavLink = ({ href, ...props }: React.ComponentProps<"a"> & { href: string }) =>
  isAppRoute(href) ? <Link href={href} {...props} /> : <a href={href} {...props} />;

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const t = useTranslations("Nav.items");
  const tNav = useTranslations("Nav");
  const label = t(item.key);
  const pathname = usePathname();
  const isActive = isNavItemActive(item.href, pathname);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={label}
        className={navButtonClassName}
        render={
          item.external ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer" />
          ) : (
            <NavLink href={item.href} aria-current={isActive ? "page" : undefined} />
          )
        }
      >
        <SidebarIcon icon={item.icon} className={navIconClassName} />
        <span className="min-w-0 truncate">{label}</span>
        {item.external ? (
          <>
            <ExternalLink
              className="ml-auto size-3.5! text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden"
              aria-hidden="true"
            />
            <span className="sr-only">{tNav("opensInNewTab")}</span>
          </>
        ) : null}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

// The sidebar sits below the top bar (h-14), so its fixed panel starts
// there instead of at the top of the viewport.
const AppSidebar = ({
  navGroups,
  ...props
}: React.ComponentProps<typeof Sidebar> & { navGroups: NavGroup[] }) => {
  const tGroups = useTranslations("Nav.groups");

  return (
    <Sidebar
      variant="inset"
      collapsible="offcanvas"
      className="md:top-14 md:h-[calc(100svh-3.5rem)]"
      {...props}
    >
      <SidebarContent>
        <ScrollArea className="h-full">
          {navGroups.map((group, index) => (
            <React.Fragment key={group.key}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase">
                  {tGroups(group.key)}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {group.items.map((item) => (
                      <NavMenuItem key={item.key} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {/* The user's AI search chats, under the first group (Dashboard). */}
              {index === 0 && (
                <React.Suspense>
                  <RecentChats />
                </React.Suspense>
              )}
            </React.Fragment>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-0.5">
          {sidebarData.footerGroup.items.map((item) => (
            <NavMenuItem key={item.key} item={item} />
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

// Nav groups for the user's role: SEO and Admin are for admins and editors.
const visibleNavGroups = (isAdmin: boolean | undefined) =>
  sidebarData.navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isAdmin || !item.adminOnly),
    }))
    .filter((group) => group.items.length > 0);

// ---------------------------------------------------------------------------
// Dashboard shell — top bar + sidebar + content card
// ---------------------------------------------------------------------------

const DashboardLayout = ({
  children,
  className,
  user,
  isAdmin,
  notifications,
  formOptions,
  defaultSidebarOpen = true,
}: {
  children: React.ReactNode;
  className?: string;
  user?: UserData;
  /** Admins and editors: shows SEO and the link to /admin. */
  isAdmin?: boolean;
  notifications?: NotificationFeed;
  /** Services and team members for the top bar's "+" create drawer. */
  formOptions?: ClientFormOptions;
  /** Expanded/collapsed state from the `sidebar_state` cookie. */
  defaultSidebarOpen?: boolean;
}) => {
  const t = useTranslations("Nav");
  const navGroups = React.useMemo(() => visibleNavGroups(isAdmin), [isAdmin]);
  // Everything the search palette can jump to.
  const searchGroups = React.useMemo(
    () => [...navGroups, sidebarData.footerGroup],
    [navGroups],
  );

  return (
    <NotificationsProvider initialFeed={notifications}>
      <CommandMenuProvider groups={searchGroups}>
      <SidebarProvider
        defaultOpen={defaultSidebarOpen}
        className={cn("dashboard-shell flex-col bg-sidebar", className)}
      >
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:ring-2 focus:ring-ring"
        >
          {t("skipToContent")}
        </a>
        <TopBar logo={sidebarData.logo} user={user} formOptions={formOptions} />
        <div className="flex min-h-0 w-full flex-1">
          <AppSidebar navGroups={navGroups} />
          <div className="h-[calc(100svh-3.5rem)] w-full min-w-0 overflow-hidden lg:p-2">
            <div className="flex h-full w-full flex-col overflow-hidden bg-white lg:rounded-xl lg:border dark:bg-background">
              <div className="min-h-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div
                    id="dashboard-main"
                    tabIndex={-1}
                    className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6"
                  >
                    {children}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </SidebarProvider>
      </CommandMenuProvider>
    </NotificationsProvider>
  );
};

export { DashboardLayout, sidebarData };
export type { NavItem, NavGroup, UserData, SidebarData };
