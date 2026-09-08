"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Team member update / delete (Server Actions, Payload local API)
// ---------------------------------------------------------------------------
//
// No create action here — creating a user means setting a password, which
// this dashboard doesn't collect; new team members are added via /admin.

const teamMemberFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  jobTitle: z.string().trim().optional(),
  role: z.enum(["user", "admin"]),
});

type TeamMemberFormInput = z.infer<typeof teamMemberFormSchema>;

type TeamMemberFormResult =
  | { success: true; id: string | number }
  | { success: false; error: string };

async function updateTeamMember(
  id: string | number,
  input: TeamMemberFormInput,
): Promise<TeamMemberFormResult> {
  const parsed = teamMemberFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
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
      error: "Something went wrong while updating the team member.",
    };
  }
}

type DeleteTeamMemberResult =
  | { success: true }
  | { success: false; error: string };

async function deleteTeamMember(
  id: string | number,
): Promise<DeleteTeamMemberResult> {
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
      error: "Something went wrong while deleting the team member.",
    };
  }
}

export { updateTeamMember, deleteTeamMember };
