// ---------------------------------------------------------------------------
// Brevo REST API v3 (server-only)
// ---------------------------------------------------------------------------
//
// Plain fetch instead of the @getbrevo/brevo SDK — we only need three
// endpoints. Only import this from Server Actions / server code: it reads
// BREVO_API_KEY, which must never reach the browser.

const BREVO_API_URL = "https://api.brevo.com/v3";

type BrevoAttributes = Record<string, string | number | boolean>;

interface EmailRecipient {
  email: string;
  name?: string;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Brevo not configured: ${name} is missing`);
  return value;
}

function requireNumericEnv(name: string) {
  const value = Number(requireEnv(name));
  if (!Number.isInteger(value)) {
    throw new Error(`Brevo not configured: ${name} must be a numeric ID`);
  }
  return value;
}

// Brevo's dashboard can hand out "MCP" keys: base64 JSON wrapping the real
// key ({"api_key":"xkeysib-..."}). The REST API only accepts the inner key.
function apiKey() {
  const key = requireEnv("BREVO_API_KEY").trim();
  if (key.startsWith("xkeysib-")) return key;
  try {
    const decoded = JSON.parse(Buffer.from(key, "base64").toString("utf8"));
    if (typeof decoded?.api_key === "string") return decoded.api_key as string;
  } catch {
    // Not a wrapped key — send it as-is and let Brevo report the problem.
  }
  return key;
}

async function brevoRequest(path: string, body: unknown) {
  const response = await fetch(`${BREVO_API_URL}${path}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey(),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Brevo ${path} failed (${response.status}): ${text}`);
  }
}

// Creates the contact, or updates it if the email already exists.
async function upsertContact({
  email,
  attributes,
  listIds,
}: {
  email: string;
  attributes?: BrevoAttributes;
  listIds: number[];
}) {
  await brevoRequest("/contacts", {
    email,
    attributes,
    listIds,
    updateEnabled: true,
  });
}

// Single opt-in: the contact goes straight into the newsletter list. Consent
// is collected by the form's required checkbox, and the timestamp is stored
// on the contact as proof.
async function addToNewsletter({
  email,
  attributes,
}: {
  email: string;
  attributes?: BrevoAttributes;
}) {
  await upsertContact({
    email,
    attributes,
    listIds: [requireNumericEnv("BREVO_NEWSLETTER_LIST_ID")],
  });
}

async function sendEmail({
  to,
  replyTo,
  subject,
  htmlContent,
}: {
  to: EmailRecipient[];
  replyTo?: EmailRecipient;
  subject: string;
  htmlContent: string;
}) {
  await brevoRequest("/smtp/email", {
    sender: {
      email: requireEnv("BREVO_SENDER_EMAIL"),
      name: process.env.BREVO_SENDER_NAME || "Conversion Century",
    },
    to,
    replyTo,
    subject,
    htmlContent,
  });
}

// Everything a visitor typed must go through this before landing in email HTML.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export {
  addToNewsletter,
  escapeHtml,
  requireEnv,
  requireNumericEnv,
  sendEmail,
  upsertContact,
};
