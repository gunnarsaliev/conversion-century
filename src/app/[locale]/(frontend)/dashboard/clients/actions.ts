"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations, type DashboardTranslator } from "@/lib/dashboard-locale";
import { upsertPrimaryContact } from "@/lib/primary-contact";

// ---------------------------------------------------------------------------
// Client create / update (Server Actions, Payload local API)
// ---------------------------------------------------------------------------

const clientFormSchema = (t: DashboardTranslator) =>
  z.object({
    companyName: z.string().trim().min(1, t("errors.companyName")),
    contactName: z.string().trim().optional(),
    email: z.string().trim().email(t("errors.email")).optional().or(z.literal("")),
    phone: z.string().trim().optional(),
    status: z.enum(["lead", "consultation", "active", "inactive"]),
  });

type ClientFormInput = z.infer<ReturnType<typeof clientFormSchema>>;

type ClientFormResult =
  | { success: true; id: string | number }
  | { success: false; error: string };

function toClientData(input: ClientFormInput) {
  const { companyName, email, phone, status } = input;
  return {
    companyName,
    email: email || undefined,
    phone: phone || undefined,
    status,
  };
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

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/consultations");

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

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/consultations");
    revalidatePath(`/dashboard/clients/${id}`);
    revalidatePath(`/dashboard/leads/${id}`);
    revalidatePath(`/dashboard/consultations/${id}`);

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

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/consultations");

    return { success: true };
  } catch {
    return {
      success: false,
      error: t("errors.delete"),
    };
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
  setChecklistProgressDone,
};
