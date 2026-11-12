import { timingSafeEqual } from "node:crypto";
import { getPayload } from "payload";
import config from "@payload-config";

import { addValidity } from "@/lib/offer-form";
import { saveOfferAs } from "@/lib/offer-save";

// ---------------------------------------------------------------------------
// POST /api/agent/offers — the dashboard chatbot creates an offer
// ---------------------------------------------------------------------------
//
// Called by the eve agent's `create_offer` tool (agent/tools/create_offer.ts)
// after the user approved the offer in the chat. The agent has no session
// cookie, so it authenticates with a shared secret (env AGENT_API_SECRET) and
// names the signed-in user it acts for; the offer is then saved as that user,
// under the same rules as the offer form (admins only, see offer-save.ts).

const secretMatches = (given: string | null) => {
  const secret = process.env.AGENT_API_SECRET;
  if (!secret || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
};

const today = () => new Date().toISOString().slice(0, 10);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-agent-secret"))) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const userId = isRecord(body) ? Number(body.userId) : NaN;
  const offer = isRecord(body) && isRecord(body.offer) ? body.offer : null;
  if (!Number.isInteger(userId) || userId <= 0 || !offer) {
    return Response.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const user = await payload
    .findByID({ collection: "users", id: userId, depth: 0 })
    .catch(() => null);
  if (!user) {
    return Response.json({ success: false, error: "Unknown user" }, { status: 403 });
  }

  // The defaults the offer form starts with (emptyOfferFormValues).
  const date = today();
  const metrics = isRecord(offer.metrics) ? offer.metrics : {};
  const result = await saveOfferAs(user, {
    ...offer,
    date,
    validUntil: offer.validUntil ?? addValidity(date),
    services: offer.services ?? [],
    keywords: offer.keywords ?? [],
    metrics: { ...metrics, source: "manual", date },
  });

  return Response.json(result, { status: result.success ? 201 : 422 });
}
