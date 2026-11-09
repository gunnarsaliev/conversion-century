"use client";

import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";

import { SidebarIcon } from "@/components/dashboard/sidebar-icon";
import { isAppRoute } from "@/components/dashboard/nav-utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { NavGroup, NavItem } from "@/components/dashboard16-layout";

// ---------------------------------------------------------------------------
// Command palette — ⌘K / Ctrl+K from anywhere in the dashboard
// ---------------------------------------------------------------------------

type CommandMenuProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Pages to jump to, already filtered for the user's role.
  groups: NavGroup[];
};

const CommandMenu = ({ open, setOpen, groups }: CommandMenuProps) => {
  const t = useTranslations("Nav");
  const tItems = useTranslations("Nav.items");
  const tGroups = useTranslations("Nav.groups");
  const router = useRouter();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  const go = (item: NavItem) => {
    setOpen(false);
    if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else if (isAppRoute(item.href)) router.push(item.href);
    else window.location.assign(item.href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t("search")}
      description={t("searchPlaceholder")}
    >
      <Command>
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.key} heading={tGroups(group.key)}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.key}
                  value={`${tItems(item.key)} ${item.key}`}
                  onSelect={() => go(item)}
                >
                  <SidebarIcon icon={item.icon} className="size-4" />
                  {tItems(item.key)}
                  {item.external ? (
                    <ExternalLink
                      className="ml-auto size-3.5 text-muted-foreground"
                      aria-label={t("opensInNewTab")}
                    />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

// Lets any dashboard component open the palette (top bar search icon, the
// overview's Quick search button) without owning its state.
const CommandMenuContext = React.createContext<(() => void) | null>(null);

const CommandMenuProvider = ({
  groups,
  children,
}: {
  groups: NavGroup[];
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const openMenu = React.useCallback(() => setOpen(true), []);

  return (
    <CommandMenuContext.Provider value={openMenu}>
      {children}
      <CommandMenu open={open} setOpen={setOpen} groups={groups} />
    </CommandMenuContext.Provider>
  );
};

const useOpenCommandMenu = () => {
  const openMenu = React.useContext(CommandMenuContext);
  if (!openMenu) throw new Error("useOpenCommandMenu must be used inside CommandMenuProvider");
  return openMenu;
};

export { CommandMenuProvider, useOpenCommandMenu };
