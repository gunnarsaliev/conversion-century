import {
  ArrowRight,
  FlaskConical,
  Handshake,
  MessagesSquare,
  Search,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { PartnerBadges } from "@/components/partner-badges";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/lib/team-members";
import { CmsImage } from "@/components/cms-image";

// Content of the About page (copy from "About US.md"), in the `About`
// messages.

const STORY_YEARS = [
  "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026",
] as const;

// ISO 3166 codes for the flag images; names come from Intl.DisplayNames.
const COUNTRY_CODES = ["us", "gb", "de", "ro", "gr", "hu", "fr", "es", "pt"] as const;

const PRINCIPLES = [
  { key: "understand", icon: Search },
  { key: "ownership", icon: ShieldCheck },
  { key: "communicate", icon: MessagesSquare },
  { key: "longTerm", icon: Sprout },
  { key: "learning", icon: FlaskConical },
  { key: "partners", icon: Handshake },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold tracking-wide text-primary uppercase">{children}</p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
      {children}
    </h2>
  );
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

export function AboutHero() {
  const t = useTranslations("About.hero");

  return (
    <section className="container mx-auto py-16 lg:py-24">
      <div className="max-w-4xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-[-1px] text-balance sm:text-5xl lg:text-6xl">
          {t("heading")}
        </h1>
        <div className="mt-8 max-w-3xl space-y-4 text-lg text-muted-foreground">
          <Paragraphs text={t("body")} />
        </div>
        <Button
          className="mt-10 h-12 rounded-full px-6 text-[15px]"
          render={<a href="#team" />}
          nativeButton={false}
        >
          {t("cta")}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

export function AboutStory() {
  const t = useTranslations("About.story");

  return (
    <section className="border-t border-border">
      <div className="container mx-auto grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 lg:py-24">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <div className="mt-3">
            <SectionHeading>{t("heading")}</SectionHeading>
          </div>
        </div>
        <ol className="relative space-y-10 border-l border-border pl-8">
          {STORY_YEARS.map((year) => (
            <li key={year} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[37px] size-[9px] rounded-full bg-primary ring-4 ring-background"
              />
              <p className="text-sm font-semibold text-primary">{year}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{t(`years.${year}.title`)}</h3>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-muted-foreground">
                <Paragraphs text={t(`years.${year}.content`)} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutPeople({ members }: { members: TeamMember[] }) {
  const t = useTranslations("About.people");

  return (
    <section id="team" className="scroll-mt-24 border-t border-border">
      <div className="container mx-auto py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <div className="mt-3">
              <SectionHeading>{t("heading")}</SectionHeading>
            </div>
            <p className="mt-6 text-lg text-muted-foreground">
              {t("lead")}
            </p>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:pt-10">
            <Paragraphs text={t("body")} />
          </div>
        </div>

        {members.length > 0 && (
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {members.map((member) => (
              <li key={member.id}>
                <CmsImage
                  src={member.image}
                  alt={member.name}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  wrapperClassName="aspect-square rounded-2xl bg-muted"
                />
                <p className="mt-3 text-sm font-semibold">{member.name}</p>
                {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function AboutMarkets() {
  const t = useTranslations("About.markets");
  const locale = useLocale();
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });

  return (
    <section className="border-t border-border">
      <div className="container mx-auto py-16 text-center lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <div className="mt-3">
            <SectionHeading>{t("heading")}</SectionHeading>
          </div>
          <p className="mt-6 text-lg text-muted-foreground">
            {t("lead")}
          </p>
          <p className="mt-8 text-sm font-medium text-foreground/80">{t("spans")}</p>
        </div>
        <ul className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-2">
          {COUNTRY_CODES.map((code) => (
            <li
              key={code}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1.5 pr-4 pl-2 text-sm"
            >
              <img
                src={`https://api.iconify.design/flag/${code}-4x3.svg`}
                alt=""
                width={20}
                height={15}
                className="h-[15px] w-5 rounded-[3px] object-cover ring-1 ring-border"
              />
              {regionNames.of(code.toUpperCase())}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutCollaboration() {
  const t = useTranslations("About.collaboration");

  return (
    <section className="border-t border-border">
      <div className="container mx-auto grid gap-8 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <div className="mt-3">
            <SectionHeading>{t("heading")}</SectionHeading>
          </div>
          <p className="mt-6 text-xl font-medium text-balance">
            {t("lead")}
          </p>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:pt-10">
          <Paragraphs text={t("body")} />
        </div>
      </div>
    </section>
  );
}

export function AboutPartners() {
  const t = useTranslations("About.partners");

  return (
    <section className="border-t border-border">
      <div className="container mx-auto grid items-center gap-8 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <div className="mt-3">
            <SectionHeading>{t("heading")}</SectionHeading>
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
        </div>
        <PartnerBadges
          className="justify-center gap-8 lg:justify-end"
          badgeClassName="size-32 sm:size-40"
        />
      </div>
    </section>
  );
}

export function AboutMission() {
  const t = useTranslations("About.mission");

  return (
    <section className="container mx-auto py-8 lg:py-12">
      <div className="rounded-3xl bg-muted/60 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <p className="mt-4 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance lg:text-4xl">
          {t("statement")}
        </p>
        <div className="mt-8 grid gap-6 text-base leading-relaxed text-muted-foreground md:grid-cols-2 md:gap-12">
          <Paragraphs text={t("body")} />
        </div>
      </div>
    </section>
  );
}

export function AboutPrinciples() {
  const t = useTranslations("About.principles");

  return (
    <section className="container mx-auto py-16 lg:py-24">
      <div className="max-w-3xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <div className="mt-3">
          <SectionHeading>{t("heading")}</SectionHeading>
        </div>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map(({ key, icon: Icon }) => (
          <li key={key} className="rounded-2xl border border-border bg-card p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{t(`items.${key}.title`)}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`items.${key}.content`)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
