"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Menu } from "@base-ui/react/menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Media, User } from "../../payload-types";

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
];

const otherLocale: Record<string, string> = {
  bg: "en",
  en: "bg",
};

const itemClassName = cn(
  "cursor-pointer px-3 py-1.5 text-sm text-slate-700 outline-none select-none",
  "data-[highlighted]:bg-slate-100 dark:text-slate-200 dark:data-[highlighted]:bg-slate-700",
);

const popupClassName = cn(
  "z-[60] min-w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg outline-none",
  "dark:border-slate-700 dark:bg-slate-800",
);

function CheckIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </svg>
  );
}

export function AvatarMenu({ user }: { user?: User | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const profileImage =
    user?.profileImage && typeof user.profileImage === "object"
      ? (user.profileImage as Media)
      : null;
  const initial = user?.email?.[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const nextLocale = otherLocale[locale] ?? locale;

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        className="group rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-label="Account menu"
      >
        <Avatar className="rounded-lg">
          {profileImage?.url && (
            <AvatarImage alt={profileImage.alt ?? ""} src={profileImage.url} />
          )}
          <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
        </Avatar>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-[60]">
          <Menu.Popup className={popupClassName}>
            {mounted && (
              <Menu.SubmenuRoot>
                <Menu.SubmenuTrigger className={cn(itemClassName, "flex items-center justify-between")}>
                  Theme
                  <span className="ml-3 text-xs text-slate-400 capitalize dark:text-slate-500">
                    {theme}
                  </span>
                </Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner side="right" align="start" sideOffset={4} className="z-[60]">
                    <Menu.Popup className={popupClassName}>
                      <Menu.RadioGroup value={theme} onValueChange={setTheme}>
                        {themes.map((t) => (
                          <Menu.RadioItem
                            key={t.value}
                            value={t.value}
                            className={cn(
                              itemClassName,
                              "grid grid-cols-[1rem_1fr] items-center gap-2",
                            )}
                          >
                            <Menu.RadioItemIndicator className="col-start-1">
                              <CheckIcon className="h-3.5 w-3.5" />
                            </Menu.RadioItemIndicator>
                            <span className="col-start-2">{t.name}</span>
                          </Menu.RadioItem>
                        ))}
                      </Menu.RadioGroup>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.SubmenuRoot>
            )}

            <Menu.Item
              className={cn(itemClassName, "flex items-center justify-between")}
              onClick={() => router.replace(pathname, { locale: nextLocale })}
            >
              Language
              <span className="ml-3 text-xs text-slate-400 dark:text-slate-500">
                {locale.toUpperCase()}
              </span>
            </Menu.Item>

            <Menu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-700" />

            <Menu.Item className={itemClassName} onClick={handleLogout}>
              Log out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
