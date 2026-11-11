import { defineTool } from "eve/tools";
import { z } from "zod";

// Shows client detail cards in the dashboard chat (ClientCards in
// src/components/dashboard/ai-search-cards.tsx). Like show_consultation, the
// tool only passes ids: the dashboard loads each record with the signed-in
// user's session, so a card always shows the real, current data.
export default defineTool({
  description:
    "Show clients or leads (records in `clients` with status `active`, `inactive` or `lead`) as " +
    "detail cards in the chat. Call it whenever your answer is about one specific client or a few " +
    "(up to 5), including plain questions like 'what is our latest client' or 'who is our biggest " +
    "client', after finding their ids with findClients. The cards show company, status, contact, " +
    "email, phone, website, account managers, services, contract date and region, so reply with " +
    "at most one short line and don't repeat those details. For consultations use " +
    "show_consultation instead.",
  inputSchema: z.object({
    ids: z
      .array(z.number().int().positive())
      .min(1)
      .max(10)
      .describe("Ids of `clients` records (not consultations), most relevant first."),
  }),
  label: {
    start: ({ ids }) => (ids.length === 1 ? "Show client" : `Show ${ids.length} clients`),
  },
  execute({ ids }) {
    return { ids: [...new Set(ids)] };
  },
  toModelOutput({ ids }) {
    return {
      type: "text",
      value: `Shown ${ids.length} client card(s) to the user. Add at most a one-line summary or answer.`,
    };
  },
});
