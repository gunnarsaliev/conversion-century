import { defineTool } from "eve/tools";
import { z } from "zod";

// Shows consultation cards in the dashboard chat (ConsultationCard in
// src/components/dashboard/ai-search-cards.tsx). The tool only passes ids:
// the dashboard loads each record itself with the signed-in user's session,
// so a card always shows the real, current data.
export default defineTool({
  description:
    "Show one or more consultations (clients with status `consultation`) as cards in the chat. " +
    "Call it after finding consultations with findClients, passing their ids, whenever the user " +
    "asks to see, list or look up consultations. The cards show company, contact, email, phone, " +
    "website, message and date, so don't repeat those details in your reply.",
  inputSchema: z.object({
    ids: z
      .array(z.number().int().positive())
      .min(1)
      .max(10)
      .describe("Ids of `clients` records whose status is `consultation`, most relevant first."),
  }),
  label: {
    start: ({ ids }) => (ids.length === 1 ? "Show consultation" : `Show ${ids.length} consultations`),
  },
  execute({ ids }) {
    return { ids: [...new Set(ids)] };
  },
  toModelOutput({ ids }) {
    return {
      type: "text",
      value: `Shown ${ids.length} consultation card(s) to the user. Add at most a one-line summary.`,
    };
  },
});
