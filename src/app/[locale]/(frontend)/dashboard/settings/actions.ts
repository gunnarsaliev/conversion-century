"use server";

import { headers as getHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { DATE_INPUT_PATTERN, fromDateInputValue } from "@/lib/celebrations";
import { getDashboardTranslations, type DashboardTranslator } from "@/lib/dashboard-locale";
import { ABOUT_MAX_LENGTH } from "@/lib/profile-settings";

// ---------------------------------------------------------------------------
// Profile update (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// Updates the currently logged-in user's own profile fields — first/last
// name, job title, about, birthday, work birthday, and avatar (upload).
// Dates come from <input type="date"> ("YYYY-MM-DD"); an empty value clears
// the date. Auth is resolved from the request
// headers, not a client-supplied id, so a user can only ever update
// themselves through this action.

const profileFormSchema = (t: DashboardTranslator) => {
  const optionalDate = z
    .string()
    .refine((value) => value === "" || DATE_INPUT_PATTERN.test(value), t("errors.date"))
    .optional();

  return z.object({
    firstName: z.string().trim().min(1, t("errors.firstName")),
    lastName: z.string().trim().min(1, t("errors.lastName")),
    jobTitle: z.string().trim().optional(),
    about: z
      .string()
      .trim()
      .max(ABOUT_MAX_LENGTH, t("errors.about", { max: ABOUT_MAX_LENGTH }))
      .optional(),
    birthday: optionalDate,
    workBirthday: optionalDate,
  });
};

type ProfileFormResult =
  | { success: true }
  | { success: false; error: string };

async function updateProfile(formData: FormData): Promise<ProfileFormResult> {
  const t = await getDashboardTranslations("Settings");
  const parsed = profileFormSchema(t).safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    jobTitle: formData.get("jobTitle") ?? undefined,
    about: formData.get("about") ?? undefined,
    birthday: formData.get("birthday") ?? undefined,
    workBirthday: formData.get("workBirthday") ?? undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t("errors.invalid"),
    };
  }

  try {
    const headers = await getHeaders();
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers });

    if (!user) {
      return { success: false, error: t("errors.signedOut") };
    }

    const { firstName, lastName, jobTitle, about, birthday, workBirthday } = parsed.data;

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
        about: about || null,
        ...(birthday !== undefined ? { birthday: fromDateInputValue(birthday) } : {}),
        ...(workBirthday !== undefined ? { workBirthday: fromDateInputValue(workBirthday) } : {}),
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
      error: t("errors.save"),
    };
  }
}

export { updateProfile };
