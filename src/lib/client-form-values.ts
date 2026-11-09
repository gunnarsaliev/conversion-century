import type { Client } from "../../payload-types";
import { toDateInputValue, type ClientFormValues } from "@/lib/client-form-schema";
import { isClientStatus } from "@/lib/client-status";
import { primaryContactName } from "@/lib/primary-contact";

const toId = (entry: number | { id: number }) =>
  typeof entry === "object" ? entry.id : entry;

const toLinks = (links: { url?: string | null }[] | null | undefined) =>
  (links ?? []).map((link) => ({ url: link.url ?? "" }));

// A client record's current values for the edit drawer. The drawer saves
// every field it shows, so it must start from the record's real values —
// build it from the full document, never from a partial list projection.
function toClientFormValues(client: Client): ClientFormValues {
  return {
    companyName: client.companyName,
    contactName: primaryContactName(client) ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    status: isClientStatus(client.status) ? client.status : "lead",
    notes: client.notes ?? "",
    contractDate: toDateInputValue(client.contractDate),
    region: [...(client.region ?? [])],
    services: (client.services ?? []).map(toId),
    accountManagers: (client["Account Manager"] ?? []).map(toId),
    publishers: (client.Publisher ?? []).map(toId),
    copywriters: (client.Copywriter ?? []).map(toId),
    websiteLinks: toLinks(client.websiteLinks),
    reportUrls: toLinks(client.reportUrls),
    linkBuildingDocs: client["Link Building Docs"] ?? "",
    blogDocs: client["Blog Docs"] ?? "",
  };
}

export { toClientFormValues };
