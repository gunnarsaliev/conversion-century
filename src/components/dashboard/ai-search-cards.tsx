"use client";

import { ArrowUpRight, CalendarDays, Globe, Mail, Phone, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { getConsultationCards, type ConsultationCardData } from "@/lib/ai-card-actions";
import { formatDashboardDate } from "@/lib/dashboard-locale-shared";

// ---------------------------------------------------------------------------
// Cards the AI search renders for the agent's display tools (agent/tools/)
// ---------------------------------------------------------------------------
//
// A tool's output carries only record ids; each card loads its record with
// the signed-in user's session (src/lib/ai-card-actions.ts). Like every link
// in the chat, a card opens its record in a new tab.

/** Ids from a `show_consultation` tool output ({ ids: number[] }), or []. */
export const consultationIds = (output: unknown): number[] => {
  const ids = (output as { ids?: unknown } | null)?.ids;
  return Array.isArray(ids) ? ids.filter((id): id is number => Number.isInteger(id)) : [];
};

const ConsultationCard = ({ card }: { card: ConsultationCardData }) => {
  const t = useTranslations("AiCards");
  const locale = useLocale();

  return (
    <a
      href={`/dashboard/consultations/${card.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2.5 rounded-xl border bg-card p-4 text-sm shadow-xs transition-colors outline-none hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            {t("consultation")}
          </p>
          <p className="truncate text-base font-semibold group-hover:underline">
            {card.companyName}
          </p>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">{t("opensInNewTab")}</span>
      </div>

      <dl className="grid gap-1.5 text-muted-foreground sm:grid-cols-2">
        {card.contactName && (
          <Detail icon={UserRound} label={t("contact")} value={card.contactName} />
        )}
        {card.email && <Detail icon={Mail} label={t("email")} value={card.email} />}
        {card.phone && <Detail icon={Phone} label={t("phone")} value={card.phone} />}
        {card.website && <Detail icon={Globe} label={t("website")} value={card.website} />}
        <Detail
          icon={CalendarDays}
          label={t("received")}
          value={formatDashboardDate(card.createdAt, locale)}
        />
      </dl>

      {card.message && (
        <p className="line-clamp-3 rounded-lg bg-muted/60 px-3 py-2 text-foreground/80">
          {card.message}
        </p>
      )}
    </a>
  );
};

const Detail = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) => (
  <div className="flex min-w-0 items-center gap-1.5">
    <dt className="shrink-0">
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{label}</span>
    </dt>
    <dd className="min-w-0 truncate">{value}</dd>
  </div>
);

/** The `show_consultation` tool's cards: loads the records, then lists them. */
const ConsultationCards = ({ ids }: { ids: number[] }) => {
  const t = useTranslations("AiCards");
  const [cards, setCards] = React.useState<ConsultationCardData[] | null>(null);
  const key = ids.join(",");

  React.useEffect(() => {
    let cancelled = false;
    getConsultationCards(key.split(",").map(Number))
      .catch(() => [])
      .then((result) => {
        if (!cancelled) setCards(result);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (cards === null) {
    return (
      <div className="grid gap-3" aria-busy="true">
        {ids.map((id) => (
          <div key={id} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("notFound")}</p>;
  }

  return (
    <div className="grid gap-3">
      {cards.map((card) => (
        <ConsultationCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export { ConsultationCards };
