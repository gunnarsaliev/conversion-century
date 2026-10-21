"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

import {
  addToNewsletter,
  escapeHtml,
  requireEnv,
  requireNumericEnv,
  sendEmail,
  upsertContact,
} from "@/lib/brevo";
import { clientHref, createNotification } from "@/lib/notifications";
import { SITE_URL } from "@/lib/seo/site";

// ---------------------------------------------------------------------------
// Book a consultation (Server Action, Payload local API + Brevo)
// ---------------------------------------------------------------------------
//
// The request is saved as a Clients record with status "consultation" — the
// local API bypasses Clients' admin-only `create`. That record is the source
// of truth: Brevo (contact list, team notification, visitor confirmation)
// runs afterwards, as does the dashboard bell notification; a failure there
// is only logged, never lost.
//
// GDPR: the privacy notice must be accepted to submit. Newsletter signup is
// a separate, unticked opt-in.
// The consultation list in Brevo holds sales leads only — never use it for
// marketing campaigns.

const consultationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  email: z.string().trim().email("Please enter a valid email"),
  website: z
    .string()
    .trim()
    .min(1, "Website URL is required")
    // Visitors often type "example.com" — don't reject that over a scheme.
    .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
    .pipe(z.url("Please enter a valid website URL")),
  message: z.string().trim().min(1, "Please tell us about your goals").max(5000),
  privacyConsent: z.literal("on", {
    error: "Please accept the Privacy Policy to continue",
  }),
  newsletterOptIn: z.literal("on").optional().or(z.null()),
  // Honeypot — real visitors never see or fill this field.
  company_website: z.string().max(0).optional().or(z.null()),
});

type ConsultationFormResult =
  | { success: true }
  | { success: false; error: string };

async function submitConsultationRequest(
  formData: FormData,
): Promise<ConsultationFormResult> {
  const parsed = consultationSchema.safeParse({
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
    email: formData.get("email"),
    website: formData.get("website"),
    message: formData.get("message"),
    privacyConsent: formData.get("privacyConsent"),
    newsletterOptIn: formData.get("newsletterOptIn"),
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

  const data = parsed.data;
  const submittedAt = new Date();

  let client: Awaited<ReturnType<typeof saveClient>>;

  try {
    client = await saveClient(data, submittedAt);
  } catch (error) {
    console.error("Failed to save consultation request", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }

  // Each step is its own async function so a missing env var rejects that
  // step instead of throwing past allSettled.
  const results = await Promise.allSettled([
    (async () =>
      createNotification(await getPayload({ config }), {
        type: "consultation",
        title: `New consultation request: ${data.companyName}`,
        message: `${data.fullName} · ${data.email}`,
        href: clientHref(client),
      }))(),
    (async () =>
      upsertContact({
        email: data.email,
        listIds: [requireNumericEnv("BREVO_CONSULTATION_LIST_ID")],
        // The free-text message stays in Payload only (data minimisation).
        attributes: {
          FULLNAME: data.fullName,
          COMPANY: data.companyName,
          WEBSITE: data.website,
        },
      }))(),
    (async () =>
      sendEmail({
        to: [{ email: requireEnv("BREVO_TEAM_EMAIL") }],
        replyTo: { email: data.email, name: data.fullName },
        subject: `New consultation request: ${data.companyName}`,
        htmlContent: teamNotificationHtml(data, client.id),
      }))(),
    (async () =>
      sendEmail({
        to: [{ email: data.email, name: data.fullName }],
        replyTo: { email: requireEnv("BREVO_TEAM_EMAIL") },
        subject: "We received your consultation request",
        htmlContent: visitorConfirmationHtml(data.fullName),
      }))(),
    (async () => {
      if (!data.newsletterOptIn) return;
      await addToNewsletter({
        email: data.email,
        attributes: {
          FULLNAME: data.fullName,
          NEWSLETTER_CONSENT_AT: submittedAt.toISOString(),
        },
      });
    })(),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Brevo step failed for consultation request", result.reason);
    }
  }

  return { success: true };
}

// Creates a "consultation" client, or appends the request to an existing
// client with the same email — leaving its status alone so a returning
// active client is never downgraded.
async function saveClient(
  data: z.infer<typeof consultationSchema>,
  submittedAt: Date,
) {
  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "clients",
    where: { email: { equals: data.email } },
    limit: 1,
    depth: 0,
  });

  const client = existing.docs[0];

  if (client) {
    const notes = [client.notes, `--- ${submittedAt.toISOString().slice(0, 10)} ---\n${data.message}`]
      .filter(Boolean)
      .join("\n\n");
    await payload.update({
      collection: "clients",
      id: client.id,
      data: { notes },
    });
    return { id: client.id, status: client.status };
  }

  const created = await payload.create({
    collection: "clients",
    data: {
      companyName: data.companyName,
      contactName: data.fullName,
      email: data.email,
      websiteLinks: [{ url: data.website }],
      status: "consultation",
      notes: data.message,
    },
  });
  return { id: created.id, status: created.status };
}

function teamNotificationHtml(
  data: z.infer<typeof consultationSchema>,
  clientId: string | number,
) {
  const rows: [string, string][] = [
    ["Full name", data.fullName],
    ["Company", data.companyName],
    ["Email", data.email],
    ["Website", data.website],
    ["Newsletter opt-in", data.newsletterOptIn ? "Yes (subscribed)" : "No"],
  ];

  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0f172a">
<h2>New consultation request</h2>
<table cellpadding="6" style="border-collapse:collapse">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="font-weight:bold;vertical-align:top">${label}</td><td>${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table>
<h3>Message</h3>
<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
<p><a href="${SITE_URL}/admin/collections/clients/${clientId}">Open in admin</a></p>
</body></html>`;
}

function visitorConfirmationHtml(fullName: string) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0f172a">
<p>Hi ${escapeHtml(fullName)},</p>
<p>Thanks for requesting a free SEO consultation with Conversion Century. We've received your details and one of our SEO strategists will get back to you soon.</p>
<p>If you have anything to add in the meantime, just reply to this email.</p>
<p>Best regards,<br>The Conversion Century team</p>
<hr style="border:none;border-top:1px solid #e2e8f0">
<p style="font-size:12px;color:#64748b">You're receiving this one-off email because you submitted the consultation form on our website. We use your details only to respond to your request — see our <a href="${SITE_URL}/legal/privacy-policy">Privacy Policy</a>.</p>
</body></html>`;
}

export { submitConsultationRequest };
export type { ConsultationFormResult };
