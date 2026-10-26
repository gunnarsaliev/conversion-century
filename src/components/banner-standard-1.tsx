import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { EXTERNAL_LINK_REL } from "@/lib/external-link";
import Link from "next/link";
import type { ReactNode } from "react";

import { BannerDismissButton } from "@/components/banner-dismiss-button";
import { Banner, BannerAction, BannerTitle } from "@/components/kibo-ui/banner";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Standard banner
// ---------------------------------------------------------------------------
//
// One-line announcement (icon, message, optional link, optional close) built
// on the kibo-ui Banner. Safe to render from server components: the icon is
// drawn here rather than through kibo's client-side BannerIcon, so no
// component reference has to cross the client boundary. Stack several with
// BannerStack, e.g. at the top of the dashboard overview.

// Light card with a soft tint fading in from the left, a matching icon chip
// and a soft tinted pill action in the tone colour; text stays on the regular
// foreground colour in both themes.
const toneClassName = {
  default: {
    banner: "border-border from-slate-100/80 dark:from-slate-800/60",
    icon: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    action:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-100",
  },
  pink: {
    banner: "border-rose-200/70 from-rose-50 dark:border-rose-900/50 dark:from-rose-950/50",
    icon: "bg-rose-100 text-rose-600 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:ring-rose-800/60",
    action:
      "bg-rose-100 text-rose-700 hover:bg-rose-200/80 hover:text-rose-800 dark:bg-rose-900/40 dark:text-rose-200 dark:hover:bg-rose-900/60 dark:hover:text-rose-100",
  },
  amber: {
    banner: "border-amber-200/70 from-amber-50 dark:border-amber-900/50 dark:from-amber-950/50",
    icon: "bg-amber-100 text-amber-600 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-800/60",
    action:
      "bg-amber-100 text-amber-800 hover:bg-amber-200/80 hover:text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60 dark:hover:text-amber-100",
  },
} as const;

export type BannerTone = keyof typeof toneClassName;

export type BannerStandardProps = {
  icon: LucideIcon;
  children: ReactNode;
  tone?: BannerTone;
  /** Absolute (http/https) hrefs open in a new tab. */
  action?: { label: string; href: string };
  /** Shows a close button; dismissal lasts until the page is reloaded. */
  dismissible?: boolean;
  /**
   * Remembers a dismissal for the signed-in user under this key; the page
   * rendering the banner should skip keys in their dismissedBanners (see
   * lib/banner-dismissal). Must end in the occurrence's year, e.g. "-2026".
   */
  dismissKey?: string;
  className?: string;
};

export function BannerStandard({
  icon: Icon,
  children,
  tone = "default",
  action,
  dismissible = true,
  dismissKey,
  className,
}: BannerStandardProps) {
  return (
    <Banner
      inset
      className={cn(
        "gap-3 rounded-xl border bg-card bg-linear-to-r via-card to-card px-3 py-2.5 text-card-foreground shadow-xs",
        toneClassName[tone].banner,
        className,
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full ring-1",
          toneClassName[tone].icon,
        )}
      >
        <Icon size={16} aria-hidden="true" />
      </div>
      <BannerTitle className="text-foreground/90">{children}</BannerTitle>
      {action && <BannerStandardAction {...action} className={toneClassName[tone].action} />}
      {dismissible && (
        <BannerDismissButton
          dismissKey={dismissKey}
          className="size-7 text-muted-foreground hover:bg-muted hover:text-foreground"
        />
      )}
    </Banner>
  );
}

// Pill button with a trailing arrow that nudges forward on hover (↗ for
// external links, which open in a new tab).
function BannerStandardAction({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className: string;
}) {
  const external = /^https?:\/\//.test(href);
  const Arrow = external ? ArrowUpRight : ArrowRight;

  return (
    <BannerAction
      variant="default"
      render={
        external ? (
          <a href={href} target="_blank" rel={EXTERNAL_LINK_REL} />
        ) : (
          <Link href={href} />
        )
      }
      nativeButton={false}
      className={cn(
        "h-8 gap-1.5 rounded-full border-0 pr-2.5 pl-3.5 font-medium shadow-none transition-colors",
        className,
      )}
    >
      {label}
      <Arrow
        aria-hidden="true"
        className={cn(
          "size-3.5 transition-transform duration-200",
          external
            ? "group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
            : "group-hover/button:translate-x-0.5",
        )}
      />
    </BannerAction>
  );
}

export function BannerStack({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 empty:hidden", className)}>{children}</div>;
}
