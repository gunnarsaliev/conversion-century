// Fills the `home-page` and `about-page` collections (one document each)
// with the copy the pages render today: text from messages/en.json and
// messages/bg.json, links, icons and image URLs from the components. Safe to
// re-run: the existing document is updated, never duplicated.
//
// Run with: pnpm seed:pages          (links images already in Media)
//           pnpm seed:pages upload   (also uploads the ones Media lacks)
//
// Images are matched to Media by file name. Without `upload`, an image that
// isn't in Media yet is reported and its field left empty.
import path from 'node:path'
import { getPayload, type Payload } from 'payload'

import config from '../payload.config'
import type { AboutPage, HomePage } from '../payload-types'
import en from '../messages/en.json'
import bg from '../messages/bg.json'
import hero104 from '../src/data/hero104.json'

type Messages = typeof en

const MEDIA = 'https://media.cc-hub.online'
const IMAGES = {
  homeHero: hero104.image,
  whyUs: `${MEDIA}/Mint-toned%20workspace%20with%20branded%20mascots.png`,
  portrait: `${MEDIA}/maria-sivkova.jpeg`,
  aboutHero: `${MEDIA}/Cosmic%20Teamwork%20Around%20a%20Futuristic%20Table.png`,
}

// Message key, icon and link of each card, in page order (from Feature278,
// Feature13, Feature104 and about-us.tsx).
const SERVICES = [
  ['ongoingSeo', 'Search', '/services/ongoing-seo-management'],
  ['technicalSeo', 'Wrench', '/services/technical-seo'],
  ['contentStrategy', 'FileText', '/services/content-strategy-and-copywriting'],
  ['internationalSeo', 'Globe', '/services/international-seo'],
  ['aiSearch', 'Bot', '/services/ai-search-optimization'],
  ['digitalPr', 'Link2', '/services/link-building-and-digital-pr'],
  ['audits', 'BarChart3', '/services/seo-audit'],
  ['localSeo', 'MapPin', '/services/local-seo'],
  ['training', 'GraduationCap', '/services/organic-search-training'],
] as const

const INDUSTRIES = [
  ['b2b', 'Zap', '/industries/b2b'],
  ['ecommerce', 'Palette', '/industries/ecommerce'],
  ['professionalServices', 'Layers', '/industries/professional-services'],
  ['financialServices', 'Rocket', '/industries/financial-sector'],
  ['realEstate', 'Blocks', '/industries/real-estate'],
  ['healthcare', 'Globe', '/industries/healthcare'],
  ['legal', 'Briefcase', '/industries'],
  ['travel', 'Plane', '/industries'],
  ['education', 'GraduationCap', '/industries'],
] as const

const WHY_US = [
  ['directAccess', 'Users'],
  ['honestAdvice', 'UserCheck'],
  ['measurement', 'BarChart3'],
  ['lastingImprovements', 'ShieldCheck'],
  ['learning', 'Sparkles'],
  ['collaboration', 'Handshake'],
] as const

const PRINCIPLES = [
  ['understand', 'Search'],
  ['ownership', 'ShieldCheck'],
  ['communicate', 'MessagesSquare'],
  ['longTerm', 'Sprout'],
  ['learning', 'FlaskConical'],
  ['partners', 'Handshake'],
] as const

const STAT_KEYS = ['clients', 'industries', 'years'] as const
const COUNTRY_CODES = ['us', 'gb', 'de', 'ro', 'gr', 'hu', 'fr', 'es', 'pt']

// URL → Media id, for every image either page uses.
type MediaIds = Map<string, number>

async function resolveMedia(payload: Payload, upload: boolean): Promise<MediaIds> {
  const ids: MediaIds = new Map()
  const urls = new Set([...Object.values(IMAGES), ...hero104.avatars])

  for (const url of urls) {
    const filename = decodeURIComponent(path.posix.basename(new URL(url).pathname))
    const { docs } = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })

    if (docs[0]) {
      ids.set(url, docs[0].id)
    } else if (upload) {
      const response = await fetch(url)
      if (!response.ok) {
        console.warn(`image skipped (${response.status}): ${url}`)
        continue
      }
      const data = Buffer.from(await response.arrayBuffer())
      const created = await payload.create({
        collection: 'media',
        data: {},
        file: {
          data,
          name: filename,
          mimetype: response.headers.get('content-type') ?? 'application/octet-stream',
          size: data.length,
        },
      })
      ids.set(url, created.id)
      console.log(`uploaded ${filename}`)
    } else {
      console.warn(`image not in Media, field left empty: ${filename}`)
    }
  }

  return ids
}

type PageData<T> = Omit<T, 'id' | 'title' | 'createdAt' | 'updatedAt'>

function homeData(m: Messages, media: MediaIds): PageData<HomePage> {
  const hero = m.Home.hero
  return {
    hero: {
      heading: hero.heading,
      description: hero.description,
      secondaryDescription: hero.secondaryDescription,
      primaryCta: { label: m.Common.bookConsultation, href: hero104.primaryCtaHref },
      secondaryCta: { label: hero.secondaryCta, href: hero104.secondaryCtaHref },
      socialProof: hero.socialProof,
      avatars: hero104.avatars.flatMap((url) => {
        const image = media.get(url)
        return image ? [{ image, alt: hero.avatarAlt }] : []
      }),
      highlights: [
        hero.highlights.founded,
        hero.highlights.relationships,
        hero.highlights.international,
      ].map((text) => ({ text })),
      image: media.get(IMAGES.homeHero),
    },
    clients: {
      eyebrow: m.Logos35.eyebrow,
      heading: m.Logos35.heading,
      footer: m.Logos35.footer,
      viewAll: { label: m.Logos35.viewAll, href: '/clients' },
    },
    intro: {
      heading: m.Hero262.heading,
      paragraphs: m.Hero262.description,
      stats: STAT_KEYS.map((key) => m.Hero262.stats[key]),
      cta: { label: m.Hero262.cta, href: '/about' },
    },
    services: {
      heading: m.Feature278.heading,
      description: m.Feature278.description,
      items: SERVICES.map(([key, icon, href]) => ({ ...m.Feature278.features[key], href, icon })),
      viewAll: { label: m.Feature278.viewAll, href: '/services' },
    },
    caseStudies: {
      heading: m.CaseStudies8.title,
      description: m.CaseStudies8.description,
      viewAll: { label: m.CaseStudies8.viewAll, href: '/case-studies' },
    },
    industries: {
      eyebrow: m.Feature13.eyebrow,
      heading: m.Feature13.heading,
      description: m.Feature13.description,
      items: INDUSTRIES.map(([key, icon, href]) => ({ ...m.Feature13.features[key], href, icon })),
    },
    whyUs: {
      badge: m.Feature104.badge,
      heading: m.Feature104.heading,
      subheading: m.Feature104.subheading,
      image: media.get(IMAGES.whyUs),
      points: WHY_US.map(([key, icon]) => ({ ...m.Feature104.points[key], icon })),
    },
    founderLetter: {
      eyebrow: m.FounderLetter.eyebrow,
      heading: m.FounderLetter.heading,
      portrait: media.get(IMAGES.portrait),
      portraitAlt: m.FounderLetter.portraitAlt,
      quote: m.FounderLetter.quote,
      name: m.FounderLetter.name,
      role: m.FounderLetter.role,
      cta: { label: m.FounderLetter.cta, href: '/about#team' },
    },
    testimonials: {
      heading: m.Testimonial17.heading,
      viewAll: { label: m.Testimonial17.viewAll, href: '/reviews' },
    },
    blog: {
      badge: m.Blog12.badge,
      heading: m.Blog12.heading,
      description: m.Blog12.description,
      viewAll: { label: m.Blog12.viewAll, href: '/blog' },
    },
  }
}

function aboutData(m: Messages, media: MediaIds): PageData<AboutPage> {
  const about = m.About
  const years = about.story.years
  return {
    hero: {
      eyebrow: about.hero.eyebrow,
      heading: about.hero.heading,
      paragraphs: about.hero.body,
      cta: { label: about.hero.cta, href: '#team' },
      image: media.get(IMAGES.aboutHero),
      imageAlt: about.hero.imageAlt,
    },
    story: {
      eyebrow: about.story.eyebrow,
      heading: about.story.heading,
      years: (Object.keys(years) as (keyof typeof years)[])
        .sort()
        .map((year) => ({ year, ...years[year] })),
    },
    people: {
      eyebrow: about.people.eyebrow,
      heading: about.people.heading,
      lead: about.people.lead,
      paragraphs: about.people.body,
    },
    leadership: {
      eyebrow: about.leadership.eyebrow,
      heading: about.leadership.heading,
      intro: about.leadership.intro,
      portrait: media.get(IMAGES.portrait),
      portraitAlt: m.FounderLetter.portraitAlt,
      quote: about.leadership.quote,
      name: m.FounderLetter.name,
      role: about.leadership.role,
    },
    markets: {
      eyebrow: about.markets.eyebrow,
      heading: about.markets.heading,
      lead: about.markets.lead,
      spans: about.markets.spans,
      countries: COUNTRY_CODES.map((code) => ({ code })),
    },
    partners: {
      eyebrow: about.partners.eyebrow,
      heading: about.partners.heading,
      description: about.partners.body,
    },
    collaboration: {
      eyebrow: about.collaboration.eyebrow,
      heading: about.collaboration.heading,
      lead: about.collaboration.lead,
      paragraphs: about.collaboration.body,
    },
    mission: {
      eyebrow: about.mission.eyebrow,
      statement: about.mission.statement,
      paragraphs: about.mission.body,
    },
    principles: {
      eyebrow: about.principles.eyebrow,
      heading: about.principles.heading,
      items: PRINCIPLES.map(([key, icon]) => ({ ...about.principles.items[key], icon })),
    },
  }
}

// Copies each array row's `id` from the saved document onto the same row of
// `data`. A localized update that sends rows without ids replaces them, which
// would drop the other locale's text.
function withRowIds<T>(data: T, saved: unknown): T {
  if (Array.isArray(data)) {
    const savedRows = Array.isArray(saved) ? saved : []
    return data.map((row, index) => {
      const savedRow = savedRows[index] as { id?: string } | undefined
      const merged = withRowIds(row, savedRow)
      return savedRow?.id && merged && typeof merged === 'object'
        ? { ...merged, id: savedRow.id }
        : merged
    }) as T
  }
  if (data && typeof data === 'object') {
    const savedObject = (saved ?? {}) as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, withRowIds(value, savedObject[key])]),
    ) as T
  }
  return data
}

async function seedPage(
  payload: Payload,
  collection: 'home-page' | 'about-page',
  title: string,
  build: (m: Messages) => PageData<HomePage> | PageData<AboutPage>,
) {
  const { docs } = await payload.find({ collection, limit: 1, depth: 0 })
  const existing = docs[0]

  // English first: it creates the rows the Bulgarian pass then translates.
  const data = withRowIds(build(en), existing)
  const saved = existing
    ? await payload.update({ collection, id: existing.id, locale: 'en', depth: 0, data: data as never })
    : await payload.create({ collection, locale: 'en', depth: 0, data: { title, ...data } as never })

  await payload.update({
    collection,
    id: saved.id,
    locale: 'bg',
    depth: 0,
    data: withRowIds(build(bg as Messages), saved) as never,
  })

  console.log(`${existing ? 'updated' : 'created'} ${collection} (en + bg)`)
}

async function seedPages() {
  const payload = await getPayload({ config })
  const media = await resolveMedia(payload, process.argv.slice(2).includes('upload'))

  await seedPage(payload, 'home-page', 'Home page', (m) => homeData(m, media))
  await seedPage(payload, 'about-page', 'About page', (m) => aboutData(m, media))
}

// `payload run` calls process.exit() as soon as this module finishes loading,
// so the seed must be awaited at the top level.
await seedPages()
