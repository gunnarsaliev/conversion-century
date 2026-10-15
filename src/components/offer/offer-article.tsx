import {
  ArrowRightLeft,
  ChartLine,
  Check,
  Download,
  FileText,
  LayoutTemplate,
  MessageCircleQuestionMark,
  SlidersHorizontal,
} from "lucide-react";

import certificationsImage from "@/app/[locale]/(frontend)/website/offer/certifivations.png";
import { Feature99 } from "@/components/feature99";
import { Feature229 } from "@/components/feature229";
import { Logos30 } from "@/components/logos30";
import { CountryFlags } from "@/components/offer/country-flags";
import { KeywordTable } from "@/components/offer/keyword-table";
import { PILLAR_ICONS } from "@/components/offer/offer-agency";
import {
  fillPlaceholders,
  formatAmount,
  formatDate,
  formatNumber,
  packageFeatures,
} from "@/components/offer/offer-ui";
import { Pricing118 } from "@/components/pricing118";
import { Timeline6 } from "@/components/timeline6";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Offer, OfferStatic } from "@/types/offer";

// A full client offer in the article layout of /website/special-offer:
// a sticky sidebar with the key facts and a prose main column. Everything
// comes from `content` (template copy) and `offer` (per-client values).

// One icon per technical group: admin & meta, architecture, migration.
const TECHNICAL_ICONS = [SlidersHorizontal, LayoutTemplate, ArrowRightLeft];
// One icon per content group: strategy, categories & blog, FAQ.
const CONTENT_ICONS = [ChartLine, FileText, MessageCircleQuestionMark];

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function SidebarItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

export function OfferArticle({
  content,
  offer,
  pdfHref,
}: {
  content: OfferStatic;
  offer: Offer;
  /** Download link for the PDF version; the button is hidden without it. */
  pdfHref?: string;
}) {
  const { pricing, audit } = content;
  const recommended =
    offer.packages.find((pkg) => pkg.recommended) ?? offer.packages[0];
  const site = offer.client.url ? host(offer.client.url) : offer.client.name;

  const stats: { title: string; value: string; suffix?: string }[] = [
    {
      title: audit.metricLabels.domainRating,
      value: formatNumber(offer.metrics.domainRating),
      suffix: "от 100",
    },
    { title: audit.metricLabels.backlinks, value: formatNumber(offer.metrics.backlinks) },
    {
      title: audit.metricLabels.organicKeywords,
      value: formatNumber(offer.metrics.organicKeywords),
    },
    {
      title: audit.metricLabels.organicTraffic,
      value: formatNumber(offer.metrics.organicTraffic),
    },
  ];

  return (
    <section className="py-16">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-16">
              <div>
                <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Специална оферта за
                </p>
                <h1 className="mb-4 text-4xl font-bold">{offer.client.name}</h1>
                <p className="leading-relaxed text-muted-foreground">{pricing.header}</p>
              </div>

              <div className="space-y-6 border-t pt-8">
                {offer.preparedBy && (
                  <SidebarItem label="Оферта от" value={offer.preparedBy} />
                )}
                <SidebarItem
                  label={(offer.services?.length ?? 0) > 1 ? "Услуги" : "Услуга"}
                  value={offer.service}
                />
                {recommended && (
                  <SidebarItem
                    label={pricing.priceLabel}
                    value={`${formatAmount(recommended.price)} ${pricing.currencyLabel}`}
                  />
                )}
                <SidebarItem label="Валидна до" value={formatDate(offer.validUntil)} />
                {pdfHref && (
                  <a
                    href={pdfHref}
                    download
                    className={buttonVariants({ className: "w-full" })}
                  >
                    <Download className="size-4" />
                    Изтегли офертата (PDF)
                  </a>
                )}
              </div>

              {offer.scopeSummary.length > 0 && (
                <nav className="border-t pt-8">
                  <p className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {pricing.summaryHeader}
                  </p>
                  <ul className="space-y-2">
                    {offer.scopeSummary.map((item) => (
                      <li key={item.label} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0" />
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              <h2>
                {offer.service} на {site}
              </h2>
              {content.brand.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {/* eslint-disable-next-line @next/next/no-img-element -- static badge strip */}
              <img
                src={certificationsImage.src}
                alt="Ahrefs Agency Partner, Semrush Certified Agency Partner, Featured on Forbes, Clutch"
                width={certificationsImage.width}
                height={certificationsImage.height}
                className="h-auto w-full"
              />

              <h2>{content.agency.header}</h2>
              {/* Outside `prose` so Typography doesn't restyle the list. */}
              <div className="not-prose">
                <Timeline6
                  heading={null}
                  items={content.agency.pillars.map((pillar, i) => {
                    const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                    return {
                      label: String(i + 1).padStart(2, "0"),
                      title: pillar.title.toUpperCase(),
                      description: pillar.description,
                      icon: <Icon strokeWidth={1.5} className="size-12" />,
                    };
                  })}
                  className="py-12"
                />
              </div>

              {/* Static copy, the same for every offer. */}
              <h3>Market differentiation</h3>
              <p>
                With numerous competitors using similar messaging around health
                and wellness, we needed to find a unique positioning that
                highlighted Pure Pressed&apos;s commitment to quality ingredients
                and sustainable practices.
              </p>
              <Logos30 />

              <h3>{content.socialProof.countriesHeader}</h3>
              <p>{content.socialProof.countriesDescription}</p>
              {/* Outside `prose` so Typography doesn't add list bullets. */}
              <CountryFlags
                countries={content.socialProof.countries}
                className="not-prose mt-6 justify-between"
              />

              <h3>
                {audit.header} | {site}
              </h3>
              <div className="not-prose my-10 grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold tabular-nums">
                        {stat.value}
                        {stat.suffix && (
                          <span className="ml-1 text-sm font-normal text-muted-foreground">
                            {stat.suffix}
                          </span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {offer.keywords.length > 0 && (
                <>
                  <h3>{audit.keywordsHeader}</h3>
                  <KeywordTable
                    keywords={offer.keywords}
                    columns={audit.columns}
                    className="not-prose my-6"
                  />
                </>
              )}

              {offer.timeline.length > 0 && (
                <div className="not-prose my-16">
                  <Feature99
                    heading={`${content.timeline.activityHeader}${
                      offer.startLabel ? `: ${offer.startLabel}` : ""
                    }`}
                    steps={offer.timeline.map((phase) => ({
                      title: phase.label,
                      description: phase.description,
                    }))}
                    note={offer.responsibilities || null}
                  />
                </div>
              )}

              {/* Outside `prose` so Typography doesn't indent the list or add bullets. */}
              <Feature229
                heading={`${content.technical.header} ${offer.siteType}`}
                description={content.technical.description}
                numbered
                groups={content.technical.groups.map((group, i) => ({
                  title: group.title,
                  icon: TECHNICAL_ICONS[i % TECHNICAL_ICONS.length],
                  features: group.items,
                }))}
                className="not-prose my-16"
              />
              {/* Quantities like the blog article count come from the offer. */}
              <Feature229
                heading={`${content.contentStrategy.header} ${offer.siteType}`}
                description={content.contentStrategy.description}
                numbered
                groups={content.contentStrategy.groups.map((group, i) => ({
                  title: group.title,
                  icon: CONTENT_ICONS[i % CONTENT_ICONS.length],
                  features: group.items.map((item) => ({
                    label: fillPlaceholders(item.label, offer.content),
                    text: fillPlaceholders(item.text, offer.content),
                  })),
                }))}
                className="not-prose my-16"
              />

              <h3>{content.architecture.header}</h3>
              <ol>
                {content.architecture.steps.map((step) => (
                  <li key={step.title}>
                    <strong>{step.title}</strong>
                    <ul>
                      {step.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              {/* Outside `prose` so Typography doesn't restyle the pricing cards. */}
              <Pricing118
                heading={`${pricing.header} ${offer.siteType}`}
                highlights={offer.scopeSummary}
                optionsHeading={pricing.packagesHeader}
                options={offer.packages.map((pkg, i) => ({
                  name: `${pricing.variantLabel} ${i + 1}: ${pkg.name}${
                    pkg.hours !== undefined ? ` (${pkg.hours} ${pricing.hoursLabel})` : ""
                  }`,
                  price: `${pricing.priceLabel}: ${formatAmount(pkg.price)} ${pricing.currencyLabel}`,
                  features: packageFeatures(pkg),
                  highlighted: pkg.recommended,
                }))}
                className="not-prose py-16"
              />
              <p className="text-sm text-muted-foreground">{pricing.vatNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
