import { getPayload, type PopulateType, type Where } from 'payload'
import config from '@payload-config'

import { cmsCache } from '@/lib/cms/cache'

type Locale = 'en' | 'bg'

// Collections whose `slug` is localized (see localizedSlugField) and that
// have a public detail page.
type SluggedCollection =
  | 'blog'
  | 'case-studies'
  | 'events'
  | 'industries'
  | 'job-listings'
  | 'services'
  | 'solutions'

// A doc exists in a locale only once it has a slug there: localizedSlugField
// generates it from the title/name in that locale. Payload's field fallback
// would otherwise serve the English version on the Bulgarian site.
async function hasSlugIn(
  collection: SluggedCollection,
  id: number | string,
  locale: Locale,
) {
  const payload = await getPayload({ config })
  const doc = await payload.findByID({
    collection,
    id,
    locale,
    fallbackLocale: false,
    depth: 0,
    select: { slug: true },
  })
  return Boolean((doc as { slug?: string | null }).slug)
}

// Looks the slug up in the current locale first. If it isn't found there,
// falls back to the English slug and loads that document in the current
// locale — so a hardcoded English link still works on the Bulgarian site.
// Returns null (→ 404) for docs that aren't translated into `locale`.
// Cached across requests; populated relations can come from media/users.
export async function findByLocalizedSlug<T extends SluggedCollection>(
  collection: T,
  slug: string,
  locale: string,
  { depth = 1, populate }: { depth?: number; populate?: PopulateType } = {},
) {
  'use cache'
  cmsCache(collection, 'media', 'users')
  const payload = await getPayload({ config })

  const findBySlug = (slugLocale: Locale) =>
    payload.find({
      collection,
      locale: slugLocale,
      where: { slug: { equals: slug } },
      depth,
      populate,
      limit: 1,
    })

  const { docs } = await findBySlug(locale as Locale)
  if (docs[0]) {
    return (await hasSlugIn(collection, docs[0].id, locale as Locale))
      ? docs[0]
      : null
  }

  if (locale === 'en') return null

  const { docs: englishDocs } = await findBySlug('en')
  const id = englishDocs[0]?.id
  if (id == null || !(await hasSlugIn(collection, id, locale as Locale))) {
    return null
  }

  return payload.findByID({
    collection,
    id,
    locale: locale as Locale,
    depth,
    populate,
  })
}

// `where` for listings: only docs translated into the queried locale (see
// hasSlugIn). Payload doesn't apply the locale fallback inside `where`, so
// this matches docs with a slug of their own in that locale.
export const translated = { slug: { exists: true } } satisfies Where

// Hardcoded menu links (navbar, footer, home page) point at services,
// solutions and industries by their English slug. These are the ones not
// translated into `locale`, which would 404 there. Cached across requests.
export async function untranslatedHrefs(locale: string) {
  'use cache'
  cmsCache('services', 'solutions', 'industries')
  const payload = await getPayload({ config })
  const linked = [
    { collection: 'services', basePath: '/services' },
    { collection: 'solutions', basePath: '/solutions' },
    { collection: 'industries', basePath: '/industries' },
  ] as const

  const hrefs = await Promise.all(
    linked.map(async ({ collection, basePath }) => {
      const { docs } = await payload.find({
        collection,
        locale: 'all',
        depth: 0,
        pagination: false,
        select: { slug: true },
      })
      return docs.flatMap((doc) => {
        const slugs = doc.slug as unknown as Partial<Record<string, string>> | null
        return slugs?.en && !slugs[locale] ? [`${basePath}/${slugs.en}`] : []
      })
    }),
  )
  return hrefs.flat()
}
