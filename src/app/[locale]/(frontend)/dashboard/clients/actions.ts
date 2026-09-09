"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Client create / update (Server Actions, Payload local API)
// ---------------------------------------------------------------------------

const clientFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  contactName: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  status: z.enum(["lead", "active", "inactive"]),
});

type ClientFormInput = z.infer<typeof clientFormSchema>;

type ClientFormResult =
  | { success: true; id: string | number }
  | { success: false; error: string };

function toClientData(input: ClientFormInput) {
  const { companyName, contactName, email, phone, status } = input;
  return {
    companyName,
    contactName: contactName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    status,
  };
}

async function createClient(
  input: ClientFormInput,
): Promise<ClientFormResult> {
  const parsed = clientFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const payload = await getPayload({ config });

    const client = await payload.create({
      collection: "clients",
      data: toClientData(parsed.data),
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/leads");

    return { success: true, id: client.id };
  } catch {
    return {
      success: false,
      error: "Something went wrong while creating the client.",
    };
  }
}

async function updateClient(
  id: string | number,
  input: ClientFormInput,
): Promise<ClientFormResult> {
  const parsed = clientFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const payload = await getPayload({ config });

    const client = await payload.update({
      collection: "clients",
      id,
      data: toClientData(parsed.data),
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/clients/${id}`);
    revalidatePath(`/dashboard/leads/${id}`);

    return { success: true, id: client.id };
  } catch {
    return {
      success: false,
      error: "Something went wrong while updating the client.",
    };
  }
}

type DeleteClientResult =
  | { success: true }
  | { success: false; error: string };

async function deleteClient(
  id: string | number,
): Promise<DeleteClientResult> {
  try {
    const payload = await getPayload({ config });

    await payload.delete({
      collection: "clients",
      id,
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/leads");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong while deleting the client.",
    };
  }
}

// ---------------------------------------------------------------------------
// Checklist progress status toggle
// ---------------------------------------------------------------------------

type UpdateChecklistProgressResult =
  | { success: true; status: "pending" | "done" }
  | { success: false; error: string };

async function setChecklistProgressDone(
  progressId: string | number,
  clientId: string | number,
  done: boolean,
): Promise<UpdateChecklistProgressResult> {
  const status = done ? "done" : "pending";

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
      error: "Something went wrong while updating the checklist item.",
    };
  }
}

export {
  createClient,
  updateClient,
  deleteClient,
  setChecklistProgressDone,
};
