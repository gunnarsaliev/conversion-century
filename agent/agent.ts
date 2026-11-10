import { defineAgent } from "eve";

// Dashboard AI search: answers questions about the Payload database through
// the read-only MCP connection in connections/payload.ts. No sandbox, shell
// or file tools — the Payload tools are its only capability.
export default defineAgent({
  // Strongest tool-use model the AI Gateway free tier allows (Anthropic
  // models are plan-restricted there). With paid credits, consider
  // "anthropic/claude-sonnet-5.5".
  model: "openai/gpt-5.2",
  reasoning: "low",
  defaultTools: false,
  limits: {
    // Per conversation: stop (and ask to continue) well before a search
    // could get expensive.
    sessionUsage: ({ window }) =>
      window.inputTokens - window.cacheReadTokens >= 400_000 ||
      window.outputTokens >= 40_000 ||
      (window.costUsd ?? 0) >= 2,
    // Searches are short-lived; finish idle conversations after a day.
    sessionTimeoutMs: 24 * 60 * 60 * 1_000,
  },
});
