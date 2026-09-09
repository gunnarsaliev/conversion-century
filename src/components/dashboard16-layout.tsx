"use client";

import {
  BedDouble,
  CalendarRange,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  DoorOpen,
  Globe,
  Handshake,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

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

// ---------------------------------------------------------------------------
// Sidebar navigation types & data
// ---------------------------------------------------------------------------

type NavItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  isActive?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  title: string;
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
    description: string;
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
    description: "Your SEO Muse",
  },
  navGroups: [
    {
      title: "Front Office",
      defaultOpen: true,
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          isActive: true,
        },
        { label: "Clients", icon: Users, href: "/dashboard/clients" },
        { label: "Leads", icon: Handshake, href: "/dashboard/leads" },
        // { label: "Check-in / Check-out", icon: DoorOpen, href: "#" },
        // {
        //   label: "Guest Profiles",
        //   icon: Users,
        //   href: "#",
        //   children: [
        //     { label: "All Guests", icon: Users, href: "#" },
        //     { label: "Loyalty Members", icon: Users, href: "#" },
        //     { label: "Corporate Accounts", icon: Users, href: "#" },
        //   ],
        // },
      ],
    },
    // {
    //   title: "Property",
    //   defaultOpen: true,
    //   items: [
    //     {
    //       label: "Rooms & Suites",
    //       icon: BedDouble,
    //       href: "#",
    //       children: [
    //         { label: "Floor Plan", icon: BedDouble, href: "#" },
    //         { label: "Room Types", icon: BedDouble, href: "#" },
    //         { label: "Availability", icon: BedDouble, href: "#" },
    //       ],
    //     },
    //     { label: "Housekeeping", icon: Sparkles, href: "#" },
    //     { label: "Dining & Events", icon: UtensilsCrossed, href: "#" },
    //   ],
    // },
    // {
    //   title: "Revenue",
    //   defaultOpen: false,
    //   items: [
    //     { label: "Rate Manager", icon: CreditCard, href: "#" },
    //     { label: "Billing & Invoices", icon: Wallet, href: "#" },
    //     { label: "Channel Distribution", icon: Globe, href: "#" },
    //   ],
    // },
    {
      title: "Administration",
      defaultOpen: false,
      items: [
        { label: "Staff & Roles", icon: ShieldCheck, href: "/dashboard/team" },
        // { label: "Maintenance Logs", icon: Wrench, href: "#" },
        // { label: "Security & Access", icon: KeyRound, href: "#" },
      ],
    },
  ],
  footerGroup: {
    title: "Settings",
    items: [
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
  user: {
    name: "Robert Austin",
    email: "robert@grandview.hotel",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar22.jpg",
  },
};

// ---------------------------------------------------------------------------
// Sidebar sub-components
// ---------------------------------------------------------------------------

const SidebarLogo = ({ logo }: { logo: SidebarData["logo"] }) => {
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
              {logo.description}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const NavMenuItem = ({ item }: { item: NavItem }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={item.isActive} tooltip={item.label} render={<a href={item.href} />}><Icon className="size-4" aria-hidden="true" /><span>{item.label}</span></SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}><CollapsibleTrigger render={<SidebarMenuButton isActive={item.isActive} tooltip={item.label} />}><Icon className="size-4" aria-hidden="true" /><span>{item.label}</span><ChevronRight
                                  className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                  aria-hidden="true"
                                /></CollapsibleTrigger><CollapsibleContent>
                <SidebarMenuSub>
                  {item.children!.map((child) => (
                    <SidebarMenuSubItem key={child.label}>
                      <SidebarMenuSubButton isActive={child.isActive} render={<a href={child.href} />}>{child.label}</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent></Collapsible>
  );
};

const NavUser = ({ user }: { user: UserData }) => {
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
      router.push("/");
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
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/preferences" />}>
              <Palette className="mr-2 size-4" aria-hidden="true" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isLoggingOut} onClick={handleLogout}>
              <LogOut className="mr-2 size-4" aria-hidden="true" />
              {isLoggingOut ? "Logging out…" : "Log Out"}
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
  const navGroups = React.useMemo(() => {
    if (!isAdmin) return sidebarData.navGroups;

    return sidebarData.navGroups.map((group) => {
      if (group.title !== "Administration") return group;

      return {
        ...group,
        items: [
          ...group.items,
          { label: "Admin", icon: ShieldCheck, href: "/admin" },
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
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <NavMenuItem key={item.label} item={item} />
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
}: {
  children: React.ReactNode;
  className?: string;
  user?: UserData;
  isAdmin?: boolean;
}) => {
  return (
    <SidebarProvider className={cn("bg-sidebar", className)}>
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <AppSidebar user={user ?? sidebarData.user} isAdmin={isAdmin} />
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
    </SidebarProvider>
  );
};

export { DashboardLayout, sidebarData };
export type { NavItem, NavGroup, UserData, SidebarData };
