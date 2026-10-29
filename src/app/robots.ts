import type { MetadataRoute } from "next";

import { IS_INDEXABLE, SITE_URL } from "@/lib/seo/site";

// Internal areas, in both the unprefixed (en) and /bg forms. Private client
// offers sit behind the login gate (src/proxy.ts) and carry noindex.
const PRIVATE_PATHS = [
  "/admin",
  "/api",
  "/tools",
  "/dashboard",
  "/docs",
  "/login",
  "/offers",
  "/offer",
  "/special-offer",
];

// AI search and answer crawlers (they fetch pages to cite them in ChatGPT
// search, Claude, Perplexity, …). Allowed, so the site can be cited.
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

// Crawlers that collect content to train AI models. Blocked. Google-Extended
// and Applebot-Extended only control AI training use; they don't affect
// Google or Apple search.
const AI_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const disallow = [...PRIVATE_PATHS, ...PRIVATE_PATHS.map((path) => `/bg${path}`)];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // A crawler follows only its own group, so the private paths are
      // repeated here.
      { userAgent: AI_SEARCH_BOTS, allow: "/", disallow },
      { userAgent: AI_TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
