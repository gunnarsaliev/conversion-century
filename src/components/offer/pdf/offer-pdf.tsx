import { convertLexicalToPlaintext } from "@payloadcms/richtext-lexical/plaintext";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import path from "node:path";

import {
  discountAmount,
  fillPlaceholders,
  formatAmount,
  formatDate,
  formatNumber,
  packageTotal,
  pricingHeading,
} from "@/components/offer/offer-ui";
import type { LabeledItem, Offer, OfferContact, OfferPackage, OfferStatic } from "@/types/offer";

// The PDF version of an offer, rendered on the server with
// @react-pdf/renderer. It reads the same data as the offer page, so the text
// stays in sync; only layout lives here. Laid out as a formal commercial
// proposal: letterhead, parties and key terms, then numbered sections with
// plain headings and tables, terms and a signature block.

// Helvetica, react-pdf's default, has no Cyrillic glyphs; Inter does.
// Plain paths (not require.resolve) so webpack leaves them alone; the files are
// traced into the deployment via `outputFileTracingIncludes` in next.config.mjs.
const interFile = (weight: string) =>
  path.join(
    process.cwd(),
    "node_modules/@expo-google-fonts/inter",
    weight,
    `Inter_${weight}.ttf`,
  );

Font.register({
  family: "Inter",
  fonts: [
    { src: interFile("400Regular"), fontWeight: 400 },
    { src: interFile("600SemiBold"), fontWeight: 600 },
    { src: interFile("700Bold"), fontWeight: 700 },
  ],
});
// Don't split words at arbitrary points; react-pdf hyphenates English rules otherwise.
Font.registerHyphenationCallback((word) => [word]);

const colors = {
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  surface: "#f9fafb",
  accent: "#111827",
};

const PAGE_X = 56;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    lineHeight: 1.5,
    color: colors.text,
    paddingTop: 72,
    paddingBottom: 64,
    paddingHorizontal: PAGE_X,
  },
  // Letterhead and footer repeat on every page.
  letterhead: {
    position: "absolute",
    top: 28,
    left: PAGE_X,
    right: PAGE_X,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    fontSize: 8,
    lineHeight: 1,
    color: colors.muted,
  },
  brand: { fontSize: 10, fontWeight: 700, color: colors.text, letterSpacing: 0.5 },
  // `top` rather than `bottom`: react-pdf mis-places `render` text anchored to the bottom.
  footer: {
    position: "absolute",
    top: 800, // A4 is 842pt tall
    left: PAGE_X,
    right: PAGE_X,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontSize: 7.5,
    lineHeight: 1,
    color: colors.muted,
  },
  label: {
    fontSize: 7.5,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 3,
  },
  // The page's lineHeight is inherited as a fixed size, so larger text sets its own.
  title: { fontSize: 22, fontWeight: 700, lineHeight: 1.25 },
  subtitle: { fontSize: 11, color: colors.muted, marginTop: 6 },
  h2: {
    flexDirection: "row",
    gap: 8,
    fontSize: 12.5,
    fontWeight: 700,
    lineHeight: 1.3,
    marginTop: 22,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
  },
  h3: { fontSize: 10, fontWeight: 600, marginTop: 12, marginBottom: 4 },
  muted: { color: colors.muted },
  bold: { fontWeight: 600 },
  paragraph: { marginBottom: 6 },
  link: { color: colors.text, textDecoration: "none" },
  listItem: { flexDirection: "row", marginBottom: 2 },
  bullet: { width: 12, color: colors.muted },
  listText: { flex: 1 },
  // Two columns of label/value blocks (parties, signatures).
  columns: { flexDirection: "row", gap: 24 },
  column: { flex: 1 },
  // Key terms band under the parties.
  terms: {
    flexDirection: "row",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
  },
  term: { flex: 1 },
  termValue: { fontSize: 10.5, fontWeight: 600 },
  table: { marginTop: 4 },
  th: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    fontWeight: 600,
    fontSize: 8.5,
  },
  tr: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    fontWeight: 700,
  },
  signatureLine: {
    marginTop: 36,
    borderTopWidth: 1,
    borderTopColor: colors.text,
    paddingTop: 4,
  },
});

const countryNames = new Intl.DisplayNames(["bg"], { type: "region" });

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.listItem} wrap={false}>
      <Text style={styles.bullet}>–</Text>
      <Text style={styles.listText}>{children}</Text>
    </View>
  );
}

function Labeled({ item }: { item: LabeledItem }) {
  return (
    <>
      <Text style={styles.bold}>{item.label}</Text>
      {item.text ? <Text style={styles.muted}> – {item.text}</Text> : null}
    </>
  );
}

// "3. Цена": a numbered heading ruled underneath, kept with what follows.
function Heading({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <View style={styles.h2} minPresenceAhead={90} wrap={false}>
      <Text>{number}.</Text>
      <Text style={{ flex: 1 }}>{children}</Text>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

// A package as a table of its service lines with total hours and price.
function PackageTable({
  pkg,
  pricing,
  title,
}: {
  pkg: OfferPackage;
  pricing: OfferStatic["pricing"];
  title?: string;
}) {
  const lines = pkg.lines ?? [];
  const description = pkg.description
    ? convertLexicalToPlaintext({ data: pkg.description }).trim()
    : "";

  return (
    <View wrap={false} style={{ marginBottom: 14 }}>
      {title && <Text style={styles.h3}>{title}</Text>}
      <View style={styles.table}>
        <View style={styles.th}>
          <Text style={{ width: 24 }}>№</Text>
          <Text style={{ flex: 1 }}>Услуга</Text>
          <Text style={{ width: 80, textAlign: "right" }}>Часове</Text>
        </View>
        {lines.length > 0 ? (
          lines.map((line, i) => (
            <View key={`${line.service}-${i}`} style={styles.tr}>
              <Text style={[styles.muted, { width: 24 }]}>{i + 1}</Text>
              <Text style={{ flex: 1 }}>{line.service}</Text>
              <Text style={{ width: 80, textAlign: "right" }}>{formatAmount(line.hours)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tr}>
            <Text style={[styles.muted, { width: 24 }]}>1</Text>
            <Text style={{ flex: 1 }}>{pkg.name || "Пакет услуги"}</Text>
            <Text style={{ width: 80, textAlign: "right" }}>
              {pkg.hours !== undefined ? formatAmount(pkg.hours) : "—"}
            </Text>
          </View>
        )}
        {pkg.hours !== undefined && lines.length > 1 && (
          <View style={[styles.tr, { borderBottomColor: colors.text }]}>
            <Text style={{ width: 24 }} />
            <Text style={[styles.bold, { flex: 1 }]}>Общо часове</Text>
            <Text style={[styles.bold, { width: 80, textAlign: "right" }]}>
              {formatAmount(pkg.hours)}
            </Text>
          </View>
        )}
        {/* With a discount: the price before it, then the amount taken off. */}
        {pkg.discount ? (
          <>
            <View style={styles.tr}>
              <Text style={{ width: 24 }} />
              <Text style={{ flex: 1 }}>Стойност</Text>
              <Text style={{ textAlign: "right" }}>
                {formatAmount(pkg.price)} {pricing.currencyLabel}
              </Text>
            </View>
            <View style={[styles.tr, { borderBottomColor: colors.text }]}>
              <Text style={{ width: 24 }} />
              <Text style={{ flex: 1 }}>Отстъпка ({formatAmount(pkg.discount)}%)</Text>
              <Text style={{ textAlign: "right" }}>
                −{formatAmount(discountAmount(pkg))} {pricing.currencyLabel}
              </Text>
            </View>
          </>
        ) : null}
        <View style={styles.totalRow}>
          <Text style={{ width: 24 }} />
          <Text style={{ flex: 1 }}>Обща стойност (без ДДС)</Text>
          <Text style={{ textAlign: "right", fontSize: 11 }}>
            {formatAmount(packageTotal(pkg))} {pricing.currencyLabel}
          </Text>
        </View>
      </View>
      {pkg.features.map((feature) => (
        <Bullet key={feature}>{feature}</Bullet>
      ))}
      {description ? <Text style={{ marginTop: 6 }}>{description}</Text> : null}
    </View>
  );
}

export interface OfferPdfImages {
  /** The client's logo; react-pdf only embeds PNG and JPEG. Skipped when absent. */
  clientLogo?: { data: Buffer; format: "png" | "jpg" };
  /** The contact person's profile image; same format limits. */
  contactAvatar?: { data: Buffer; format: "png" | "jpg" };
  /** PNG bytes of the combined partner/certification badges. */
  certifications: Buffer;
}

export function OfferPdf({
  content,
  offer,
  images,
}: {
  content: OfferStatic;
  offer: Offer;
  images: OfferPdfImages;
}) {
  const { pricing, audit, brand } = content;
  // The offer's preparer, or the agency's default contact. The phone is the
  // agency's for now, since users have no phone number.
  const contact: OfferContact = {
    ...(offer.contact ?? content.trackRecord.contact),
    phone: content.trackRecord.contact.phone,
  };
  const recommended = offer.packages.find((pkg) => pkg.recommended) ?? offer.packages[0];
  const heading = pricingHeading(pricing, offer);
  const site = offer.client.url
    ? offer.client.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  // Unset metrics are stored as 0 (see toOffer), so 0 leaves the column out.
  const stats = [
    { title: audit.metricLabels.domainRating, value: offer.metrics.domainRating },
    { title: audit.metricLabels.backlinks, value: offer.metrics.backlinks },
    { title: audit.metricLabels.organicKeywords, value: offer.metrics.organicKeywords },
    { title: audit.metricLabels.organicTraffic, value: offer.metrics.organicTraffic },
  ].filter((stat) => stat.value > 0);
  const hasAudit = stats.length > 0 || offer.keywords.length > 0;

  // Titles only: the services' descriptions are for the web page's tooltips.
  const technicalGroups = (offer.technicalGroups ?? content.technical.groups).filter(
    (group) => group.items.length > 0,
  );
  const contentGroups = content.contentStrategy.groups.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      label: fillPlaceholders(item.label, offer.content),
      text: fillPlaceholders(item.text, offer.content),
    })),
  }));

  // Sections are numbered in the order they appear; optional ones drop out.
  let section = 0;
  const next = () => ++section;

  return (
    <Document title={`${heading} – ${offer.client.name}`} author={brand.name} language="bg">
      <Page size="A4" style={styles.page}>
        <View style={styles.letterhead} fixed>
          <Text style={styles.brand}>{brand.name.toUpperCase()}</Text>
          <Text>
            Търговско предложение № {offer.id} · {formatDate(offer.date)}
          </Text>
        </View>

        {/* Title */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Търговско предложение</Text>
            <Text style={styles.title}>{heading}</Text>
            <Text style={styles.subtitle}>
              Изготвено за {offer.client.name}
              {site ? ` · ${site}` : ""}
            </Text>
          </View>
          {images.clientLogo && (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text
            <Image
              src={images.clientLogo}
              style={{ width: 96, maxHeight: 56, objectFit: "contain" }}
            />
          )}
        </View>

        {/* Parties */}
        <View style={[styles.columns, { marginTop: 28 }]}>
          <View style={styles.column}>
            <Field label="Възложител">
              <Text style={styles.bold}>{offer.client.name}</Text>
              {site ? <Text style={styles.muted}>{site}</Text> : null}
            </Field>
          </View>
          <View style={styles.column}>
            <Field label="Изпълнител">
              <Text style={styles.bold}>{brand.name}</Text>
              <Text style={styles.muted}>{brand.website}</Text>
            </Field>
          </View>
          <View style={styles.column}>
            <Field label="Лице за контакт">
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                {images.contactAvatar && (
                  // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text
                  <Image
                    src={images.contactAvatar}
                    style={{ width: 18, height: 18, borderRadius: 9, objectFit: "cover" }}
                  />
                )}
                <Text style={styles.bold}>{contact.name}</Text>
              </View>
              {contact.role && <Text style={styles.muted}>{contact.role}</Text>}
              <Link src={`mailto:${contact.email}`} style={[styles.link, styles.muted]}>
                {contact.email}
              </Link>
              {contact.phone && (
                <Link
                  src={`tel:${contact.phone.replace(/\s/g, "")}`}
                  style={[styles.link, styles.muted]}
                >
                  {contact.phone}
                </Link>
              )}
            </Field>
          </View>
        </View>

        {/* Key terms */}
        <View style={styles.terms}>
          <View style={styles.term}>
            <Text style={styles.label}>Оферта №</Text>
            <Text style={styles.termValue}>{offer.id}</Text>
          </View>
          <View style={styles.term}>
            <Text style={styles.label}>Дата</Text>
            <Text style={styles.termValue}>{formatDate(offer.date)}</Text>
          </View>
          <View style={styles.term}>
            <Text style={styles.label}>Валидна до</Text>
            <Text style={styles.termValue}>{formatDate(offer.validUntil)}</Text>
          </View>
          {recommended && (
            <View style={styles.term}>
              <Text style={styles.label}>Стойност (без ДДС)</Text>
              <Text style={styles.termValue}>
                {formatAmount(packageTotal(recommended))} {pricing.currencyLabel}
              </Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <Heading number={next()}>Резюме</Heading>
        {brand.intro.map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
        {offer.scopeSummary.map((item) => (
          <Bullet key={item.label}>
            <Labeled item={item} />
          </Bullet>
        ))}

        {/* Audit */}
        {hasAudit && (
          <>
            <Heading number={next()}>
              {audit.header}
              {site ? ` · ${site}` : ""}
            </Heading>
            {stats.length > 0 && (
              <View wrap={false}>
                <View style={styles.th}>
                  {stats.map((stat) => (
                    <Text key={stat.title} style={{ flex: 1 }}>
                      {stat.title}
                    </Text>
                  ))}
                </View>
                <View style={styles.tr}>
                  {stats.map((stat) => (
                    <Text key={stat.title} style={[styles.bold, { flex: 1, fontSize: 11 }]}>
                      {formatNumber(stat.value)}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.muted, { fontSize: 7.5, marginTop: 4 }]}>
                  Източник: {offer.metrics.source}, {formatDate(offer.metrics.date)}
                </Text>
              </View>
            )}
            {offer.keywords.length > 0 && (
              <View>
                <Text style={styles.h3} minPresenceAhead={60}>
                  {audit.keywordsHeader}
                </Text>
                <View style={styles.th} wrap={false}>
                  <Text style={{ flex: 3 }}>{audit.columns.keyword}</Text>
                  <Text style={{ flex: 1, textAlign: "right" }}>{audit.columns.position}</Text>
                  <Text style={{ flex: 2, textAlign: "right" }}>{audit.columns.volume}</Text>
                </View>
                {offer.keywords.map((row) => (
                  <View key={row.keyword} style={styles.tr} wrap={false}>
                    <Text style={{ flex: 3 }}>{row.keyword}</Text>
                    <Text style={{ flex: 1, textAlign: "right" }}>{row.position}</Text>
                    <Text style={{ flex: 2, textAlign: "right" }}>
                      {formatNumber(row.volume)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Scope */}
        <Heading number={next()}>Обхват на работата</Heading>
        {technicalGroups.length > 0 && (
          <>
            <Text style={[styles.paragraph, styles.muted]}>{content.technical.description}</Text>
            {technicalGroups.map((group) => (
              <View key={group.title} wrap={false}>
                <Text style={styles.h3}>{group.title}</Text>
                {group.items.map((item) => (
                  <Bullet key={item.label}>{item.label}</Bullet>
                ))}
              </View>
            ))}
          </>
        )}
        <Text style={styles.h3} minPresenceAhead={60}>
          {content.architecture.header}
        </Text>
        {content.architecture.steps.map((step) => (
          <Bullet key={step.title}>
            <Text style={styles.bold}>{step.title}</Text>
            <Text style={styles.muted}> – {step.items.join("; ")}</Text>
          </Bullet>
        ))}
        <Text style={styles.h3} minPresenceAhead={60}>
          {content.contentStrategy.header}
        </Text>
        {contentGroups.map((group) => (
          <Bullet key={group.title}>
            <Text style={styles.bold}>{group.title}</Text>
            <Text style={styles.muted}>
              {" "}
              – {group.items.map((item) => item.label).join("; ")}
            </Text>
          </Bullet>
        ))}

        {/* Timeline (fixture offers only) */}
        {offer.timeline.length > 0 && (
          <>
            <Heading number={next()}>
              {content.timeline.activityHeader}
              {offer.startLabel ? `: ${offer.startLabel}` : ""}
            </Heading>
            <View style={styles.th} wrap={false}>
              <Text style={{ width: 80 }}>{content.timeline.weekLabel}</Text>
              <Text style={{ flex: 1 }}>Етап</Text>
            </View>
            {offer.timeline.map((phase) => (
              <View key={phase.label} style={styles.tr} wrap={false}>
                <Text style={[styles.muted, { width: 80 }]}>
                  {phase.startWeek === phase.endWeek
                    ? phase.startWeek
                    : `${phase.startWeek}–${phase.endWeek}`}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bold}>{phase.label}</Text>
                  <Text style={styles.muted}>{phase.description}</Text>
                </View>
              </View>
            ))}
            {offer.responsibilities ? (
              <Text style={{ marginTop: 8 }}>
                <Text style={styles.bold}>{content.timeline.responsibilitiesHeader}: </Text>
                {offer.responsibilities}
              </Text>
            ) : null}
          </>
        )}

        {/* Price */}
        {offer.packages.length > 0 &&
          offer.packages.map((pkg, i) => {
            const table = (
              <PackageTable
                key={i}
                pkg={pkg}
                pricing={pricing}
                title={
                  offer.packages.length > 1
                    ? `${pricing.variantLabel} ${i + 1}${pkg.name ? `: ${pkg.name}` : ""}${
                        pkg.recommended ? ` (${pricing.recommendedLabel.toLowerCase()})` : ""
                      }`
                    : undefined
                }
              />
            );
            // The heading stays on the same page as the first package.
            return i === 0 ? (
              <View key={i} wrap={false}>
                <Heading number={next()}>Ценово предложение</Heading>
                {table}
              </View>
            ) : (
              table
            );
          })}

        {/* Terms */}
        <Heading number={next()}>Условия</Heading>
        <Bullet>Офертата е валидна до {formatDate(offer.validUntil)}</Bullet>
        <Bullet>{pricing.vatNote}</Bullet>
        <Bullet>
          Работата започва след писмено потвърждение на офертата от Възложителя.
        </Bullet>

        {/* About */}
        <Heading number={next()}>{content.agency.header}</Heading>
        {content.agency.about.slice(1).map((paragraph) => (
          <Text key={paragraph} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
        <Text style={[styles.paragraph, styles.muted]}>
          {content.socialProof.countriesHeader}:{" "}
          {content.socialProof.countries
            .map((code) => countryNames.of(code === "UK" ? "GB" : code) ?? code)
            .join(", ")}
          .
        </Text>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text */}
        <Image
          src={{ data: images.certifications, format: "png" }}
          style={{ width: 240, marginTop: 6 }}
        />

        {/* Acceptance */}
        <View wrap={false}>
          <Heading number={next()}>Приемане на офертата</Heading>
          <Text style={styles.muted}>
            С подписа си страните потвърждават съгласието си с обхвата, цената и условията,
            описани в настоящото предложение.
          </Text>
          <View style={[styles.columns, { marginTop: 8 }]}>
            {[
              { party: "За Изпълнителя", name: `${contact.name}, ${brand.name}` },
              { party: "За Възложителя", name: offer.client.name },
            ].map(({ party, name }) => (
              <View key={party} style={styles.column}>
                <View style={styles.signatureLine}>
                  <Text style={styles.label}>{party}</Text>
                  <Text>{name}</Text>
                  <Text style={[styles.muted, { marginTop: 10 }]}>Дата: ________________</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Last child so react-pdf repeats it at the bottom of every page. */}
        <View style={styles.footer} fixed>
          <Text>
            {brand.name} · {brand.website} · Поверително
          </Text>
          <Text
            render={({ pageNumber, totalPages }) => `Стр. ${pageNumber} от ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
