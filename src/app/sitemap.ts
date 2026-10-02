import type { MetadataRoute } from 'next'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'

import { routing } from '@/i18n/routing'
import { STATIC_PAGES, docPathFromSlugs } from '@/lib/seo/pages'
import {
  alternateLanguages,
  localizedUrl,
  type LocalizedPath,
} from '@/lib/seo/site'

export const revalidate = 3600 // 1 hour

const published: Where = { _status: { equals: 'published' } }

// A failing query (e.g. a table missing from the database) must not take the
// whole sitemap — or the build, which prerenders it — down with it. Log it
// and leave those URLs out until the next revalidation.
async function safely<T>(label: string, fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn()
  } catch (error) {
    console.error(
      `[sitemap] skipped ${label}:`,
      error instanceof Error ? error.message : error,
    )
    return []
  }
}

// Collection → detail page base path. `where` hides drafts for collections
// with versions enabled.
const DETAIL_COLLECTIONS = [
  { collection: 'blog', basePath: '/website/blog', where: published },
  {
    collection: 'events',
    basePath: '/website/events-and-media',
    where: published,
  },
  { collection: 'services', basePath: '/website/services' },
  { collection: 'solutions', basePath: '/website/solutions' },
  { collection: 'industries', basePath: '/website/industries' },
  // Disabled until the case_studies table exists in the production database.
  // { collection: 'case-studies', basePath: '/website/case-studies' },
  { collection: 'job-listings', basePath: '/website/careers' },
] as const

// One <url> per language version, each listing all alternates (hreflang).
function entries(
  path: LocalizedPath,
  lastModified?: string | Date,
): MetadataRoute.Sitemap {
  const languages = alternateLanguages(path)
  return routing.locales.map((locale) => ({
    url: localizedUrl(path, locale),
    lastModified,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const staticEntries = Object.values(STATIC_PAGES).flatMap((path) =>
    entries(path),
  )

  const detailEntries = await Promise.all(
    DETAIL_COLLECTIONS.map(({ collection, basePath, ...rest }) =>
      safely(collection, async () => {
        const { docs } = await payload.find({
          collection,
          locale: 'all',
          depth: 0,
          pagination: false,
          where: 'where' in rest ? rest.where : undefined,
          select: { slug: true, updatedAt: true },
        })
        return docs.flatMap((doc) =>
          entries(docPathFromSlugs(basePath, doc.slug, doc.id), doc.updatedAt),
        )
      }),
    ),
  )

  // Author pages for everyone with at least one published post.
  const posts = await safely('authors', async () => {
    const { docs } = await payload.find({
      collection: 'blog',
      depth: 0,
      pagination: false,
      where: published,
      select: { author: true, updatedAt: true },
    })
    return docs
  })
  const authorUpdatedAt = new Map<string, string>()
  for (const post of posts) {
    const id =
      post.author && typeof post.author === 'object'
        ? post.author.id
        : post.author
    if (id == null) continue
    const key = String(id)
    const previous = authorUpdatedAt.get(key)
    if (!previous || previous < post.updatedAt)
      authorUpdatedAt.set(key, post.updatedAt)
  }
  const authorEntries = [...authorUpdatedAt].flatMap(([id, updatedAt]) =>
    entries(`/website/authors/${id}`, updatedAt),
  )

  return [...staticEntries, ...detailEntries.flat(), ...authorEntries]
}
