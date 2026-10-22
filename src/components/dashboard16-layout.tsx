"use client";

import {
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Euro,
  FileText,
  Globe,
  Handshake,
  Images,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { NotificationFeed } from "@/lib/notifications";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsProvider } from "@/components/dashboard/notification-bell";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

// ---------------------------------------------------------------------------
// Sidebar navigation types & data
// ---------------------------------------------------------------------------

// `key` names the item's label in the dashboard `Nav` messages.
type NavItem = {
  key: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  key: string;
  items: NavItem[];
  defaultOpen?: boolean;
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
      defaultOpen: true,
      items: [
        {
          key: "dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          isActive: true,
        },
        { key: "clients", icon: Users, href: "/dashboard/clients" },
        { key: "leads", icon: Handshake, href: "/dashboard/leads" },
        { key: "offers", icon: FileText, href: "/dashboard/offers" },
        { key: "pricelist", icon: Euro, href: "/dashboard/pricelist" },
        { key: "media", icon: Images, href: "/dashboard/media" },
        { key: "website", icon: Globe, href: "/" },
      ],
    },
    {
      key: "administration",
      defaultOpen: false,
      items: [
        { key: "team", icon: ShieldCheck, href: "/dashboard/team" },
        { key: "docs", icon: BookOpen, href: "/docs/getting-started" },
      ],
    },
  ],
  footerGroup: {
    key: "settings",
    items: [{ key: "settings", icon: Settings, href: "/dashboard/settings" }],
  },
};

// ---------------------------------------------------------------------------
// Sidebar sub-components
// ---------------------------------------------------------------------------

const SidebarLogo = ({ logo }: { logo: SidebarData["logo"] }) => {
  const t = useTranslations("Nav");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip={logo.title}
          render={<Link href="/dashboard" />}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-sm border">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={24}
              height={24}
              className="size-6"
            />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">{logo.title}</span>
            <span className="text-xs text-muted-foreground">
              {t("tagline")}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const t = useTranslations("Nav.items");
  const label = t(item.key);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={item.isActive} tooltip={label} render={<a href={item.href} />}><Icon className="size-4" aria-hidden="true" /><span>{label}</span></SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}><CollapsibleTrigger render={<SidebarMenuButton isActive={item.isActive} tooltip={label} />}><Icon className="size-4" aria-hidden="true" /><span>{label}</span><ChevronRight
                                  className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                  aria-hidden="true"
                                /></CollapsibleTrigger><CollapsibleContent>
                <SidebarMenuSub>
                  {item.children!.map((child) => (
                    <SidebarMenuSubItem key={child.key}>
                      <SidebarMenuSubButton isActive={child.isActive} render={<a href={child.href} />}>{t(child.key)}</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent></Collapsible>
  );
};

const NavUser = ({ user }: { user: UserData }) => {
  const t = useTranslations("Nav.user");
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" />}><Avatar className="size-8 rounded-lg">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback className="rounded-lg">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar><div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-medium">{user.name}</span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div><ChevronsUpDown className="ml-auto size-4" aria-hidden="true" /></DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <User className="mr-2 size-4" aria-hidden="true" />
              {t("profile")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/preferences" />}>
              <Palette className="mr-2 size-4" aria-hidden="true" />
              {t("preferences")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isLoggingOut} onClick={handleLogout}>
              <LogOut className="mr-2 size-4" aria-hidden="true" />
              {isLoggingOut ? t("loggingOut") : t("logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AppSidebar = ({
  user,
  isAdmin,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: UserData;
  isAdmin?: boolean;
}) => {
  const t = useTranslations("Nav.groups");
  const navGroups = React.useMemo(() => {
    if (!isAdmin) return sidebarData.navGroups;

    return sidebarData.navGroups.map((group) => {
      if (group.key !== "administration") return group;

      return {
        ...group,
        items: [
          ...group.items,
          { key: "admin", icon: ShieldCheck, href: "/admin" },
        ],
      };
    });
  }, [isAdmin]);

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col">
          <SidebarLogo logo={sidebarData.logo} />
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:ml-0" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          {navGroups.map((group) => (
            <SidebarGroup key={group.key}>
              <SidebarGroupLabel>{t(group.key)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <NavMenuItem key={item.key} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

// ---------------------------------------------------------------------------
// Dashboard shell — sidebar + chrome, wraps page content
// ---------------------------------------------------------------------------

const DashboardLayout = ({
  children,
  className,
  user,
  isAdmin,
  notifications,
}: {
  children: React.ReactNode;
  className?: string;
  user?: UserData;
  isAdmin?: boolean;
  notifications?: NotificationFeed;
}) => {
  const t = useTranslations("Nav");

  return (
    <NotificationsProvider initialFeed={notifications}>
      <SidebarProvider className={cn("bg-sidebar", className)}>
        <a
          href="#dashboard-main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:ring-2 focus:ring-ring"
        >
          {t("skipToContent")}
        </a>
        <AppSidebar user={user} isAdmin={isAdmin} />
        <div className="h-svh w-full overflow-hidden lg:p-2">
          <div className="flex h-full w-full flex-col bg-background lg:rounded-xl lg:border">
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
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </NotificationsProvider>
  );
};

export { DashboardLayout, sidebarData };
export type { NavItem, NavGroup, UserData, SidebarData };
