// Shape of a client offer page. `OfferStatic` is the template copy shared by
// every offer (src/data/offers/static.json); `Offer` holds the per-client
// values that will later come from an `offers` Payload collection.

export interface TitledItems {
  title: string
  items: string[]
}

export interface NamedLogo {
  name: string
  logo: string
}

export interface OfferStatic {
  brand: { name: string; website: string; intro: string[] }
  agency: {
    header: string
    founded: number
    description: string
    pillars: { title: string; description: string }[]
  }
  socialProof: {
    header: string
    badges: NamedLogo[]
    clients: NamedLogo[]
    countriesHeader: string
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
    weekLabel: string
    responsibilitiesHeader: string
  }
  architecture: {
    header: string
    eyebrow: string
    steps: { title: string; description: string }[]
    pageTypesHeader: string
    competitorsHeader: string
  }
  technical: { header: string; groups: TitledItems[] }
  contentStrategy: { header: string; groups: TitledItems[] }
  pricing: {
    header: string
    summaryHeader: string
    hoursLabel: string
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
  hours: number
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
}

export interface Offer {
  id: string
  client: { slug: string; name: string; logo: string; url: string }
  service: string
  date: string
  validUntil: string
  metrics: Record<OfferMetricKey, number> & { source: string; date: string }
  keywords: { keyword: string; position: number; volume: number }[]
  timeline: OfferPhase[]
  responsibilities: string
  pageTypes: string[]
  competitors: string[]
  includeLocalization: boolean
  content: { blogArticles: number; categoryPages: number; brandPages: number }
  scopeSummary: string[]
  supportWeeks: number
  packages: OfferPackage[]
  team: { name: string; role: string; photo: string }[]
}
