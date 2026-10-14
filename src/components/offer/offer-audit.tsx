import { ChartRadialShape } from "@/components/chart-radial-shape";
import type { Offer, OfferMetricKey, OfferStatic } from "@/types/offer";
import { KeywordTable } from "./keyword-table";
import { OfferSection, formatDate, formatNumber } from "./offer-ui";

const METRIC_ORDER: OfferMetricKey[] = [
  "domainRating",
  "backlinks",
  "organicKeywords",
  "organicTraffic",
];

export function OfferAudit({
  offer,
  audit,
}: {
  offer: Offer;
  audit: OfferStatic["audit"];
}) {
  const { metrics, keywords, client } = offer;

  return (
    <OfferSection
      id="audit"
      heading={
        <>
          {audit.header} |{" "}
          <a href={client.url} className="text-primary hover:underline">
            {client.url.replace(/^https?:\/\//, "")}
          </a>
        </>
      }
      description={`Източник: ${metrics.source}, ${formatDate(metrics.date)}`}
    >
      <dl className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRIC_ORDER.map((key) => (
          <div key={key} className="rounded-2xl border border-border bg-card p-6">
            <dt className="text-sm text-muted-foreground">{audit.metricLabels[key]}</dt>
            {key === "domainRating" ? (
              // DR is a 0–100 score, so show it as a gauge.
              <dd className="mt-2">
                <ChartRadialShape
                  value={metrics.domainRating}
                  max={100}
                  label="от 100"
                  className="max-w-none border-0 bg-transparent p-0"
                />
              </dd>
            ) : (
              <dd className="mt-2 text-3xl font-semibold tabular-nums sm:text-4xl">
                {formatNumber(metrics[key])}
              </dd>
            )}
          </div>
        ))}
      </dl>

      <h3 className="mb-4 text-lg font-semibold">{audit.keywordsHeader}</h3>
      <KeywordTable keywords={keywords} columns={audit.columns} />
    </OfferSection>
  );
}
