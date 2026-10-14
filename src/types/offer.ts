// Shape of a client offer page. `OfferStatic` is the template copy shared by
// every offer (src/data/offers/static.json); `Offer` holds the per-client
// values that will later come from an `offers` Payload collection.

/** A list item with a bold lead-in, e.g. "Мета данни: Полета за …". */
export interface LabeledItem {
  label: string
  text: string
}

export interface NamedLogo {
  name: string
  logo: string
}

export interface OfferStatic {
  brand: { name: string; website: string; introHeader: string; intro: string[] }
  agency: {
    header: string
    founded: number
    description: string
    pillars: { title: string; description: string }[]
  }
  socialProof: {
    header: string
    badges: NamedLogo[]
    countriesHeader: string
    countriesDescription: string
    countries: string[]
  }
  audit: {
    header: string
    metricLabels: Record<OfferMetricKey, string>
    keywordsHeader: string
    columns: { keyword: string; position: string; volume: string }
  }
  timeline: {
    header: string
    activityHeader: string
    weekLabel: string
    responsibilitiesHeader: string
  }
  architecture: {
    header: string
    eyebrow: string
    steps: { title: string; description: string; items: string[] }[]
    pageTypesHeader: string
    competitorsHeader: string
  }
  technical: {
    header: string
    description: string
    groups: { title: string; items: LabeledItem[] }[]
  }
  contentStrategy: {
    header: string
    description: string
    /** Item text may contain `{blogArticles}`-style placeholders. */
    groups: { title: string; items: LabeledItem[] }[]
  }
  pricing: {
    header: string
    summaryHeader: string
    hoursLabel: string
    packagesHeader: string
    /** "Вариант" in "Вариант 1: Пълен пакет". */
    variantLabel: string
    priceLabel: string
    /** Price unit shown after the amount, e.g. "евро". */
    currencyLabel: string
    recommendedLabel: string
    vatNote: string
  }
  team: { header: string; description: string }
  trackRecord: {
    header: string
    stats: { value: string; label: string }[]
    contact: { name: string; role: string; phone: string; email: string }
  }
}

export type OfferMetricKey =
  | 'domainRating'
  | 'backlinks'
  | 'organicKeywords'
  | 'organicTraffic'

export interface OfferPackage {
  name: string
  /** Omitted when the package isn't quoted in hours. */
  hours?: number
  price: number
  currency: string
  includesContent: boolean
  recommended: boolean
  features: string[]
}

export interface OfferPhase {
  label: string
  startWeek: number
  endWeek: number
  tasks: string[]
  description: string
}

export interface Offer {
  id: string
  client: { slug: string; name: string; logo: string; url: string }
  service: string
  /** Kind of site, appended to some headings, e.g. "био магазин". */
  siteType: string
  date: string
  validUntil: string
  metrics: Record<OfferMetricKey, number> & { source: string; date: string }
  keywords: { keyword: string; position: number; volume: number }[]
  startLabel: string
  timeline: OfferPhase[]
  responsibilities: string
  pageTypes: string[]
  competitors: string[]
  includeLocalization: boolean
  content: { blogArticles: number; categoryPages: number; brandPages: number }
  scopeSummary: LabeledItem[]
  supportWeeks: number
  packages: OfferPackage[]
  /** IDs from the `users` collection, in display order. */
  teamUserIds: number[]
}
