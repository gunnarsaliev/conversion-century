import { ArrowRight, FileText, Layers, Signpost, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { SeoPageHeader } from "@/components/dashboard/seo-page-header";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardLocale, getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdminOrEditor } from "@/lib/roles";
import { SEO_COLLECTION_SLUGS } from "@/lib/seo/collection-meta";
import { SEO_PAGE_KEYS } from "@/lib/seo/page-keys";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// SEO (overview)
// ---------------------------------------------------------------------------
//
// Entry point to the SEO tools: coverage stats (custom meta on static pages
// and collection pages, active redirects), then a card per tool with its
// latest changes. Admins and editors only.

function StatTile({
  icon: Icon,
  label,
  value,
  total,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  total: number;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-xs dark:bg-gray-800">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
        <span className="text-base font-normal text-muted-foreground"> / {total}</span>
      </p>
      <Progress value={total > 0 ? Math.round((value / total) * 100) : 0} aria-label={label} />
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function ToolCard({
  href,
  icon: Icon,
  title,
  description,
  cta,
  recentLabel,
  emptyLabel,
  recent,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  recentLabel: string;
  emptyLabel: string;
  recent: { key: string | number; primary: string; secondary?: string; date: string }[];
}) {
  return (
    <article className="flex flex-col rounded-xl border bg-white shadow-xs dark:bg-gray-800">
      <div className="flex items-start gap-4 p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex-1 border-t px-5 py-4">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {recentLabel}
        </p>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((item) => (
              <li key={item.key} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium">{item.primary}</span>
                  {item.secondary && (
                    <span className="text-muted-foreground"> → {item.secondary}</span>
                  )}
                </span>
                <time className="shrink-0 text-xs text-muted-foreground tabular-nums">{item.date}</time>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t p-3">
        <Link
          href={href}
          className={cn(buttonVariants({ variant: "ghost" }), "group w-full justify-between")}
        >
          {cta}
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default async function SeoPage() {
  const user = await requireDashboardUser();
  if (!isAdminOrEditor(user)) notFound();

  const t = await getDashboardTranslations("Seo");
  const locale = await getDashboardLocale();
  const tNames = await getTranslations({ locale, namespace: "Metadata" });
  const payload = await getPayload({ config });

  const count = (collection: (typeof SEO_COLLECTION_SLUGS)[number], where?: Where) =>
    payload
      .count({ collection, locale: "en", where })
      .then(({ totalDocs }) => totalDocs);

  const [recentMeta, redirects, collectionTotals, collectionCustom] = await Promise.all([
    payload.find({ collection: "page-meta", depth: 0, limit: 100, sort: "-updatedAt" }),
    payload.find({ collection: "redirects", depth: 0, pagination: false, sort: "-updatedAt" }),
    Promise.all(SEO_COLLECTION_SLUGS.map((slug) => count(slug))),
    Promise.all(
      SEO_COLLECTION_SLUGS.map((slug) => count(slug, { "meta.title": { exists: true } })),
    ),
  ]);

  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  const activeRedirects = redirects.docs.filter((rule) => rule.enabled).length;
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

  const stats = [
    {
      icon: FileText,
      label: t("overview.stats.pages"),
      value: recentMeta.totalDocs,
      total: SEO_PAGE_KEYS.length,
      hint: t("overview.stats.pagesHint", { count: recentMeta.totalDocs, total: SEO_PAGE_KEYS.length }),
    },
    {
      icon: Layers,
      label: t("overview.stats.collections"),
      value: sum(collectionCustom),
      total: sum(collectionTotals),
      hint: t("overview.stats.collectionsHint", {
        count: sum(collectionCustom),
        total: sum(collectionTotals),
      }),
    },
    {
      icon: Signpost,
      label: t("overview.stats.redirects"),
      value: activeRedirects,
      total: redirects.docs.length,
      hint: t("overview.stats.redirectsHint", {
        count: activeRedirects,
        total: redirects.docs.length,
      }),
    },
  ];

  return (
    <>
      <SeoPageHeader description={t("description")} />

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolCard
          href="/dashboard/seo/meta-data"
          icon={FileText}
          title={t("overview.metaData.title")}
          description={t("overview.metaData.description")}
          cta={t("overview.openMeta")}
          recentLabel={t("overview.recent")}
          emptyLabel={t("overview.noRecentMeta")}
          recent={recentMeta.docs.slice(0, 4).map((doc) => ({
            key: doc.id,
            primary: tNames.has(`${doc.page}.name`) ? tNames(`${doc.page}.name`) : doc.page,
            date: date.format(new Date(doc.updatedAt)),
          }))}
        />
        <ToolCard
          href="/dashboard/seo/redirects"
          icon={Signpost}
          title={t("overview.redirects.title")}
          description={t("overview.redirects.description")}
          cta={t("overview.openRedirects")}
          recentLabel={t("overview.recent")}
          emptyLabel={t("overview.noRecentRedirects")}
          recent={redirects.docs.slice(0, 4).map((rule) => ({
            key: rule.id,
            primary: rule.from,
            secondary: rule.to,
            date: date.format(new Date(rule.updatedAt)),
          }))}
        />
      </section>
    </>
  );
}
