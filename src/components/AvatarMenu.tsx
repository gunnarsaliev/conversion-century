"use client";

import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AvatarMenu() {
  const router = useRouter();

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
          <AvatarImage alt="" src="https://github.com/haydenbleasel.png" />
          <AvatarFallback className="rounded-lg">U</AvatarFallback>
        </Avatar>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8}>
          <Menu.Popup
            className={cn(
              "z-[60] min-w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg outline-none",
              "dark:border-slate-700 dark:bg-slate-800",
            )}
          >
            <Menu.Item
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm text-slate-700 outline-none select-none",
                "data-[highlighted]:bg-slate-100 dark:text-slate-200 dark:data-[highlighted]:bg-slate-700",
              )}
              onClick={handleLogout}
            >
              Log out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
