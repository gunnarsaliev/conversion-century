import { defineTool } from "eve/tools";
import { z } from "zod";

import { appUrl } from "../lib/app-url";

// Creates a commercial offer (a draft in the `offers` collection), like the
// form at /dashboard/offers/new. The one thing the agent can write.
//
// Every call waits for the user's approval in the chat first. The offer is
// then saved by the app (POST /api/agent/offers) as the signed-in user, so
// the collection's rules apply: only admins can create offers. The dashboard
// shows the result as a card with a PDF download button (OfferCreatedCard in
// src/components/dashboard/ai-search-cards.tsx).

const count = z.number().int().min(0);

const inputSchema = z.object({
  client: z.number().int().positive().describe("Id of the `clients` record the offer is for."),
  clientName: z.string().describe("That client's company name, shown in the approval prompt."),
  services: z
    .array(
      z.object({
        service: z.number().int().positive().describe("Id of a `services` record."),
        serviceName: z.string().describe("That service's name, shown in the approval prompt."),
        hours: z.number().min(0).describe("Hours of this service."),
      }),
    )
    .describe("Hours per service. May be empty only when `fixedPrice` is set."),
  validUntil: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .describe("Last day the offer is valid, YYYY-MM-DD. Omit for the default (5 weeks from today)."),
  fixedPrice: z.number().min(0).optional().describe("Fixed price in EUR; replaces the calculated price."),
  discount: z.number().min(0).max(100).optional().describe("Discount in percent."),
  description: z
    .string()
    .optional()
    .describe("Free text shown on the offer, in Bulgarian. Each line becomes a paragraph."),
  metrics: z
    .object({
      domainRating: count.max(100).optional(),
      backlinks: count.optional(),
      organicKeywords: count.optional(),
      organicTraffic: count.optional().describe("Organic visits per month."),
    })
    .optional()
    .describe("The client's current SEO metrics."),
  keywords: z
    .array(
      z.object({
        keyword: z.string().min(1),
        position: z.number().int().min(1),
        volume: count.describe("Searches per month."),
      }),
    )
    .optional()
    .describe("The client's top keywords."),
});

type Input = z.infer<typeof inputSchema>;

// What the user approves: everything that will be saved.
const summary = (input: Input) =>
  [
    `Create this offer for ${input.clientName}?`,
    ...input.services.map((line) => `• ${line.serviceName}: ${line.hours} h`),
    input.fixedPrice !== undefined ? `• Fixed price: ${input.fixedPrice} EUR` : null,
    input.discount !== undefined ? `• Discount: ${input.discount}%` : null,
    `• Valid until: ${input.validUntil ?? "5 weeks from today"}`,
    input.description ? `• Description: ${input.description}` : null,
    input.metrics && Object.keys(input.metrics).length > 0
      ? `• SEO metrics: ${Object.entries(input.metrics)
          .map(([name, value]) => `${name} ${value}`)
          .join(", ")}`
      : null,
    input.keywords?.length
      ? `• Keywords: ${input.keywords
          .map((entry) => `${entry.keyword} (#${entry.position}, ${entry.volume}/mo)`)
          .join("; ")}`
      : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

type Output = { id: number; client: string } | { error: string };

export default defineTool({
  description:
    "Create a commercial offer for a client, as a draft. Call it only when the user asked to " +
    "create an offer and has answered your questions about it; never guess a value the user " +
    "didn't give. Look up the client and service ids with findClients and findServices first. " +
    "The user is asked to approve the offer before it is saved, so call it once with the " +
    "complete offer. Afterwards the chat shows the offer with a PDF download button.",
  inputSchema,
  label: {
    start: ({ clientName }) => `Create offer for ${clientName}`,
  },
  approval: {
    // Only admins can create offers (as in the Offers collection); everyone
    // else is refused without a prompt. Admins confirm every offer.
    request: ({ session }) =>
      session.auth.current?.attributes.role === "admin"
        ? "user-approval"
        : { type: "denied", reason: "Only administrators can create offers." },
    prompt: ({ input }) => summary(input),
  },
  async execute(input, ctx): Promise<Output> {
    const secret = process.env.AGENT_API_SECRET;
    if (!secret) return { error: "AGENT_API_SECRET is not set, so offers can't be created." };

    const userId = Number(ctx.session.auth.current?.principalId);
    if (!Number.isInteger(userId)) return { error: "No signed-in user to create the offer as." };

    const { clientName, services, ...offer } = input;
    const response = await fetch(`${appUrl()}/api/agent/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Agent-Secret": secret },
      body: JSON.stringify({
        userId,
        offer: {
          ...offer,
          services: services.map(({ service, hours }) => ({ service, hours })),
        },
      }),
      signal: ctx.abortSignal,
    });

    const result = (await response.json().catch(() => null)) as
      | { success: true; id: number }
      | { success: false; error: string }
      | null;
    if (!result) return { error: `The offer could not be saved (HTTP ${response.status}).` };
    if (!result.success) return { error: result.error };
    return { id: result.id, client: clientName };
  },
  toModelOutput(output) {
    return {
      type: "text",
      value:
        "error" in output
          ? `The offer was NOT created: ${output.error}`
          : `Offer #${output.id} for ${output.client} was created as a draft. The user now sees ` +
            "it as a card with a PDF download button and a link to the offer, so reply with " +
            "one short line and don't repeat its details or add a link.",
    };
  },
});
