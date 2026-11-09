"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import type { Client } from "../../../../../../payload-types";
import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { clientFormSchema, type ClientFormValues } from "@/lib/client-form-schema";
import { CLIENT_STATUSES, type ClientStatus } from "@/lib/client-status";
import { upsertPrimaryContact } from "@/lib/primary-contact";

// ---------------------------------------------------------------------------
// Client create / update (Server Actions, Payload local API)
// ---------------------------------------------------------------------------

type ClientFormInput = ClientFormValues;

type ClientFormResult =
  | { success: true; id: string | number }
  | { success: false; error: string };

const toLinks = (links: { url: string }[]) =>
  links.map((link) => ({ url: link.url.trim() })).filter((link) => link.url);

function toClientData(input: ClientFormInput) {
  return {
    companyName: input.companyName,
    email: input.email || null,
    phone: input.phone || null,
    status: input.status,
    notes: input.notes.trim() || null,
    contractDate: input.contractDate
      ? new Date(`${input.contractDate}T00:00:00.000Z`).toISOString()
      : null,
    region: input.region as NonNullable<Client["region"]>,
    services: input.services,
    "Account Manager": input.accountManagers,
    Publisher: input.publishers,
    Copywriter: input.copywriters,
    websiteLinks: toLinks(input.websiteLinks),
    reportUrls: toLinks(input.reportUrls),
    "Link Building Docs": input.linkBuildingDocs || null,
    "Blog Docs": input.blogDocs || null,
  };
}

// Every dashboard path that shows a client record, list and detail.
function revalidateClientPaths(id?: string | number) {
  for (const section of ["clients", "leads", "consultations"]) {
    revalidatePath(`/dashboard/${section}`);
    if (id !== undefined) revalidatePath(`/dashboard/${section}/${id}`);
  }
}

async function createClient(
  input: ClientFormInput,
): Promise<ClientFormResult> {
  const t = await getDashboardTranslations("Clients");

  // Any signed-in team member (proxy.ts only checks that a cookie exists).
  if (!(await getDashboardUser())) {
    return { success: false, error: t("errors.signedOut") };
  }
  const parsed = clientFormSchema(t).safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t("errors.invalid"),
    };
  }

  try {
    const payload = await getPayload({ config });

    const client = await payload.create({
      collection: "clients",
      data: toClientData(parsed.data),
    });

    // The form's "Contact name" edits the client's primary contact.
    if (parsed.data.contactName) {
      await upsertPrimaryContact(payload, client, { name: parsed.data.contactName });
    }

    revalidateClientPaths();

    return { success: true, id: client.id };
  } catch {
    return {
      success: false,
      error: t("errors.create"),
    };
  }
}

async function updateClient(
  id: string | number,
  input: ClientFormInput,
): Promise<ClientFormResult> {
  const t = await getDashboardTranslations("Clients");

  // Any signed-in team member (proxy.ts only checks that a cookie exists).
  if (!(await getDashboardUser())) {
    return { success: false, error: t("errors.signedOut") };
  }
  const parsed = clientFormSchema(t).safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t("errors.invalid"),
    };
  }

  try {
    const payload = await getPayload({ config });

    const client = await payload.update({
      collection: "clients",
      id,
      data: toClientData(parsed.data),
    });

    // The form's "Contact name" edits the client's primary contact.
    if (parsed.data.contactName) {
      await upsertPrimaryContact(payload, client, { name: parsed.data.contactName });
    }

    revalidateClientPaths(id);

    return { success: true, id: client.id };
  } catch {
    return {
      success: false,
      error: t("errors.update"),
    };
  }
}

type DeleteClientResult =
  | { success: true }
  | { success: false; error: string };

async function deleteClient(
  id: string | number,
): Promise<DeleteClientResult> {
  const t = await getDashboardTranslations("Clients");

  // Any signed-in team member (proxy.ts only checks that a cookie exists).
  if (!(await getDashboardUser())) {
    return { success: false, error: t("errors.signedOut") };
  }

  try {
    const payload = await getPayload({ config });

    await payload.delete({
      collection: "clients",
      id,
    });

    revalidateClientPaths();

    return { success: true };
  } catch {
    return {
      success: false,
      error: t("errors.delete"),
    };
  }
}

// ---------------------------------------------------------------------------
// Status-only update (the status dropdown on badges)
// ---------------------------------------------------------------------------

type SetClientStatusResult =
  | { success: true; status: ClientStatus }
  | { success: false; error: string };

async function setClientStatus(
  id: string | number,
  status: ClientStatus,
): Promise<SetClientStatusResult> {
  const t = await getDashboardTranslations("Clients");

  // Any signed-in team member (proxy.ts only checks that a cookie exists).
  if (!(await getDashboardUser())) {
    return { success: false, error: t("errors.signedOut") };
  }

  const parsed = z.enum(CLIENT_STATUSES).safeParse(status);
  if (!parsed.success) {
    return { success: false, error: t("errors.invalid") };
  }

  try {
    const payload = await getPayload({ config });

    await payload.update({
      collection: "clients",
      id,
      data: { status: parsed.data },
    });

    revalidateClientPaths(id);

    return { success: true, status: parsed.data };
  } catch {
    return { success: false, error: t("errors.status") };
  }
}

// ---------------------------------------------------------------------------
// Checklist progress status toggle
// ---------------------------------------------------------------------------

type UpdateChecklistProgressResult =
  | { success: true; status: "not-started" | "done" }
  | { success: false; error: string };

async function setChecklistProgressDone(
  progressId: string | number,
  clientId: string | number,
  done: boolean,
): Promise<UpdateChecklistProgressResult> {
  const status = done ? "done" : "not-started";

  const t = await getDashboardTranslations("Clients");

  // Any signed-in team member (proxy.ts only checks that a cookie exists).
  if (!(await getDashboardUser())) {
    return { success: false, error: t("errors.signedOut") };
  }

  try {
    const payload = await getPayload({ config });

    await payload.update({
      collection: "client-checklist-progress",
      id: progressId,
      data: {
        status,
        completedAt: done ? new Date().toISOString() : null,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}`);

    return { success: true, status };
  } catch {
    return {
      success: false,
      error: t("errors.checklist"),
    };
  }
}

export {
  createClient,
  updateClient,
  deleteClient,
  setClientStatus,
  setChecklistProgressDone,
};
