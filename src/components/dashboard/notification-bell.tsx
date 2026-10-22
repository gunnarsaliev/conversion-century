"use client";

import { formatDistanceToNow } from "date-fns";
import { bg as bgDateLocale } from "date-fns/locale";
import { Bell, CalendarClock, CheckCircle2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notification-actions";
import type { NotificationFeed, NotificationItem, NotificationType } from "@/lib/notifications";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ---------------------------------------------------------------------------
// Notifications: provider (polling + toasts) and the header bell
// ---------------------------------------------------------------------------
//
// The dashboard layout loads the signed-in user's feed and hands it to
// NotificationsProvider, which polls for new items while the tab is visible
// and announces unseen unread ones with a sonner toast. NotificationBell
// reads the provider, so any page header can drop it in.

const POLL_INTERVAL_MS = 60_000;
// More new items than this at once get one summary toast instead of a stack.
const MAX_INDIVIDUAL_TOASTS = 3;
// Newest createdAt this browser has announced, so a reload doesn't re-toast.
const LAST_SEEN_KEY = "notifications:lastSeenAt";

const typeIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  consultation: MessageSquare,
  "contract-renewal": CalendarClock,
  "offer-accepted": CheckCircle2,
};

type NotificationsContextValue = {
  feed: NotificationFeed;
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
  openItem: (item: NotificationItem) => void;
  markAllRead: () => void;
};

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

function readLastSeen(): number {
  try {
    return Number(window.localStorage.getItem(LAST_SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeLastSeen(time: number) {
  try {
    window.localStorage.setItem(LAST_SEEN_KEY, String(time));
  } catch {
    // Storage unavailable (private mode, blocked): toasts may repeat on reload.
  }
}

const emptyFeed: NotificationFeed = { items: [], unreadCount: 0 };

const NotificationsProvider = ({
  initialFeed,
  children,
}: {
  initialFeed?: NotificationFeed;
  children: React.ReactNode;
}) => {
  const t = useTranslations("Notifications");
  const router = useRouter();
  const [feed, setFeed] = React.useState(initialFeed ?? emptyFeed);
  const [open, setOpen] = React.useState(false);
  // Ids already shown in this session; null until the first announce.
  const seenIds = React.useRef<Set<number> | null>(null);

  const setRead = React.useCallback((ids: number[] | "all", read: boolean) => {
    setFeed((current) => {
      const items = current.items.map((item) =>
        ids === "all" || ids.includes(item.id) ? { ...item, read } : item,
      );
      return { items, unreadCount: items.filter((item) => !item.read).length };
    });
  }, []);

  const openItem = React.useCallback(
    (item: NotificationItem) => {
      setOpen(false);
      if (!item.read) {
        setRead([item.id], true);
        markNotificationRead(item.id).catch(() => {
          setRead([item.id], false);
          toast.error(t("updateFailed"));
        });
      }
      if (item.href) router.push(item.href);
    },
    [router, setRead, t],
  );

  const markAllRead = React.useCallback(() => {
    const unread = feed.items.filter((item) => !item.read).map((item) => item.id);
    setRead("all", true);
    markAllNotificationsRead()
      .then(() => toast.success(t("allMarkedRead")))
      .catch(() => {
        setRead(unread, false);
        toast.error(t("updateFailed"));
      });
  }, [feed.items, setRead, t]);

  const refresh = React.useCallback(async () => {
    try {
      const next = await fetchNotifications();
      if (next) setFeed(next);
    } catch {
      // Offline or signed out mid-session: keep the last feed.
    }
  }, []);

  // Toast unread items this session hasn't announced yet. On the first run
  // only items newer than this browser's last-seen time count as new.
  React.useEffect(() => {
    const isFirstRun = seenIds.current === null;
    const seen = (seenIds.current ??= new Set());
    const lastSeen = isFirstRun ? readLastSeen() : 0;

    const fresh = feed.items.filter(
      (item) =>
        !item.read && !seen.has(item.id) && new Date(item.createdAt).getTime() > lastSeen,
    );
    for (const item of feed.items) seen.add(item.id);

    const newest = feed.items[0] ? new Date(feed.items[0].createdAt).getTime() : 0;
    if (newest > readLastSeen()) writeLastSeen(newest);

    if (fresh.length === 0) return;

    if (fresh.length > MAX_INDIVIDUAL_TOASTS) {
      toast(t("newCount", { count: fresh.length }), {
        icon: <Bell className="size-4" />,
        action: { label: t("open"), onClick: () => setOpen(true) },
      });
      return;
    }

    for (const item of fresh) {
      const Icon = typeIcons[item.type];
      toast(item.title, {
        id: `notification-${item.id}`,
        description: item.message ?? undefined,
        icon: <Icon className="size-4" />,
        action: { label: t("view"), onClick: () => openItem(item) },
      });
    }
  }, [feed.items, openItem, t]);

  // Poll while the tab is visible, and catch up as soon as it's refocused.
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const value = React.useMemo(
    () => ({ feed, open, setOpen, refresh, openItem, markAllRead }),
    [feed, open, refresh, openItem, markAllRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

const NotificationBell = ({ className }: { className?: string }) => {
  const context = React.useContext(NotificationsContext);
  if (!context) throw new Error("NotificationBell must be used inside NotificationsProvider");

  const t = useTranslations("Notifications");
  const locale = useLocale();
  const { feed, open, setOpen, refresh, openItem, markAllRead } = context;
  const { items, unreadCount } = feed;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) void refresh();
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={cn("relative size-8", className)}
            aria-label={
              unreadCount > 0 ? t("labelUnread", { count: unreadCount }) : t("title")
            }
          />
        }
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-medium text-white tabular-nums"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-0 p-0 sm:w-96">
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
          <p className="text-sm font-medium">{t("title")}</p>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={markAllRead}>
              {t("markAllRead")}
            </Button>
          )}
        </div>
        {items.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <ul className="max-h-96 divide-y overflow-y-auto overscroll-contain">
              {items.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => openItem(item)}
                      className={cn(
                        "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none",
                        !item.read && "bg-muted/30",
                      )}
                    >
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm",
                            !item.read && "font-medium",
                          )}
                        >
                          {item.title}
                        </span>
                        {item.message && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.message}
                          </span>
                        )}
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                            locale: locale === "bg" ? bgDateLocale : undefined,
                          })}
                        </span>
                      </span>
                      {!item.read && (
                        <span
                          className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                          aria-label={t("unread")}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
        )}
      </PopoverContent>
    </Popover>
  );
};

export { NotificationBell, NotificationsProvider };
