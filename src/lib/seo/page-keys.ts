// Kept free of imports so Payload collections (loaded by payload.config.ts)
// can use these lists without pulling in the Payload config itself.

// Static public pages: href + key into the `Metadata` messages namespace.
export const STATIC_PAGES = {
  home: "/",
  about: "/about",
  services: "/services",
  solutions: "/solutions",
  industries: "/industries",
  caseStudies: "/case-studies",
  blog: "/blog",
  clients: "/clients",
  reviews: "/reviews",
  openPositions: "/open-positions",
  bookAConsultation: "/book-a-consultation",
  eventsAndMedia: "/events-and-media",
  termsAndConditions: "/legal/terms-and-conditions",
  privacyPolicy: "/legal/privacy-policy",
  cookiePolicy: "/legal/cookie-policy",
} as const;

export type StaticPageKey = keyof typeof STATIC_PAGES;

// Every page whose meta title/description is managed from Dashboard → SEO →
// Meta data (the `page-meta` collection): the static pages plus docs pages
// that have no collection behind them.
export const SEO_PAGES = {
  ...STATIC_PAGES,
  docsGettingStarted: "/docs/getting-started",
} as const;

export type SeoPageKey = keyof typeof SEO_PAGES;

export const SEO_PAGE_KEYS = Object.keys(SEO_PAGES) as SeoPageKey[];
