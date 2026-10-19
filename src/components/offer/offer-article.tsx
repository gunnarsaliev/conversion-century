import {
  Check,
  Download,
  LayoutTemplate,
  Mail,
  Network,
  Phone,
  Search,
  Target,
} from "lucide-react";

import certificationsImage from "@/app/[locale]/(frontend)/website/offer/certifivations.png";
import { Feature99 } from "@/components/feature99";
import { List3 } from "@/components/list3";
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
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ClientLogo } from "@/lib/client-logos";
import type { Offer, OfferStatic } from "@/types/offer";

// A full client offer in the article layout of /website/special-offer:
// a sticky sidebar with the key facts and a prose main column. Everything
// comes from `content` (template copy) and `offer` (per-client values).

// One icon per architecture step: research & clusters, competitor analysis,
// new architecture, page structure.
const ARCHITECTURE_ICONS = [Search, Target, Network, LayoutTemplate];

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function SidebarItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold tracking-wider uppercase">
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

// One topic of the offer as its own panel: a labelled header bar on top and
// the content below, so each group reads as a separate block.
function OfferSection({
  id,
  eyebrow,
  description,
  aside,
  children,
}: {
  id: string;
  eyebrow: string;
  /** Short intro shown in the header bar under the label. */
  description?: string;
  /** Shown at the right end of the header bar, opposite the label. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-16 overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="border-b bg-muted/60 px-6 py-4 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="size-2 shrink-0 rounded-full bg-primary" />
            <p className="text-sm font-semibold tracking-widest uppercase">{eyebrow}</p>
          </div>
          {aside}
        </div>
        {description && (
          <p className="mt-2 pl-5 text-sm">{description}</p>
        )}
      </div>
      {/* Typography colours set to the inherited text colour. */}
      <div className="prose prose-sm max-w-none px-6 py-10 md:px-10 [--tw-prose-body:inherit] [--tw-prose-bold:inherit] [--tw-prose-headings:inherit] [--tw-prose-links:inherit]">{children}</div>
    </section>
  );
}

export function OfferArticle({
  content,
  offer,
  pdfHref,
  clientLogos = [],
}: {
  content: OfferStatic;
  offer: Offer;
  /** Download link for the PDF version; the button is hidden without it. */
  pdfHref?: string;
  /** Public client logos (Clients marked `showOnWebsite`); the strip is hidden without them. */
  clientLogos?: ClientLogo[];
}) {
  const { pricing, audit } = content;
  const { contact } = content.trackRecord;
  const recommended =
    offer.packages.find((pkg) => pkg.recommended) ?? offer.packages[0];
  const site = offer.client.url ? host(offer.client.url) : offer.client.name;
  // The client's logo (Clients.logo), shown at the right of most section headers.
  const clientLogo = offer.client.logo ? (
    // eslint-disable-next-line @next/next/no-img-element -- remote media URL
    <img
      src={offer.client.logo}
      alt={offer.client.name}
      className="h-5 w-auto max-w-24 object-contain"
    />
  ) : undefined;

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
                <p className="mb-4 text-xs font-semibold tracking-widest uppercase">
                  Специална оферта за
                </p>
                <h1 className="mb-4 text-4xl font-bold">{offer.client.name}</h1>
                <p className="leading-relaxed">
                  {offer.service} на {site}
                </p>
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
                    className={buttonVariants({ className: "w-full text-white py-6" })}
                  >
                    <Download className="size-4" />
                    Изтегли офертата (PDF)
                  </a>
                )}
              </div>

              {offer.scopeSummary.length > 0 && (
                <nav className="border-t pt-8">
                  <p className="mb-4 text-xs font-semibold tracking-wider uppercase">
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

          {/* Main content: one panel per topic. */}
          <div className="space-y-10 lg:col-span-3">
            <OfferSection
              id="agency"
              eyebrow={content.agency.header}
              aside={
                // eslint-disable-next-line @next/next/no-img-element -- static badge strip
                <img
                  src={certificationsImage.src}
                  alt="Ahrefs Agency Partner, Semrush Certified Agency Partner, Featured on Forbes, Clutch"
                  width={certificationsImage.width}
                  height={certificationsImage.height}
                  className="h-10 w-auto max-w-full md:h-14"
                />
              }
            >
              {/* Plain text, without the Typography paragraph styles. */}
              <div className="not-prose space-y-4 text-sm">
                {content.agency.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {/* Outside `prose` so Typography doesn't restyle the steps. */}
              <Feature99
                heading={null}
                columns={2}
                steps={content.agency.pillars.map((pillar, i) => {
                  const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                  return {
                    title: pillar.title,
                    description: pillar.description,
                    icon: <Icon strokeWidth={1.5} className="size-10 lg:size-12" />,
                  };
                })}
                className="not-prose py-12"
              />

              {/* Static copy, the same for every offer. */}
              <h3>Част от нашите клиенти</h3>
              {clientLogos.length > 0 && (
                <Logos30
                  logos={clientLogos.map((logo) => ({ src: logo.src, alt: logo.name }))}
                />
              )}

              <h3>{content.socialProof.countriesHeader}</h3>
              <p>{content.socialProof.countriesDescription}</p>
              {/* Outside `prose` so Typography doesn't add list bullets. */}
              <CountryFlags
                countries={content.socialProof.countries}
                className="not-prose mt-6"
              />
            </OfferSection>

            <OfferSection
              id="audit"
              eyebrow="Одит"
              description={`${audit.header} | ${site}`}
              aside={clientLogo}
            >
              <div className="not-prose my-10 grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardContent className="pt-6">
                      <p className="text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold tabular-nums">
                        {stat.value}
                        {stat.suffix && (
                          <span className="ml-1 text-sm font-normal">
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
            </OfferSection>

            {offer.timeline.length > 0 && (
              <OfferSection id="plan" eyebrow="План" aside={clientLogo}>
                <div className="not-prose">
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
              </OfferSection>
            )}

            <OfferSection
              id="technical"
              eyebrow={`${content.technical.header} ${offer.siteType}`}
              description={content.technical.description}
              aside={clientLogo}
            >
              {/* Outside `prose` so Typography doesn't restyle the rows. */}
              {/* All groups' rows as one list, without the group headings. */}
              <List3
                groups={[
                  {
                    rows: content.technical.groups.flatMap((group) =>
                      group.items.map((item) => ({ title: item.label, text: item.text })),
                    ),
                  },
                ]}
                className="not-prose py-6"
              />
            </OfferSection>

            <OfferSection
              id="content"
              eyebrow={`${content.contentStrategy.header} ${offer.siteType}`}
              description={content.contentStrategy.description}
              aside={clientLogo}
            >
              {/* Quantities like the blog article count come from the offer. */}
              <List3
                groups={[
                  {
                    rows: content.contentStrategy.groups.flatMap((group) =>
                      group.items.map((item) => ({
                        title: fillPlaceholders(item.label, offer.content),
                        text: fillPlaceholders(item.text, offer.content),
                      })),
                    ),
                  },
                ]}
                className="not-prose py-6"
              />
            </OfferSection>

            <OfferSection
              id="architecture"
              eyebrow={content.architecture.header}
              aside={clientLogo}
            >
              {/* Outside `prose` so Typography doesn't restyle the steps. */}
              <Feature99
                heading={null}
                columns={2}
                steps={content.architecture.steps.map((step, i) => {
                  const Icon = ARCHITECTURE_ICONS[i % ARCHITECTURE_ICONS.length];
                  return {
                    title: step.title,
                    items: step.items,
                    icon: <Icon strokeWidth={1.5} className="size-10 lg:size-12" />,
                  };
                })}
                className="not-prose py-0"
              />
            </OfferSection>

            <OfferSection id="pricing" eyebrow="Цени" aside={clientLogo}>
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
                className="not-prose py-0"
              />
              <p className="text-sm">{pricing.vatNote}</p>
            </OfferSection>

            <OfferSection id="contact" eyebrow="Контакт" aside={clientLogo}>
              <h2>Свържете се с нас</h2>
              <div className="not-prose flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{contact.name}</p>
                  <p>{contact.role}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <Mail className="size-4" />
                    {contact.email}
                  </a>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <Phone className="size-4" />
                    {contact.phone}
                  </a>
                </div>
              </div>
            </OfferSection>
          </div>
        </div>
      </div>
    </section>
  );
}
