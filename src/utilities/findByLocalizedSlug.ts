import { getPayload } from 'payload'
import config from '@payload-config'

type Locale = 'en' | 'bg'

// Collections whose `slug` is localized (see localizedSlugField) and whose
// pages are linked from the navbar by their English slug.
type SluggedCollection = 'industries' | 'solutions'

// Looks the slug up in the current locale first. If it isn't found there,
// falls back to the English slug and loads that document in the current
// locale — so a hardcoded English link still works on the Bulgarian site.
export async function findByLocalizedSlug<T extends SluggedCollection>(
  collection: T,
  slug: string,
  locale: string,
) {
  const payload = await getPayload({ config })

  const findBySlug = (slugLocale: Locale) =>
    payload.find({
      collection,
      locale: slugLocale,
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })

  const { docs } = await findBySlug(locale as Locale)
  if (docs[0]) return docs[0]

  if (locale === 'en') return null

  const { docs: englishDocs } = await findBySlug('en')
  if (!englishDocs[0]) return null

  return payload.findByID({
    collection,
    id: englishDocs[0].id,
    locale: locale as Locale,
    depth: 1,
  })
}
