"use server";

import { headers as getHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Profile update (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Updates the currently logged-in user's own profile fields — first/last
// name, job title, and avatar (upload). Auth is resolved from the request
// headers, not a client-supplied id, so a user can only ever update
// themselves through this action.

const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  jobTitle: z.string().trim().optional(),
});

type ProfileFormResult =
  | { success: true }
  | { success: false; error: string };

async function updateProfile(formData: FormData): Promise<ProfileFormResult> {
  const parsed = profileFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    jobTitle: formData.get("jobTitle") ?? undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  try {
    const headers = await getHeaders();
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers });

    if (!user) {
      return { success: false, error: "You must be signed in." };
    }

    const { firstName, lastName, jobTitle } = parsed.data;

    let profileImageId: number | undefined;

    const avatarEntry = formData.get("avatar");
    if (avatarEntry instanceof File && avatarEntry.size > 0) {
      const arrayBuffer = await avatarEntry.arrayBuffer();
      const media = await payload.create({
        collection: "media",
        data: {},
        file: {
          data: Buffer.from(arrayBuffer),
          mimetype: avatarEntry.type,
          name: avatarEntry.name,
          size: avatarEntry.size,
        },
      });
      profileImageId = media.id;
    }

    const removeAvatar = formData.get("removeAvatar") === "true";

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        firstName,
        lastName,
        jobTitle: jobTitle || undefined,
        ...(profileImageId ? { profileImage: profileImageId } : {}),
        ...(removeAvatar && !profileImageId ? { profileImage: null } : {}),
      },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong while updating your profile.",
    };
  }
}

export { updateProfile };
