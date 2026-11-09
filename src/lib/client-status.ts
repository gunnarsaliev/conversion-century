// Every status a Clients record can have, in pipeline order.
const CLIENT_STATUSES = ["lead", "consultation", "active", "inactive"] as const;

type ClientStatus = (typeof CLIENT_STATUSES)[number];

// Statuses for a Clients record that isn't a client yet. "consultation" is
// set by the public Book a Consultation form; "lead" is entered manually.
// Neither must ever count as a past client.
const LEAD_STATUSES = ["lead", "consultation"] as const;

function isLeadStatus(status: string | null | undefined) {
  return (LEAD_STATUSES as readonly (string | null | undefined)[]).includes(status);
}

function isClientStatus(status: string | null | undefined): status is ClientStatus {
  return (CLIENT_STATUSES as readonly (string | null | undefined)[]).includes(status);
}

// Dashboard section a client record lives under:
// /dashboard/consultations, /dashboard/leads or /dashboard/clients.
function clientSection(status: string | null | undefined) {
  if (status === "consultation") return "consultations";
  return isLeadStatus(status) ? "leads" : "clients";
}

// Badge colours per status, shared by every dashboard view of a client.
const statusBadgeClassName: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  lead: "bg-amber-100 text-amber-800",
  consultation: "bg-sky-100 text-sky-800",
  inactive: "bg-muted text-muted-foreground",
};

function clientStatusBadgeClassName(status: string | null | undefined) {
  return statusBadgeClassName[status ?? ""] ?? statusBadgeClassName.inactive;
}

export {
  CLIENT_STATUSES,
  LEAD_STATUSES,
  clientSection,
  clientStatusBadgeClassName,
  isClientStatus,
  isLeadStatus,
};
export type { ClientStatus };
