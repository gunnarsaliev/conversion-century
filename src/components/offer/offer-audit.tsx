import type { Offer, OfferMetricKey, OfferStatic } from "@/types/offer";
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
            <dd className="mt-2 text-3xl font-semibold tabular-nums sm:text-4xl">
              {formatNumber(metrics[key])}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mb-4 text-lg font-semibold">{audit.keywordsHeader}</h3>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">{audit.columns.keyword}</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">{audit.columns.position}</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">{audit.columns.volume}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {keywords.map((row) => (
              <tr key={row.keyword}>
                <td className="px-4 py-3">{row.keyword}</td>
                <td className="px-4 py-3 text-right tabular-nums">{row.position}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(row.volume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OfferSection>
  );
}
