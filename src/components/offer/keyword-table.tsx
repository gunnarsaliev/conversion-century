import { cn } from "cn";

import type { Offer, OfferStatic } from "@/types/offer";
import { formatNumber } from "./offer-ui";

// Keyword, ranking position and monthly search volume for an offer.
export function KeywordTable({
  keywords,
  columns,
  className,
}: {
  keywords: Offer["keywords"];
  columns: OfferStatic["audit"]["columns"];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">{columns.keyword}</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">{columns.position}</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">{columns.volume}</th>
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
  );
}
