// Collections whose detail pages read their own `meta` group (meta title /
// description), edited in place from Dashboard → SEO → Meta data. The
// fields themselves live on each collection; this only says where the
// public page is and which field the page falls back to for its title.
export const SEO_COLLECTIONS = {
  blog: { titleField: "title", basePath: "/blog" },
  "case-studies": { titleField: "title", basePath: "/case-studies" },
  industries: { titleField: "title", basePath: "/industries" },
  events: { titleField: "title", basePath: "/events-and-media" },
  services: { titleField: "name", basePath: "/services" },
  solutions: { titleField: "name", basePath: "/solutions" },
} as const;

export type SeoCollection = keyof typeof SEO_COLLECTIONS;

export const SEO_COLLECTION_SLUGS = Object.keys(SEO_COLLECTIONS) as SeoCollection[];

export const META_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 160;
