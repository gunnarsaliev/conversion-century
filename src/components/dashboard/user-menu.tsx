"use client";

import { LogOut, Palette, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { UserData } from "@/components/dashboard16-layout";

// ---------------------------------------------------------------------------
// Account menu — avatar button in the top bar
// ---------------------------------------------------------------------------

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const UserAvatar = ({ user, round = false }: { user: UserData; round?: boolean }) => (
  <Avatar className={cn("size-8", round ? "rounded-full" : "rounded-lg")}>
    <AvatarImage src={user.avatar} alt="" className={round ? "rounded-full" : "rounded-lg"} />
    <AvatarFallback className={cn(round ? "rounded-full" : "rounded-lg", "bg-primary/15 text-xs font-medium text-primary-700 dark:text-primary-300")}>
      {initials(user.name)}
    </AvatarFallback>
  </Avatar>
);

// The trigger is a pill pairing the workspace logo with the user's avatar.
const UserMenu = ({ user, logoSrc }: { user: UserData; logoSrc?: string }) => {
  const t = useTranslations("Nav.user");
  const tTopBar = useTranslations("TopBar");
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
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={tTopBar("account", { name: user.name })}
        className="flex items-center gap-1.5 rounded-full border border-sidebar-border bg-background py-0.5 pr-0.5 pl-1.5 shadow-xs outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-popup-open:bg-sidebar-accent motion-reduce:transition-none dark:bg-sidebar-accent/60"
      >
        {logoSrc ? (
          <Image src={logoSrc} alt="" width={20} height={20} className="size-5" />
        ) : null}
        <UserAvatar user={user} round />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-60 rounded-lg" side="bottom" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserAvatar user={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-foreground">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <User className="size-4" aria-hidden="true" />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/preferences" />}>
          <Palette className="size-4" aria-hidden="true" />
          {t("preferences")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={isLoggingOut} onClick={handleLogout}>
          <LogOut className="size-4" aria-hidden="true" />
          {isLoggingOut ? t("loggingOut") : t("logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
