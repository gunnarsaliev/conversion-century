"use client";

import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { useOpenCommandMenu } from "@/components/dashboard/command-menu";
import { useModKey } from "@/components/dashboard/nav-utils";

// Primary call to action on the overview: opens the ⌘K search palette.
const QuickSearchButton = () => {
  const t = useTranslations("Overview");
  const openCommandMenu = useOpenCommandMenu();
  const modKey = useModKey();

  return (
    <button
      type="button"
      onClick={openCommandMenu}
      aria-haspopup="dialog"
      aria-keyshortcuts={modKey === "⌘" ? "Meta+K" : "Control+K"}
      title={`${t("quickSearch")} (${modKey} K)`}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-(--action) px-4 text-sm font-semibold text-(--action-foreground) shadow-xs outline-none transition-colors hover:bg-(--action-hover) focus-visible:ring-3 focus-visible:ring-(--action)/40 motion-reduce:transition-none"
    >
      <Zap className="size-4 fill-current" aria-hidden="true" />
      {t("quickSearch")}
    </button>
  );
};

export { QuickSearchButton };
