"use server";

import { unzipSync, strFromU8 } from "fflate";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdmin } from "@/lib/roles";
import { translatableCollections, type TranslationFile } from "@/lib/translations/core";
import {
  importTranslationFile,
  isTranslationFile,
  type ImportReport,
} from "@/lib/translations/import";

// ---------------------------------------------------------------------------
// Translation import (Server Action, Payload local API)
// ---------------------------------------------------------------------------
//
// The Translations page sends the translator's files (`<slug>.json`, or a
// ZIP of them) twice: first with `apply` off to preview what would change,
// then with it on to save. See lib/translations/import for the rules (only
// empty Bulgarian fields are filled). Admins only.

type ImportResult =
  | { success: true; reports: ImportReport[] }
  | { success: false; error: string };

async function readUploadedFiles(formData: FormData): Promise<unknown[]> {
  const parsed: unknown[] = [];

  for (const entry of formData.getAll("files")) {
    if (!(entry instanceof File) || entry.size === 0) continue;

    if (entry.name.toLowerCase().endsWith(".zip")) {
      const archive = unzipSync(new Uint8Array(await entry.arrayBuffer()));
      for (const [name, content] of Object.entries(archive)) {
        if (name.toLowerCase().endsWith(".json") && !name.startsWith("__MACOSX/")) {
          parsed.push(JSON.parse(strFromU8(content)));
        }
      }
    } else {
      parsed.push(JSON.parse(await entry.text()));
    }
  }

  return parsed;
}

async function runTranslationImport(formData: FormData): Promise<ImportResult> {
  const t = await getDashboardTranslations("Translations.errors");

  if (!isAdmin(await getDashboardUser())) {
    return { success: false, error: t("adminOnly") };
  }

  let files: unknown[];
  try {
    files = await readUploadedFiles(formData);
  } catch {
    return { success: false, error: t("invalidJson") };
  }

  if (files.length === 0) return { success: false, error: t("noFiles") };

  const payload = await getPayload({ config });
  const translatable = translatableCollections(payload);
  const valid: TranslationFile[] = [];
  for (const file of files) {
    if (!isTranslationFile(file) || !translatable.includes(file.collection)) {
      return { success: false, error: t("notTranslationFile") };
    }
    valid.push(file);
  }

  const apply = formData.get("apply") === "true";

  try {
    const reports: ImportReport[] = [];
    for (const file of valid) {
      reports.push(await importTranslationFile(payload, file, { apply }));
    }

    if (apply) revalidatePath("/", "layout");

    return { success: true, reports };
  } catch (error) {
    console.error("Failed to import translations", error);
    return { success: false, error: t("importFailed") };
  }
}

export { runTranslationImport };
export type { ImportResult };
