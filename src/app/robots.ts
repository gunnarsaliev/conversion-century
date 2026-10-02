import type { MetadataRoute } from "next";

import { IS_INDEXABLE, SITE_URL } from "@/lib/seo/site";

// Internal areas, in both the unprefixed (bg) and /en forms. The login page
// at / and /en is kept crawlable but carries noindex, so /website stays
// reachable.
const PRIVATE_PATHS = ["/admin", "/api", "/tools", "/dashboard", "/docs"];

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...PRIVATE_PATHS, ...PRIVATE_PATHS.map((path) => `/en${path}`)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
