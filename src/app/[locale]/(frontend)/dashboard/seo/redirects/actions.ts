"use server";

import { revalidatePath } from "next/cache";
import { getPayload, ValidationError } from "payload";
import config from "@payload-config";
import { z } from "zod";

import { getDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations, type DashboardTranslator } from "@/lib/dashboard-locale";
import { isAdminOrEditor } from "@/lib/roles";
import {
  REDIRECT_STATUS_CODES,
  isAbsoluteUrl,
  normalizeRedirectPath,
  normalizeRedirectTarget,
  redirectRuleError,
} from "@/lib/seo/redirects";

// ---------------------------------------------------------------------------
// Redirects (Server Actions, Payload local API)
// ---------------------------------------------------------------------------
//
// Create / update / delete rules in the `redirects` collection for
// Dashboard → SEO → Redirects. The same checks as the collection's own
// validation run first (lib/seo/redirects), so the form gets a readable
// error; src/proxy.ts picks changes up within its cache TTL. Admins and
// editors only; the session is checked here.

const redirectSchema = z.object({
  from: z.string().trim().max(500),
  to: z.string().trim().max(2000),
  statusCode: z.enum(REDIRECT_STATUS_CODES),
  enabled: z.boolean(),
});

export type RedirectInput = z.input<typeof redirectSchema>;

type RedirectResult = { success: true } | { success: false; error: string };

async function authorize(t: DashboardTranslator): Promise<RedirectResult | null> {
  const user = await getDashboardUser();
  if (!user) return { success: false, error: t("signedOut") };
  if (!isAdminOrEditor(user)) return { success: false, error: t("forbidden") };
  return null;
}

// Validates and normalizes; returns the data to save or an error message.
async function parseRedirect(
  input: RedirectInput,
  t: DashboardTranslator,
  excludeId?: number,
): Promise<{ data: RedirectInput } | { error: string }> {
  const parsed = redirectSchema.safeParse(input);
  if (!parsed.success) return { error: t("save") };

  const { from, to, statusCode, enabled } = parsed.data;
  const ruleError = redirectRuleError(from, to);
  if (ruleError) return { error: t(ruleError) };

  const target = normalizeRedirectTarget(to);
  if (isAbsoluteUrl(target)) {
    try {
      new URL(target);
    } catch {
      return { error: t("invalidUrl") };
    }
  } else if (/\s/.test(target)) {
    return { error: t("invalidUrl") };
  }

  const normalizedFrom = normalizeRedirectPath(from);
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.count({
    collection: "redirects",
    where: {
      and: [
        { from: { equals: normalizedFrom } },
        ...(excludeId ? [{ id: { not_equals: excludeId } }] : []),
      ],
    },
  });
  if (totalDocs > 0) return { error: t("duplicate") };

  return { data: { from: normalizedFrom, to: target, statusCode, enabled } };
}

function done(): RedirectResult {
  revalidatePath("/dashboard/seo/redirects");
  revalidatePath("/dashboard/seo");
  return { success: true };
}

async function createRedirect(input: RedirectInput): Promise<RedirectResult> {
  const t = await getDashboardTranslations("Seo.redirects.errors");
  const denied = await authorize(t);
  if (denied) return denied;

  const result = await parseRedirect(input, t);
  if ("error" in result) return { success: false, error: result.error };

  try {
    const payload = await getPayload({ config });
    await payload.create({ collection: "redirects", data: result.data });
  } catch (error) {
    return { success: false, error: t(error instanceof ValidationError ? "duplicate" : "save") };
  }
  return done();
}

async function updateRedirect(id: number, input: RedirectInput): Promise<RedirectResult> {
  const t = await getDashboardTranslations("Seo.redirects.errors");
  const denied = await authorize(t);
  if (denied) return denied;

  const result = await parseRedirect(input, t, id);
  if ("error" in result) return { success: false, error: result.error };

  try {
    const payload = await getPayload({ config });
    await payload.update({ collection: "redirects", id, data: result.data });
  } catch (error) {
    return { success: false, error: t(error instanceof ValidationError ? "duplicate" : "save") };
  }
  return done();
}

async function deleteRedirect(id: number): Promise<RedirectResult> {
  const t = await getDashboardTranslations("Seo.redirects.errors");
  const denied = await authorize(t);
  if (denied) return denied;

  try {
    const payload = await getPayload({ config });
    await payload.delete({ collection: "redirects", id });
  } catch {
    return { success: false, error: t("save") };
  }
  return done();
}

export { createRedirect, deleteRedirect, updateRedirect };
