import Link from "next/link";
import type * as React from "react";

import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { cn } from "@/lib/utils";
import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";

// ---------------------------------------------------------------------------
// Media hub header (breadcrumb, title, section tabs)
// ---------------------------------------------------------------------------

const sections = [
  { key: "all", href: "/dashboard/media" },
  { key: "logos", href: "/dashboard/media/logos" },
] as const;

type MediaHubHeaderProps = {
  active: (typeof sections)[number]["key"];
  count: number;
  description: string;
  /** Right side of the banner, e.g. the "Add new" upload button. */
  actions?: React.ReactNode;
};

const MediaHubHeader = async ({ active, count, description, actions }: MediaHubHeaderProps) => {
  const t = await getDashboardTranslations("Media");

  return (
  <>
    <PageHeaderBanner
      title={t("title")}
      count={count}
      description={description}
      actions={actions}
    />
    <nav
      aria-label={t("sections")}
      className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-sm"
    >
      {sections.map((section) => (
        <Link
          key={section.key}
          href={section.href}
          aria-current={section.key === active ? "page" : undefined}
          className={cn(
            "inline-flex h-full items-center rounded-md px-3 font-medium text-muted-foreground transition-colors hover:text-foreground",
            section.key === active && "bg-background text-foreground shadow-sm",
          )}
        >
          {t(`tabs.${section.key}`)}
        </Link>
      ))}
    </nav>
  </>
  );
};

export { MediaHubHeader };
