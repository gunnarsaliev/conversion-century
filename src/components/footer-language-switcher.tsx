"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Footer language switcher
// ---------------------------------------------------------------------------
//
// Detail pages have a slug per locale (utilities/localizedSlugField), so the
// current pathname isn't always valid in the other language. Every public
// page already advertises its translations as <link rel="alternate"
// hreflang> (lib/seo/metadata), so prefer that target and fall back to the
// current pathname. next-intl's router updates the NEXT_LOCALE cookie before
// navigating, so the choice also sticks on unprefixed URLs.

type Locale = (typeof routing.locales)[number];

const LANGUAGES: Record<Locale, string> = {
  en: "English",
  bg: "Български",
};

function alternatePathname(locale: Locale): string | null {
  const link = document.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${locale}"]`,
  );
  if (!link?.href) return null;

  const { pathname } = new URL(link.href);
  const [, maybeLocale, ...rest] = pathname.split("/");
  return maybeLocale === locale ? `/${rest.join("/")}` : pathname;
}

export function FooterLanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    const target = alternatePathname(nextLocale) ?? pathname;
    startTransition(() => {
      router.replace(target, { locale: nextLocale, scroll: false });
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
