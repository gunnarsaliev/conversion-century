import type { MetadataRoute } from 'next'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'

import { blogCategoryPath, isBlogCategory, type BlogCategory } from '@/lib/blog-categories'
import { STATIC_PAGES, docPathFromSlugs } from '@/lib/seo/pages'
import {
  alternateLanguages,
  authorPath,
  localesOf,
  localizedUrl,
  type Locale,
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
  { collection: 'blog', basePath: '/blog', where: published },
  {
    collection: 'events',
    basePath: '/events-and-media',
    where: published,
  },
  { collection: 'services', basePath: '/services' },
  { collection: 'solutions', basePath: '/solutions' },
  {
    collection: 'industries',
    basePath: '/industries',
    where: published,
  },
  { collection: 'case-studies', basePath: '/case-studies' },
  { collection: 'job-listings', basePath: '/careers' },
] as const

// One <url> per existing language version, each listing all alternates
// (hreflang).
function entries(
  path: LocalizedPath,
  lastModified?: string | Date,
): MetadataRoute.Sitemap {
  const languages = alternateLanguages(path)
  return localesOf(path).map((locale) => ({
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
  const authors = await safely('authors', async () => {
    if (!authorUpdatedAt.size) return []
    const { docs } = await payload.find({
      collection: 'users',
      depth: 0,
      pagination: false,
      where: { id: { in: [...authorUpdatedAt.keys()] } },
      select: { slug: true },
    })
    return docs
  })
  const authorEntries = authors.flatMap((author) =>
    entries(authorPath(author), authorUpdatedAt.get(String(author.id))),
  )

  // Category pages, in each locale that has a published post in them.
  const categorized = await safely('blog categories', async () => {
    const { docs } = await payload.find({
      collection: 'blog',
      locale: 'all',
      depth: 0,
      pagination: false,
      where: { ...published, categories: { exists: true } },
      select: { slug: true, categories: true, updatedAt: true },
    })
    return docs
  })
  const categoryPages = new Map<
    BlogCategory,
    { locales: Set<Locale>; updatedAt: string }
  >()
  for (const post of categorized) {
    // With locale 'all', localized fields come back as { en, bg }.
    const slugs = (post.slug ?? {}) as unknown as Partial<Record<Locale, string>>
    const locales = (Object.keys(slugs) as Locale[]).filter((l) => slugs[l])
    for (const category of post.categories ?? []) {
      if (!isBlogCategory(category)) continue
      const page = categoryPages.get(category) ?? {
        locales: new Set<Locale>(),
        updatedAt: post.updatedAt,
      }
      locales.forEach((l) => page.locales.add(l))
      if (page.updatedAt < post.updatedAt) page.updatedAt = post.updatedAt
      categoryPages.set(category, page)
    }
  }
  const categoryEntries = [...categoryPages].flatMap(([category, page]) =>
    entries(
      Object.fromEntries(
        [...page.locales].map((locale) => [locale, blogCategoryPath(category)]),
      ),
      page.updatedAt,
    ),
  )

  return [
    ...staticEntries,
    ...detailEntries.flat(),
    ...authorEntries,
    ...categoryEntries,
  ]
}
