// Statuses for a Clients record that isn't a client yet. "consultation" is
// set by the public Book a Consultation form; "lead" is entered manually.
// Both belong under Dashboard → Leads and must never count as past clients.
const LEAD_STATUSES = ["lead", "consultation"] as const;

function isLeadStatus(status: string | null | undefined) {
  return (LEAD_STATUSES as readonly (string | null | undefined)[]).includes(status);
}

export { LEAD_STATUSES, isLeadStatus };
