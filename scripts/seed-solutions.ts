// Imports every solution in `seed-data/json-seed/*.json` into the Solutions
// collection (English locale). Safe to re-run: documents are matched by slug
// and updated instead of duplicated.
//
// Run with: pnpm seed:solutions [slug …]
// Pass one or more slugs (file names without .json) to import only those.
//
// The JSON files are page-shaped (paragraphs and lists as string arrays, plus
// page-only keys like breadcrumbs and CTAs). `toSolutionData` maps them onto
// the collection's fields and ignores everything the collection doesn't store.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../payload.config'
import type { Solution } from '../payload-types'

const SEED_DIR = path.resolve(
  process.cwd(),
  'src/app/[locale]/(frontend)/website/solutions/seed-data/json-seed',
)

type TitleDescription = { title: string; description?: string }

type HeadingList = {
  heading?: string
  paragraphs?: string[]
  listIntro?: string
  list?: string[]
}

type SolutionSeed = {
  slug: string
  name: string
  hero?: { eyebrow?: string; heading?: string; paragraphs?: string[]; highlights?: string[] }
  concerns?: { heading?: string; items?: TitleDescription[] }
  businessGrowth?: { eyebrow?: string; heading?: string; lead?: string; paragraphs?: string[] }
  audience?: HeadingList
  partnerNeeds?: HeadingList
  whyUs?: { heading?: string; items?: TitleDescription[] }
  includes?: {
    heading?: string
    description?: string
    items?: { title: string; paragraphs?: string[] }[]
  }
  outcomes?: { heading?: string; description?: string; items?: TitleDescription[] }
  process?: { heading?: string; steps?: TitleDescription[]; note?: string }
  teamExtension?: HeadingList
  faq?: { heading?: string; items?: { question: string; answer: string }[] }
  consultation?: { heading?: string; description?: string }
}

type SolutionData = Omit<Solution, 'id' | 'createdAt' | 'updatedAt'>

// Paragraph fields are one textarea separated by blank lines.
const joinParagraphs = (paragraphs?: string[]) => paragraphs?.join('\n\n')

// Payload arrays can't hold plain strings, so each list item is `{ text }`.
const toList = (items?: string[]) => items?.map((text) => ({ text }))

const toHeadingList = (section?: HeadingList) =>
  section && {
    heading: section.heading,
    paragraphs: joinParagraphs(section.paragraphs),
    listIntro: section.listIntro,
    list: toList(section.list),
  }

function toSolutionData(seed: SolutionSeed): SolutionData {
  const { hero, businessGrowth, includes } = seed

  return {
    name: seed.name,
    slug: seed.slug,
    hero: hero && {
      eyebrow: hero.eyebrow,
      heading: hero.heading,
      paragraphs: joinParagraphs(hero.paragraphs),
      highlights: toList(hero.highlights),
    },
    concerns: seed.concerns,
    businessGrowth: businessGrowth && {
      eyebrow: businessGrowth.eyebrow,
      heading: businessGrowth.heading,
      lead: businessGrowth.lead,
      paragraphs: joinParagraphs(businessGrowth.paragraphs),
    },
    audience: toHeadingList(seed.audience),
    partnerNeeds: toHeadingList(seed.partnerNeeds),
    whyUs: seed.whyUs,
    includes: includes && {
      heading: includes.heading,
      description: includes.description,
      items: includes.items?.map((item) => ({
        title: item.title,
        paragraphs: joinParagraphs(item.paragraphs),
      })),
    },
    outcomes: seed.outcomes,
    process: seed.process,
    teamExtension: toHeadingList(seed.teamExtension),
    faq: seed.faq,
    consultation: seed.consultation && {
      heading: seed.consultation.heading,
      description: seed.consultation.description,
    },
  }
}

async function seedSolutions() {
  const payload = await getPayload({ config })

  const onlySlugs = process.argv.slice(2)
  const files = readdirSync(SEED_DIR).filter(
    (file) =>
      file.endsWith('.json') &&
      (onlySlugs.length === 0 || onlySlugs.includes(path.basename(file, '.json'))),
  )

  if (files.length === 0) {
    throw new Error(`No seed files found for: ${onlySlugs.join(', ') || '(all)'}`)
  }

  for (const file of files) {
    const seed = JSON.parse(readFileSync(path.join(SEED_DIR, file), 'utf8')) as SolutionSeed
    const data = toSolutionData(seed)

    const { docs } = await payload.find({
      collection: 'solutions',
      locale: 'en',
      where: { slug: { equals: seed.slug } },
      limit: 1,
    })

    if (docs[0]) {
      await payload.update({ collection: 'solutions', id: docs[0].id, locale: 'en', data })
      console.log(`updated ${seed.slug}`)
    } else {
      await payload.create({ collection: 'solutions', locale: 'en', data })
      console.log(`created ${seed.slug}`)
    }
  }
}

// `payload run` calls process.exit() as soon as this module finishes loading,
// so the seed must be awaited at the top level.
await seedSolutions()
