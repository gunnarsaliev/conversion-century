import { ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { cn } from "@/lib/utils";

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
};

const MediaHubHeader = async ({ active, count, description }: MediaHubHeaderProps) => {
  const t = await getDashboardTranslations("Media");
  const tCommon = await getDashboardTranslations("Common");

  return (
  <section className="pb-4 sm:pb-5">
    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
      <LayoutDashboard className="size-3.5" aria-hidden="true" />
      <span>{tCommon("overview")}</span>
      <ChevronRight className="size-3.5" aria-hidden="true" />
      <span className="text-foreground">{t("title")}</span>
    </div>
    <div className="mt-3">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("title")}
        <span className="ml-2 text-lg font-normal text-muted-foreground">
          ({count})
        </span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
    <nav
      aria-label={t("sections")}
      className="mt-4 inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-sm"
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
  </section>
  );
};

export { MediaHubHeader };
