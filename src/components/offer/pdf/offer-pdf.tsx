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
  fillPlaceholders,
  formatAmount,
  formatDate,
  formatNumber,
  packageFeatures,
  pricingHeading,
} from "@/components/offer/offer-ui";
import type { LabeledItem, Offer, OfferContact, OfferStatic } from "@/types/offer";

// The PDF version of the special-offer page, rendered on the server with
// @react-pdf/renderer. It reads the same JSON as the page, so the text stays
// in sync; only layout lives here.

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
  header: "#f3f4f6",
  primary: "#111827",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.5,
    color: colors.text,
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 48,
  },
  // `top` rather than `bottom`: react-pdf mis-places `render` text anchored to the bottom.
  footer: {
    position: "absolute",
    top: 800, // A4 is 842pt tall
    lineHeight: 1,
    left: 48,
    right: 48,
    fontSize: 8,
    color: colors.muted,
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 12 },
  // The page's lineHeight is inherited as a fixed size, so larger text sets its own.
  h2: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.3,
    marginTop: 24,
    marginBottom: 10,
  },
  h3: { fontSize: 12, fontWeight: 600, marginTop: 14, marginBottom: 6 },
  muted: { color: colors.muted },
  link: { color: colors.text, textDecoration: "none" },
  paragraph: { marginBottom: 8 },
  bold: { fontWeight: 600 },
  bigNumber: { fontSize: 18, fontWeight: 700, lineHeight: 1.3 },
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
  },
  listItem: { flexDirection: "row", marginBottom: 4 },
  bullet: { width: 14, color: colors.muted },
  listText: { flex: 1 },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 24,
    rowGap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // A topic panel, matching the web page: a tinted header bar over a bordered body.
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    // Spans the full panel width over the panel's own padding.
    marginHorizontal: -16,
    marginBottom: 4,
    backgroundColor: colors.header,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    lineHeight: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 5,
  },
});

const countryNames = new Intl.DisplayNames(["bg"], { type: "region" });

// Pairs items up so cards can be laid out two per row.
const pairs = <T,>(items: T[]) =>
  Array.from({ length: Math.ceil(items.length / 2) }, (_, i) =>
    items.slice(i * 2, i * 2 + 2),
  );

function Bullet({
  marker = "•",
  children,
}: {
  marker?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.listItem} wrap={false}>
      <Text style={styles.bullet}>{marker}</Text>
      <Text style={styles.listText}>{children}</Text>
    </View>
  );
}

function Labeled({ item }: { item: LabeledItem }) {
  return (
    <>
      <Text style={styles.bold}>
        {item.label}
        {item.text ? ":" : ""}
      </Text>
      {item.text ? (
        <>
          {" "}
          <Text style={styles.muted}>{item.text}</Text>
        </>
      ) : null}
    </>
  );
}

function MetaItem({
  label,
  value,
  avatar,
}: {
  label: string;
  value: string;
  /** Profile image shown before the value, e.g. for "Оферта от". */
  avatar?: OfferPdfImages["contactAvatar"];
}) {
  // Capped so long values (several services) wrap instead of overlapping.
  return (
    <View style={{ maxWidth: 160 }}>
      <Text style={styles.eyebrow}>{label}</Text>
      {avatar ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text */}
          <Image
            src={avatar}
            style={{ width: 16, height: 16, borderRadius: 8, objectFit: "cover" }}
          />
          <Text style={styles.bold}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.bold}>{value}</Text>
      )}
    </View>
  );
}

// One topic of the offer as a panel; long panels continue onto the next page.
// `lead` (the heading and first block) is kept on one page with the header
// bar, so the bar never sits alone above an empty gap at the bottom of a page.
// (`minPresenceAhead` doesn't do this for views nested inside the panel.)
function Section({
  label,
  lead,
  children,
}: {
  label: string;
  lead: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View wrap={false}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionLabel}>{label}</Text>
        </View>
        {lead}
      </View>
      {children}
    </View>
  );
}

// The first heading in a panel sits right under the header bar.
const firstHeading = { marginTop: 12 };

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
  const { pricing, audit } = content;
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
    : offer.client.name;

  // Unset metrics are stored as 0 (see toOffer), so 0 hides the card.
  const stats: { title: string; value: string; suffix?: string }[] = [
    {
      title: audit.metricLabels.domainRating,
      value: offer.metrics.domainRating,
      suffix: "от 100",
    },
    { title: audit.metricLabels.backlinks, value: offer.metrics.backlinks },
    { title: audit.metricLabels.organicKeywords, value: offer.metrics.organicKeywords },
    { title: audit.metricLabels.organicTraffic, value: offer.metrics.organicTraffic },
  ]
    .filter((stat) => stat.value > 0)
    .map((stat) => ({ ...stat, value: formatNumber(stat.value) }));

  const groupSections = [
    {
      header: content.technical.header,
      description: content.technical.description,
      // Titles only: the services' descriptions are for the web page's tooltips.
      groups: (offer.technicalGroups ?? content.technical.groups).map((group) => ({
        title: group.title,
        items: group.items.map((item) => ({ label: item.label, text: "" })),
      })),
    },
    {
      header: content.contentStrategy.header,
      description: content.contentStrategy.description,
      groups: content.contentStrategy.groups.map((group) => ({
        title: group.title,
        items: group.items.map((item) => ({
          label: fillPlaceholders(item.label, offer.content),
          text: fillPlaceholders(item.text, offer.content),
        })),
      })),
    },
    // Without the technical brief, the content strategy leads.
  ].filter((section) => section.groups.length > 0);

  const pillarRows = pairs(content.agency.pillars).map((row, r) => (
    <View key={r} style={[styles.row, { marginBottom: 12 }]} wrap={false}>
      {row.map((pillar, i) => (
        <View key={pillar.title} style={styles.card}>
          <Text style={[styles.muted, { fontSize: 8 }]}>
            {String(r * 2 + i + 1).padStart(2, "0")}
          </Text>
          <Text style={[styles.bold, { fontSize: 12, marginBottom: 4 }]}>
            {pillar.title.toUpperCase()}
          </Text>
          <Text style={styles.muted}>{pillar.description}</Text>
        </View>
      ))}
    </View>
  ));

  const phaseRows = offer.timeline.map((phase, i) => (
    <View
      key={phase.label}
      wrap={false}
      style={{
        flexDirection: "row",
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={[styles.muted, { width: 90 }]}>
        {content.timeline.weekLabel}{" "}
        {phase.startWeek === phase.endWeek
          ? phase.startWeek
          : `${phase.startWeek}–${phase.endWeek}`}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.bold}>
          {i + 1}. {phase.label}
        </Text>
        <Text style={styles.muted}>{phase.description}</Text>
      </View>
    </View>
  ));

  // `start` keeps the numbering when a section's groups are split.
  const groupBlocks = (groups: (typeof groupSections)[number]["groups"], start = 0) =>
    groups.map((group, i) => (
      <View key={group.title} wrap={false}>
        <Text style={styles.h3}>
          {start + i + 1}. {group.title}
        </Text>
        {group.items.map((item) => (
          <Bullet key={item.label}>
            <Labeled item={item} />
          </Bullet>
        ))}
      </View>
    ));

  const summaryBullets = offer.scopeSummary.map((item) => (
    <Bullet key={item.label}>
      <Labeled item={item} />
    </Bullet>
  ));

  return (
    <Document
      title={`${heading} – ${offer.client.name}`}
      author={content.brand.name}
      language="bg"
    >
      <Page size="A4" style={styles.page}>
        {/* Cover */}
        {/* react-pdf images have no alt text. */}
        {images.clientLogo && (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image src={images.clientLogo} style={{ width: 120, marginBottom: 24 }} />
        )}
        <Text style={styles.eyebrow}>Специална оферта за {offer.client.name}</Text>
        <Text style={styles.title}>{heading}</Text>
        <View style={styles.meta}>
          <MetaItem
            label="Оферта от"
            value={offer.preparedBy ?? content.trackRecord.contact.name}
            avatar={offer.preparedBy ? images.contactAvatar : undefined}
          />
          <MetaItem
            label={(offer.services?.length ?? 0) > 1 ? "Услуги" : "Услуга"}
            value={offer.service}
          />
          <MetaItem
            label={pricing.priceLabel}
            value={`${formatAmount(recommended.price)} ${pricing.currencyLabel}`}
          />
          <MetaItem label="Дата" value={formatDate(offer.date)} />
          <MetaItem label="Валидна до" value={formatDate(offer.validUntil)} />
        </View>

        <Section
          label="Въведение"
          lead={
            <>
              <Text style={[styles.h2, firstHeading]}>
                {offer.service} на {site}
              </Text>
              {content.brand.intro.map((paragraph) => (
                <Text key={paragraph} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </>
          }
        >
          {/* react-pdf images have no alt text. */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src={{ data: images.certifications, format: "png" }}
            style={{ width: 300, alignSelf: "center", marginVertical: 12 }}
          />
        </Section>

        <Section
          label="За нас"
          lead={
            <>
              <Text style={[styles.h2, firstHeading]}>{content.agency.header}</Text>
              {pillarRows[0]}
            </>
          }
        >
          {pillarRows.slice(1)}

          <View wrap={false}>
            <Text style={styles.h3}>{content.socialProof.countriesHeader}</Text>
            <Text style={styles.paragraph}>
              {content.socialProof.countriesDescription}
            </Text>
            <Text style={styles.muted}>
              {content.socialProof.countries
                .map((code) => countryNames.of(code === "UK" ? "GB" : code) ?? code)
                .join(" · ")}
            </Text>
          </View>
        </Section>

        {(stats.length > 0 || offer.keywords.length > 0) && (
        <Section
          label="Одит"
          lead={
            <View>
              <Text style={[styles.h2, firstHeading]}>
                {audit.header} | {site}
              </Text>
              {pairs(stats).map((row, r) => (
                <View key={r} style={[styles.row, { marginBottom: 12 }]}>
                  {row.map((stat) => (
                    <View key={stat.title} style={styles.card}>
                      <Text style={styles.muted}>{stat.title}</Text>
                      <Text style={styles.bigNumber}>
                        {stat.value}
                        {stat.suffix && (
                          <Text style={[styles.muted, { fontSize: 10, fontWeight: 400 }]}>
                            {" "}
                            {stat.suffix}
                          </Text>
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
              {stats.length > 0 && (
                <Text style={[styles.muted, { fontSize: 8 }]}>
                  {offer.metrics.source}, {formatDate(offer.metrics.date)}
                </Text>
              )}
            </View>
          }
        >
          {offer.keywords.length > 0 && (
          <View wrap={false}>
            <Text style={styles.h3}>{audit.keywordsHeader}</Text>
            <View style={[styles.tableRow, { borderBottomColor: colors.text }]}>
              <Text style={[styles.bold, { flex: 3 }]}>{audit.columns.keyword}</Text>
              <Text style={[styles.bold, { flex: 1, textAlign: "right" }]}>
                {audit.columns.position}
              </Text>
              <Text style={[styles.bold, { flex: 2, textAlign: "right" }]}>
                {audit.columns.volume}
              </Text>
            </View>
            {offer.keywords.map((row) => (
              <View key={row.keyword} style={styles.tableRow}>
                <Text style={{ flex: 3 }}>{row.keyword}</Text>
                <Text style={{ flex: 1, textAlign: "right" }}>{row.position}</Text>
                <Text style={{ flex: 2, textAlign: "right" }}>
                  {formatNumber(row.volume)}
                </Text>
              </View>
            ))}
          </View>
          )}
        </Section>
        )}

        {offer.timeline.length > 0 && (
          <Section
            label="План"
            lead={
              <>
                <Text style={[styles.h2, firstHeading]}>
                  {content.timeline.activityHeader}
                  {offer.startLabel ? `: ${offer.startLabel}` : ""}
                </Text>
                {phaseRows[0]}
              </>
            }
          >
            {phaseRows.slice(1)}
            <Text style={[styles.paragraph, { marginTop: 10 }]}>
              <Text style={styles.bold}>{content.timeline.responsibilitiesHeader}:</Text>{" "}
              {offer.responsibilities}
            </Text>
          </Section>
        )}

        <Section
          label="Обхват на работата"
          lead={
            <>
              <Text style={[styles.h2, firstHeading]}>
                {groupSections[0].header} {offer.siteType}
              </Text>
              <Text style={[styles.paragraph, styles.muted]}>
                {groupSections[0].description}
              </Text>
              {groupBlocks(groupSections[0].groups.slice(0, 1))}
            </>
          }
        >
          {/* Technical brief (continued) and content strategy */}
          {groupSections.map((section, s) => (
            <View key={section.header}>
              {s > 0 && (
                <>
                  <Text style={styles.h2} minPresenceAhead={80}>
                    {section.header} {offer.siteType}
                  </Text>
                  <Text style={[styles.paragraph, styles.muted]}>
                    {section.description}
                  </Text>
                </>
              )}
              {s === 0
                ? groupBlocks(section.groups.slice(1), 1)
                : groupBlocks(section.groups)}
            </View>
          ))}

          {/* Architecture */}
          <Text style={styles.h2} minPresenceAhead={80}>
            {content.architecture.header}
          </Text>
          {content.architecture.steps.map((step, i) => (
            <View key={step.title} wrap={false} style={{ marginBottom: 6 }}>
              <Text style={styles.bold}>
                {i + 1}. {step.title}
              </Text>
              <View style={{ paddingLeft: 14 }}>
                {step.items.map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Section
          label="Цени"
          lead={
            <>
              <Text style={[styles.h2, firstHeading]}>{heading}</Text>
              {summaryBullets[0]}
            </>
          }
        >
          {summaryBullets.slice(1)}
          <View wrap={false}>
            <Text style={styles.h3}>{pricing.packagesHeader}</Text>
            <View style={styles.row}>
              {offer.packages.map((pkg, i) => (
                <View
                  key={i}
                  style={[
                    styles.card,
                    pkg.recommended
                      ? { borderColor: colors.primary, borderWidth: 2 }
                      : {},
                  ]}
                >
                  {pkg.hours !== undefined && (
                    <Text style={styles.muted}>
                      {pkg.hours} {pricing.hoursLabel}
                    </Text>
                  )}
                  <Text style={[styles.bigNumber, { marginTop: 4, marginBottom: 8 }]}>
                    {pricing.priceLabel}: {formatAmount(pkg.price)}{" "}
                    {pricing.currencyLabel}
                  </Text>
                  {packageFeatures(pkg).map((feature) => (
                    <Bullet key={feature}>{feature}</Bullet>
                  ))}
                  {pkg.description && (
                    <Text style={{ marginTop: 8 }}>
                      {convertLexicalToPlaintext({ data: pkg.description }).trim()}
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <Text style={[styles.muted, { fontSize: 8, marginTop: 8 }]}>
              {pricing.vatNote}
            </Text>
          </View>
        </Section>
        <Section
          label="Контакт"
          lead={
            <>
              <Text style={[styles.h2, firstHeading]}>Свържете се с нас</Text>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <View style={[styles.row, { alignItems: "center" }]}>
                  {images.contactAvatar && (
                    // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf images have no alt text
                    <Image
                      src={images.contactAvatar}
                      style={{ width: 40, height: 40, borderRadius: 20, objectFit: "cover" }}
                    />
                  )}
                  <View>
                    <Text style={[styles.bold, { fontSize: 12 }]}>{contact.name}</Text>
                    {contact.role && <Text style={styles.muted}>{contact.role}</Text>}
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Link src={`mailto:${contact.email}`} style={styles.link}>
                    {contact.email}
                  </Link>
                  {contact.phone && (
                    <Link
                      src={`tel:${contact.phone.replace(/\s/g, "")}`}
                      style={styles.link}
                    >
                      {contact.phone}
                    </Link>
                  )}
                </View>
              </View>
            </>
          }
        />
        {/* Last child so react-pdf repeats it at the bottom of every page. */}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `${content.brand.name} · ${content.brand.website} · ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
