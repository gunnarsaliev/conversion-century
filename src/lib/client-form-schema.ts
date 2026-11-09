import { z } from "zod";

import { CLIENT_STATUSES } from "@/lib/client-status";

// ---------------------------------------------------------------------------
// Client form schema — shared by the dashboard drawer and its Server Actions
// ---------------------------------------------------------------------------

const linkSchema = z.object({ url: z.string().trim() });

const clientFormSchema = (t: (key: string) => string) =>
  z.object({
    companyName: z.string().trim().min(1, t("errors.companyName")),
    contactName: z.string().trim().optional(),
    email: z.string().trim().email(t("errors.email")).optional().or(z.literal("")),
    phone: z.string().trim().optional(),
    status: z.enum(CLIENT_STATUSES),
    notes: z.string(),
    // yyyy-mm-dd from <input type="date">, or empty.
    contractDate: z.string(),
    region: z.array(z.string()),
    services: z.array(z.number()),
    accountManagers: z.array(z.number()),
    publishers: z.array(z.number()),
    copywriters: z.array(z.number()),
    websiteLinks: z.array(linkSchema),
    reportUrls: z.array(linkSchema),
    linkBuildingDocs: z.string().trim(),
    blogDocs: z.string().trim(),
  });

type ClientFormValues = z.infer<ReturnType<typeof clientFormSchema>>;

const emptyClientFormValues: ClientFormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  status: "lead",
  notes: "",
  contractDate: "",
  region: [],
  services: [],
  accountManagers: [],
  publishers: [],
  copywriters: [],
  websiteLinks: [],
  reportUrls: [],
  linkBuildingDocs: "",
  blogDocs: "",
};

// Options for the drawer's relationship pickers.
type ClientFormOptions = {
  services: { id: number; name: string }[];
  users: { id: number; name: string }[];
};

export { clientFormSchema, emptyClientFormValues };
export type { ClientFormOptions, ClientFormValues };

// Payload date → yyyy-mm-dd for <input type="date">. Shifting by 12h first
// keeps the calendar day whether the stored value is local midnight
// (admin UI, any timezone within ±12h) or midnight UTC (this dashboard).
function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() + 12 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export { toDateInputValue };
