"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

import { routing } from "@/i18n/routing";
import { useSwitchLocale } from "@/i18n/use-switch-locale";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Footer language switcher
// ---------------------------------------------------------------------------
//
// Navigation goes through useSwitchLocale, which follows the page's hreflang
// alternates so per-locale slugs resolve correctly.

type Locale = (typeof routing.locales)[number];

const LANGUAGES: Record<Locale, string> = {
  en: "English",
  bg: "Български",
};

export function FooterLanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const switchLocale = useSwitchLocale();
  const [isPending, startTransition] = useTransition();

  const switchTo = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    startTransition(() => {
      switchLocale(nextLocale, { scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex rounded-full bg-muted p-1 text-sm font-medium",
        isPending && "opacity-60",
      )}
    >
      {routing.locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={option === locale}
          onClick={() => switchTo(option)}
          className={cn(
            "rounded-full px-3 py-1 transition-colors hover:text-primary",
            option === locale && "bg-background text-foreground shadow-sm",
          )}
        >
          {LANGUAGES[option]}
        </button>
      ))}
    </div>
  );
}
