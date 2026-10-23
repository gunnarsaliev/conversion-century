// Statuses for a Clients record that isn't a client yet. "consultation" is
// set by the public Book a Consultation form; "lead" is entered manually.
// Neither must ever count as a past client.
const LEAD_STATUSES = ["lead", "consultation"] as const;

function isLeadStatus(status: string | null | undefined) {
  return (LEAD_STATUSES as readonly (string | null | undefined)[]).includes(status);
}

// Dashboard section a client record lives under:
// /dashboard/consultations, /dashboard/leads or /dashboard/clients.
function clientSection(status: string | null | undefined) {
  if (status === "consultation") return "consultations";
  return isLeadStatus(status) ? "leads" : "clients";
}

export { LEAD_STATUSES, clientSection, isLeadStatus };
