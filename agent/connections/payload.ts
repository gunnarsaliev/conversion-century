import { defineMcpClientConnection } from "eve/connections";

import { appUrl } from "../lib/app-url";

// Payload's MCP server (src/lib/mcp-plugin.ts), read-only. The API key
// belongs to a dedicated editor-role user and only has `find` enabled; the
// allowlist below is a second guard so no write tool is ever discoverable.
const FIND_TOOLS = [
  "findClients",
  "findContacts",
  "findWorkChecklist",
  "findClientChecklistProgress",
  "findOffers",
  "findServices",
  "findUsers",
  "findBlog",
  "findCaseStudies",
  "findSolutions",
  "findIndustries",
  "findTestimonials",
  "findEvents",
  "findJobListings",
  "findPageMeta",
  "findRedirects",
];

export default defineMcpClientConnection({
  url: `${appUrl()}/api/mcp`,
  description:
    "Conversion Century's CMS database (read-only): clients, leads and consultations, contacts, offers, services/pricelist, team members, website content and SEO data.",
  // A static app key in its own header (read by `overrideAuth` in
  // src/lib/mcp-plugin.ts). Not `Authorization`: eve manages that header on
  // MCP connections, and a Bearer key there arrived altered.
  headers: {
    "X-Payload-MCP-Key": () => {
      const token = process.env.PAYLOAD_MCP_API_KEY;
      if (!token) throw new Error("PAYLOAD_MCP_API_KEY is not set");
      return token;
    },
  },
  tools: { allow: FIND_TOOLS },
  // Payload's MCP handler authenticates every request, so use the normal
  // `initialize` handshake rather than eve's protocol-discovery probe.
  protocolVersionDiscovery: false,
});
