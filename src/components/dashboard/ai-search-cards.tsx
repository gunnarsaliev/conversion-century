"use client";

import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CalendarDays,
  CircleCheck,
  Download,
  FileText,
  Factory,
  PenLine,
  Send,
  FileSignature,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

import { usePdfDownload } from "@/components/offer/pdf-download-button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  getClientCards,
  getConsultationCards,
  getOfferCard,
  type ClientCardData,
  type ConsultationCardData,
  type OfferCardData,
} from "@/lib/ai-card-actions";
import { clientStatusBadgeClassName, isClientStatus } from "@/lib/client-status";
import { formatDashboardDate, formatDashboardTimeAgo } from "@/lib/dashboard-locale-shared";
import { regionLabel } from "@/lib/regions";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Cards the AI search renders for the agent's display tools (agent/tools/)
// ---------------------------------------------------------------------------
//
// A tool's output carries only record ids; each card loads its record with
// the signed-in user's session (src/lib/ai-card-actions.ts). Like every link
// in the chat, a card opens its record in a new tab.

/** Ids from a card tool's output ({ ids: number[] }), or []. */
export const cardIds = (output: unknown): number[] => {
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

/** Loads a card tool's records (null while loading). */
function useCards<T>(ids: number[], load: (ids: number[]) => Promise<T[]>) {
  const [cards, setCards] = React.useState<T[] | null>(null);
  const key = ids.join(",");

  React.useEffect(() => {
    let cancelled = false;
    load(key.split(",").map(Number))
      .catch(() => [])
      .then((result) => {
        if (!cancelled) setCards(result);
      });
    return () => {
      cancelled = true;
    };
  }, [key, load]);

  return cards;
}

const CardList = <T extends { id: number }>({
  ids,
  cards,
  notFound,
  render,
}: {
  ids: number[];
  cards: T[] | null;
  notFound: string;
  render: (card: T) => React.ReactNode;
}) => {
  if (cards === null) {
    return (
      <div className="grid gap-3" aria-busy="true">
        {ids.map((id) => (
          <div key={id} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
        ))}
      </div>
    );
  }
  if (cards.length === 0) return <p className="text-sm text-muted-foreground">{notFound}</p>;
  return <div className="grid gap-3">{cards.map(render)}</div>;
};

/** The `show_consultation` tool's cards. */
const ConsultationCards = ({ ids }: { ids: number[] }) => {
  const t = useTranslations("AiCards");
  const cards = useCards(ids, getConsultationCards);
  return (
    <CardList
      ids={ids}
      cards={cards}
      notFound={t("notFound")}
      render={(card) => <ConsultationCard key={card.id} card={card} />}
    />
  );
};

// ---------------------------------------------------------------------------
// Client detail card (agent/tools/show_client.ts)
// ---------------------------------------------------------------------------

const ClientCard = ({ card }: { card: ClientCardData }) => {
  const t = useTranslations("AiCards");
  const tStatus = useTranslations("Clients.status");
  const locale = useLocale();
  const statusLabel = isClientStatus(card.status) ? tStatus(card.status) : card.status;
  // Falls back to the initial if the logo URL fails to load.
  const [logoFailed, setLogoFailed] = React.useState(false);

  return (
    <a
      href={`/dashboard/${card.section}/${card.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border bg-yellow-50 p-4 text-sm shadow-xs transition-colors outline-none hover:border-yellow-300 hover:bg-yellow-100 focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-yellow-950/30 dark:hover:border-yellow-800 dark:hover:bg-yellow-950/50"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold group-hover:underline">
            {card.companyName}
          </p>
          <Badge
            variant="secondary"
            className={cn("mt-1 border-0", clientStatusBadgeClassName(card.status))}
          >
            {statusLabel}
          </Badge>
        </div>
        {card.logoUrl && !logoFailed ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS media URL (R2)
          <img
            src={card.logoUrl}
            alt=""
            onError={() => setLogoFailed(true)}
            className="size-16 shrink-0 overflow-hidden rounded-xl object-contain"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl font-semibold text-muted-foreground"
          >
            {card.companyName.charAt(0).toUpperCase()}
          </div>
        )}
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
        {card.accountManagers.length > 0 && (
          <Detail
            icon={Briefcase}
            label={t("accountManagers")}
            value={card.accountManagers.join(", ")}
          />
        )}
        {card.contractDate && (
          <Detail
            icon={FileSignature}
            label={t("contractDate")}
            value={formatDashboardDate(card.contractDate, locale)}
          />
        )}
        {card.regions.length > 0 && (
          <Detail
            icon={MapPin}
            label={t("region")}
            value={card.regions.map((region) => regionLabel(region, locale)).join(", ")}
          />
        )}
        {card.industries.length > 0 && (
          <Detail icon={Factory} label={t("industries")} value={card.industries.join(", ")} />
        )}
        {card.businessSize && (
          <Detail
            icon={Building2}
            label={t("businessSize")}
            value={t(`size.${card.businessSize}`)}
          />
        )}
        {card.publishers.length > 0 && (
          <Detail icon={Send} label={t("publishers")} value={card.publishers.join(", ")} />
        )}
        {card.copywriters.length > 0 && (
          <Detail icon={PenLine} label={t("copywriters")} value={card.copywriters.join(", ")} />
        )}
        <Detail
          icon={CalendarDays}
          label={t("since")}
          value={t("sinceValue", { ago: formatDashboardTimeAgo(card.createdAt, locale) })}
        />
        {card.offers.total > 0 && (
          <Detail
            icon={FileText}
            label={t("offers")}
            value={t("offersValue", {
              total: card.offers.total,
              accepted: card.offers.accepted,
              pending: card.offers.pending,
              value: new Intl.NumberFormat(locale, {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(card.offers.acceptedValue),
            })}
          />
        )}
        {card.checklist.total > 0 && (
          <Detail
            icon={CircleCheck}
            label={t("checklist")}
            value={t("checklistValue", {
              done: card.checklist.done,
              total: card.checklist.total,
              percent: Math.round((card.checklist.done / card.checklist.total) * 100),
            })}
          />
        )}
      </dl>

      {card.notes && (
        <p className="line-clamp-3 rounded-lg bg-white/60 px-3 py-2 text-foreground/80 dark:bg-black/20">
          {card.notes}
        </p>
      )}

      {card.services.length > 0 && (
        <div>
          <p className="sr-only">{t("services")}</p>
          <ul className="flex flex-wrap gap-1.5">
            {card.services.map((service) => (
              <li key={service}>
                <Badge variant="outline" className="font-normal">
                  {service}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </a>
  );
};

/** The `show_client` tool's cards. */
const ClientCards = ({ ids }: { ids: number[] }) => {
  const t = useTranslations("AiCards");
  const cards = useCards(ids, getClientCards);
  return (
    <CardList
      ids={ids}
      cards={cards}
      notFound={t("clientNotFound")}
      render={(card) => <ClientCard key={card.id} card={card} />}
    />
  );
};

// ---------------------------------------------------------------------------
// Created offer card (agent/tools/create_offer.ts)
// ---------------------------------------------------------------------------

/** The new offer's id from the `create_offer` tool's output, or null if it failed. */
export const createdOfferId = (output: unknown): number | null => {
  const id = (output as { id?: unknown } | null)?.id;
  return typeof id === "number" && Number.isInteger(id) && id > 0 ? id : null;
};

/** The offer the agent just created, with its PDF download and a link to it. */
const OfferCreatedCard = ({ id }: { id: number }) => {
  const t = useTranslations("AiCards");
  const locale = useLocale();
  // undefined while loading, null when the offer can't be read (deleted).
  const [card, setCard] = React.useState<OfferCardData | null | undefined>(undefined);
  const pdf = usePdfDownload(`/offers/${id}/pdf`);

  React.useEffect(() => {
    let cancelled = false;
    getOfferCard(id)
      .catch(() => null)
      .then((result) => {
        if (!cancelled) setCard(result);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (card === undefined) {
    return <div className="h-36 animate-pulse rounded-xl border bg-muted/40" aria-busy="true" />;
  }
  if (card === null) return <p className="text-sm text-muted-foreground">{t("offerNotFound")}</p>;

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 text-sm shadow-xs">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-primary uppercase">
          <CircleCheck className="size-3.5" aria-hidden="true" />
          {t("offerCreated")}
        </p>
        <p className="truncate text-base font-semibold">{card.clientName}</p>
      </div>

      {card.lines.length > 0 && (
        <ul className="flex flex-col gap-1 text-muted-foreground">
          {card.lines.map((line, index) => (
            <li key={index} className="flex justify-between gap-4">
              <span className="min-w-0 truncate">{line.service}</span>
              <span className="shrink-0 tabular-nums">
                {t("serviceHours", { hours: line.hours })}
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t pt-3">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">{t("validUntil")}</dt>
          <dd>{formatDashboardDate(card.validUntil, locale)}</dd>
        </div>
        {card.total !== undefined && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">{t("price")}</dt>
            <dd className="font-semibold tabular-nums">
              {new Intl.NumberFormat(locale, {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 2,
              }).format(card.total)}
              {card.discount ? (
                <span className="font-normal text-muted-foreground"> (−{card.discount}%)</span>
              ) : null}
            </dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="lg" disabled={pdf.loading} onClick={pdf.download}>
          {pdf.loading ? (
            <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Download aria-hidden="true" />
          )}
          {t("downloadPdf")}
        </Button>
        <a
          href={`/offers/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("openOffer")}
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only">({t("opensInNewTab")})</span>
        </a>
      </div>
      {pdf.error && (
        <p role="alert" className="text-sm text-destructive">
          {t("pdfFailed")}
        </p>
      )}
    </div>
  );
};

export { ClientCards, ConsultationCards, OfferCreatedCard };
