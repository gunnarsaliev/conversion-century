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

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_PATHS, ...PRIVATE_PATHS.map((path) => `/bg${path}`)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
