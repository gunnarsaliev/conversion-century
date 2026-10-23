import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import { BannerStack } from "@/components/banner-standard-1";
import { CelebrationBanner } from "@/components/dashboard/celebration-banners";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import type { Celebration } from "@/lib/celebrations";
import {
  getDashboardLocale,
  getDashboardTranslations,
  type DashboardTranslator,
} from "@/lib/dashboard-locale";
import { formatDashboardDate } from "@/lib/dashboard-locale-shared";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dashboard overview
// ---------------------------------------------------------------------------
//
// Stat tiles, two funnels (offers, client pipeline) and the latest
// consultation requests. Server-rendered from counts; the only client JS is
// the notification bell — the funnel tooltips are CSS hover/focus.

export type FunnelStage = { label: string; value: number; hint?: string };

type Translator = DashboardTranslator;

export type Inquiry = {
  id: number;
  companyName: string;
  contactName?: string;
  email?: string;
  website?: string;
  message?: string;
  createdAt: string;
};

const percent = (value: number, total: number) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : "—";

function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-gray-800">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Horizontal bars, one series, widths relative to the largest stage (the
// client pipeline counts current statuses, so a later stage can be bigger).
// Each bar shows its count; hovering or focusing it adds its share of the
// first stage ("—" when the first stage is empty).
function Funnel({
  title,
  description,
  stages,
  t,
}: {
  title: string;
  description: string;
  stages: FunnelStage[];
  t: Translator;
}) {
  const top = Math.max(1, ...stages.map((stage) => stage.value));
  const first = stages[0]?.value ?? 0;

  return (
    <section className="rounded-lg border bg-white p-5 dark:bg-gray-800">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      <ol className="mt-5 flex flex-col gap-4">
        {stages.map((stage, index) => (
          <li key={stage.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">{stage.label}</span>
              <span className="tabular-nums">
                <span className="font-semibold">{stage.value}</span>
                {index > 0 && (
                  <span className="ml-1.5 text-muted-foreground">
                    {percent(stage.value, first)}
                  </span>
                )}
              </span>
            </div>
            <div
              tabIndex={0}
              aria-label={`${stage.label}: ${stage.value}${stage.hint ? `, ${stage.hint}` : ""}`}
              className="group relative h-3 rounded-full bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div
                className="h-full rounded-full bg-primary transition-opacity group-hover:opacity-80"
                style={{ width: `${stage.value > 0 ? Math.max(2, (stage.value / top) * 100) : 0}%` }}
              />
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden rounded-md bg-foreground px-2.5 py-1.5 text-xs whitespace-nowrap text-background shadow-md group-hover:block group-focus-visible:block"
              >
                <span className="font-medium">{stage.label}</span>: {stage.value}
                {index > 0 &&
                  ` · ${t("shareOf", { percent: percent(stage.value, first), stage: stages[0].label.toLowerCase() })}`}
                {stage.hint && <span className="block opacity-80">{stage.hint}</span>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function InquiryList({
  inquiries,
  t,
  locale,
}: {
  inquiries: Inquiry[];
  t: Translator;
  locale: string;
}) {
  return (
    <section className="rounded-lg border bg-white p-5 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{t("inquiries.title")}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("inquiries.description")}
          </p>
        </div>
        <Link
          href="/dashboard/consultations"
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {t("inquiries.all")} <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{t("inquiries.empty")}</p>
      ) : (
        <ul className="mt-4 divide-y">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/dashboard/consultations/${inquiry.id}`}
                className="group flex flex-col gap-1 py-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate font-medium group-hover:underline">
                    {inquiry.companyName}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDashboardDate(inquiry.createdAt, locale)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                  {inquiry.contactName && <span>{inquiry.contactName}</span>}
                  {inquiry.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="size-3.5" aria-hidden="true" />
                      {inquiry.email}
                    </span>
                  )}
                  {inquiry.website && <span className="truncate">{inquiry.website}</span>}
                </div>
                {inquiry.message && (
                  <p className="line-clamp-2 text-sm text-foreground/80">{inquiry.message}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export async function DashboardOverview({
  userName,
  celebrations = [],
  offers,
  pipeline,
  inquiries,
}: {
  userName?: string;
  /** Today's birthdays and work anniversaries, shown as banners at the top. */
  celebrations?: Celebration[];
  offers: { created: number; sent: number; accepted: number; pending: number; declined: number };
  pipeline: { consultations: number; leads: number; clients: number };
  inquiries: Inquiry[];
}) {
  const t = await getDashboardTranslations("Overview");
  const locale = await getDashboardLocale();

  return (
    <div className="flex flex-col gap-6">
      {celebrations.length > 0 && (
        <BannerStack>
          {celebrations.map((celebration) => (
            <CelebrationBanner
              key={celebration.id}
              celebration={celebration}
            />
          ))}
        </BannerStack>
      )}

      <section className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {userName ? t("welcome", { name: userName }) : t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <NotificationBell />
      </section>

      <div className={cn("grid gap-4", "grid-cols-2 lg:grid-cols-4")}>
        <StatTile label={t("stats.offersCreated")} value={offers.created} />
        <StatTile label={t("stats.offersSent")} value={offers.sent} hint={t("stats.offersSentHint")} />
        <StatTile label={t("stats.accepted")} value={offers.accepted} />
        <StatTile label={t("stats.pending")} value={offers.pending} hint={t("stats.pendingHint")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label={t("stats.consultations")} value={pipeline.consultations} />
        <StatTile label={t("stats.leads")} value={pipeline.leads} />
        <StatTile label={t("stats.clients")} value={pipeline.clients} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Funnel
          t={t}
          title={t("offerFunnel.title")}
          description={t("offerFunnel.description")}
          stages={[
            { label: t("offerFunnel.created"), value: offers.created },
            { label: t("offerFunnel.sent"), value: offers.sent },
            {
              label: t("offerFunnel.accepted"),
              value: offers.accepted,
              hint: t("offerFunnel.acceptedHint", {
                pending: offers.pending,
                declined: offers.declined,
              }),
            },
          ]}
        />
        <Funnel
          t={t}
          title={t("pipeline.title")}
          description={t("pipeline.description")}
          stages={[
            { label: t("stats.consultations"), value: pipeline.consultations },
            { label: t("stats.leads"), value: pipeline.leads },
            { label: t("stats.clients"), value: pipeline.clients, hint: t("pipeline.clientsHint") },
          ]}
        />
      </div>

      <InquiryList inquiries={inquiries} t={t} locale={locale} />
    </div>
  );
}
