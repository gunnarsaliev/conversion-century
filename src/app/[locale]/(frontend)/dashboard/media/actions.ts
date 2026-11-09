"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { MEDIA_UPLOAD_MAX_BYTES } from "@/lib/media-upload";

// ---------------------------------------------------------------------------
// Media upload (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// One image per call: Server Action bodies are capped at 4.5 MB (see
// next.config.mjs, Vercel's request limit), so the drawer sends files one by
// one instead of the whole batch in a single request. Files go to R2 through
// the Media collection's storage adapter.

type UploadMediaResult =
  | { success: true; id: number }
  | { success: false; error: string };

async function uploadMedia(formData: FormData): Promise<UploadMediaResult> {
  const t = await getDashboardTranslations("Media.upload");

  // Any signed-in team member (proxy.ts only checks that a cookie exists).
  if (!(await getDashboardUser())) {
    return { success: false, error: t("errors.signedOut") };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: t("errors.noFile") };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, error: t("errors.type", { name: file.name }) };
  }
  if (file.size > MEDIA_UPLOAD_MAX_BYTES) {
    return { success: false, error: t("errors.size", { name: file.name }) };
  }

  const alt = String(formData.get("alt") ?? "").trim();

  try {
    const payload = await getPayload({ config });
    const media = await payload.create({
      collection: "media",
      // Alt text is optional on Media.
      data: alt ? { alt } : {},
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    });

    revalidatePath("/dashboard/media");

    return { success: true, id: media.id };
  } catch {
    return { success: false, error: t("errors.upload", { name: file.name }) };
  }
}

export { uploadMedia };
