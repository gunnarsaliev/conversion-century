import { Mail, Phone } from "lucide-react";

import type { OfferStatic } from "@/types/offer";
import { OfferSection } from "./offer-ui";

export function OfferContact({
  trackRecord,
}: {
  trackRecord: OfferStatic["trackRecord"];
}) {
  const { stats, contact } = trackRecord;

  return (
    <OfferSection id="contact" heading={trackRecord.header}>
      <dl className="mb-12 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-6">
            <dd className="text-4xl font-semibold tabular-nums">{stat.value}</dd>
            <dt className="mt-1 text-sm text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{contact.name}</p>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:underline">
            <Phone aria-hidden="true" className="size-4" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:underline">
            <Mail aria-hidden="true" className="size-4" />
            {contact.email}
          </a>
        </div>
      </div>
    </OfferSection>
  );
}
