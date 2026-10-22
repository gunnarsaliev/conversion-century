"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { addToNewsletter } from "@/lib/brevo";

// ---------------------------------------------------------------------------
// Newsletter signup (Server Action, Brevo single opt-in)
// ---------------------------------------------------------------------------
//
// GDPR: consent must be an explicit, unticked-by-default checkbox. The
// address is added to the list straight away, and the consent timestamp is
// stored on the contact as proof.

const newsletterSchema = (t: Awaited<ReturnType<typeof getTranslations>>) =>
  z.object({
    email: z.string().trim().email(t("Newsletter.errors.email")),
    consent: z.literal("on", {
      error: t("Newsletter.errors.consent"),
    }),
    // Honeypot — real visitors never see or fill this field.
    company_website: z.string().max(0).optional().or(z.null()),
  });

type NewsletterResult = { success: true } | { success: false; error: string };

async function subscribeToNewsletter(
  formData: FormData,
): Promise<NewsletterResult> {
  const t = await getTranslations();
  const parsed = newsletterSchema(t).safeParse({
    email: formData.get("email"),
    consent: formData.get("consent"),
    company_website: formData.get("company_website"),
  });

  if (!parsed.success) {
    // Pretend a bot submission worked so it gets no signal to adapt to.
    if (parsed.error.issues.some((issue) => issue.path[0] === "company_website")) {
      return { success: true };
    }
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t("Forms.invalidInput"),
    };
  }

  try {
    await addToNewsletter({
      email: parsed.data.email,
      attributes: { NEWSLETTER_CONSENT_AT: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Failed to subscribe to newsletter", error);
    return {
      success: false,
      error: t("Forms.genericError"),
    };
  }

  // Same response whether or not the address was already subscribed, so
  // the form can't be used to probe who is on the list.
  return { success: true };
}

export { subscribeToNewsletter };
export type { NewsletterResult };
