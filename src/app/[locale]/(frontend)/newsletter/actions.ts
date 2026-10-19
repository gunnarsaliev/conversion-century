"use server";

import { z } from "zod";

import { addToNewsletter } from "@/lib/brevo";

// ---------------------------------------------------------------------------
// Newsletter signup (Server Action, Brevo single opt-in)
// ---------------------------------------------------------------------------
//
// GDPR: consent must be an explicit, unticked-by-default checkbox. The
// address is added to the list straight away, and the consent timestamp is
// stored on the contact as proof.

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  consent: z.literal("on", {
    error: "Please confirm you want to receive our emails",
  }),
  // Honeypot — real visitors never see or fill this field.
  company_website: z.string().max(0).optional().or(z.null()),
});

type NewsletterResult = { success: true } | { success: false; error: string };

async function subscribeToNewsletter(
  formData: FormData,
): Promise<NewsletterResult> {
  const parsed = newsletterSchema.safeParse({
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
      error: parsed.error.issues[0]?.message ?? "Invalid input",
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
      error: "Something went wrong. Please try again.",
    };
  }

  // Same response whether or not the address was already subscribed, so
  // the form can't be used to probe who is on the list.
  return { success: true };
}

export { subscribeToNewsletter };
export type { NewsletterResult };
