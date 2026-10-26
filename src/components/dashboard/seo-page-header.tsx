import { ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { getDashboardTranslations } from "@/lib/dashboard-locale";

// Breadcrumb (Overview › SEO › …), title and description shared by the
// Dashboard → SEO pages. `title` omitted means the SEO overview itself.
export async function SeoPageHeader({
  title,
  description,
}: {
  title?: string;
  description: string;
}) {
  const t = await getDashboardTranslations("Seo");
  const tCommon = await getDashboardTranslations("Common");

  return (
    <section className="pb-4 sm:pb-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
        <LayoutDashboard className="size-3.5" aria-hidden="true" />
        <Link href="/dashboard" className="hover:text-foreground">
          {tCommon("overview")}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        {title ? (
          <>
            <Link href="/dashboard/seo" className="hover:text-foreground">
              {t("title")}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="text-foreground">{title}</span>
          </>
        ) : (
          <span className="text-foreground">{t("title")}</span>
        )}
      </div>
      <div className="mt-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title ?? t("title")}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
