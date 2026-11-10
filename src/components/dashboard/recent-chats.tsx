"use client";

import { MessageSquare, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { deleteChat, listMyChats, type ChatSummary } from "@/lib/ai-chat-actions";
import { AI_CHATS_CHANGED } from "@/lib/ai-chat-events";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Recent AI search chats (dashboard sidebar)
// ---------------------------------------------------------------------------
//
// The signed-in user's own chats (src/lib/ai-chat-actions.ts), newest first.
// Reloads when the AI search saves a chat (AI_CHATS_CHANGED). Hidden while
// the sidebar is collapsed to icons.

const VISIBLE_CHATS = 10;

const rowClassName = cn(
  "h-9 gap-2.5 rounded-lg px-2.5 text-sm text-sidebar-foreground/80 transition-colors",
  "hover:bg-sidebar-accent hover:text-sidebar-foreground",
  "data-active:bg-(--nav-active) data-active:font-semibold data-active:text-(--nav-active-foreground)",
  "data-active:hover:bg-(--nav-active) data-active:hover:text-(--nav-active-foreground)",
);

const RecentChats = () => {
  const t = useTranslations("RecentChats");
  const router = useRouter();
  const pathname = usePathname();
  const activeId = Number(useSearchParams().get("chat")) || null;
  const [chats, setChats] = React.useState<ChatSummary[] | null>(null);

  // The AI search lives on the dashboard home, with or without a locale prefix.
  const homePath = pathname.replace(/\/dashboard(\/.*)?$/, "/dashboard");
  const onHome = pathname === homePath;

  const load = React.useCallback(() => {
    listMyChats(VISIBLE_CHATS)
      .then(setChats)
      .catch(() => setChats((current) => current ?? []));
  }, []);

  React.useEffect(() => {
    load();
    window.addEventListener(AI_CHATS_CHANGED, load);
    return () => window.removeEventListener(AI_CHATS_CHANGED, load);
  }, [load]);

  const remove = async (chat: ChatSummary) => {
    setChats((current) => current?.filter((item) => item.id !== chat.id) ?? null);
    try {
      await deleteChat(chat.id);
      toast(t("deleted"));
      if (onHome && activeId === chat.id) router.push(homePath);
    } catch {
      load();
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase">
        {t("title")}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton className={rowClassName} render={<Link href={homePath} />}>
              <SquarePen className="size-4!" aria-hidden="true" />
              <span className="min-w-0 truncate">{t("newChat")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {chats?.map((chat) => {
            const isActive = onHome && chat.id === activeId;
            return (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  className={cn(rowClassName, "pr-8")}
                  render={
                    <Link
                      href={`${homePath}?chat=${chat.id}`}
                      aria-current={isActive ? "page" : undefined}
                      title={chat.title}
                    />
                  }
                >
                  <MessageSquare className="size-4! opacity-60" aria-hidden="true" />
                  <span className="min-w-0 truncate">{chat.title}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  showOnHover
                  className="top-2!"
                  aria-label={`${t("delete")}: ${chat.title}`}
                  onClick={() => void remove(chat)}
                >
                  <Trash2 aria-hidden="true" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            );
          })}

          {chats?.length === 0 && (
            <p className="px-2.5 py-1.5 text-xs text-sidebar-foreground/60">{t("empty")}</p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export { RecentChats };
