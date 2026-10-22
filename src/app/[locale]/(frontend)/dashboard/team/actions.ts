"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations, type DashboardTranslator } from "@/lib/dashboard-locale";
import { isAdmin } from "@/lib/roles";

// ---------------------------------------------------------------------------
// Team member update / delete (Server Actions, Payload local API)
// ---------------------------------------------------------------------------
//
// No create action here — creating a user means setting a password, which
// this dashboard doesn't collect; new team members are added via /admin.

const teamMemberFormSchema = (t: DashboardTranslator) =>
  z.object({
    firstName: z.string().trim().min(1, t("errors.firstName")),
    lastName: z.string().trim().min(1, t("errors.lastName")),
    jobTitle: z.string().trim().optional(),
    role: z.enum(["user", "admin", "editor"]),
  });

type TeamMemberFormInput = z.infer<ReturnType<typeof teamMemberFormSchema>>;

type TeamMemberFormResult =
  | { success: true; id: string | number }
  | { success: false; error: string };

async function updateTeamMember(
  id: string | number,
  input: TeamMemberFormInput,
): Promise<TeamMemberFormResult> {
  const t = await getDashboardTranslations("Team");

  // Role changes go through here, so only admins (as on Users' own access).
  if (!isAdmin(await getDashboardUser())) {
    return { success: false, error: t("errors.adminOnly") };
  }

  const parsed = teamMemberFormSchema(t).safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t("errors.invalid"),
    };
  }

  const { firstName, lastName, jobTitle, role } = parsed.data;

  try {
    const payload = await getPayload({ config });

    const user = await payload.update({
      collection: "users",
      id,
      data: {
        firstName,
        lastName,
        jobTitle: jobTitle || undefined,
        role,
      },
    });

    revalidatePath("/dashboard/team");
    revalidatePath(`/dashboard/team/${id}`);

    return { success: true, id: user.id };
  } catch {
    return {
      success: false,
      error: t("errors.update"),
    };
  }
}

type DeleteTeamMemberResult =
  | { success: true }
  | { success: false; error: string };

async function deleteTeamMember(
  id: string | number,
): Promise<DeleteTeamMemberResult> {
  const t = await getDashboardTranslations("Team");

  if (!isAdmin(await getDashboardUser())) {
    return { success: false, error: t("errors.adminOnly") };
  }

  try {
    const payload = await getPayload({ config });

    await payload.delete({
      collection: "users",
      id,
    });

    revalidatePath("/dashboard/team");

    return { success: true };
  } catch {
    return {
      success: false,
      error: t("errors.delete"),
    };
  }
}

export { updateTeamMember, deleteTeamMember };
