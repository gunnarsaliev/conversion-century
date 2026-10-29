import { getPayload } from 'payload'
import config from '@payload-config'

import { cmsCache } from '@/lib/cms/cache'
import { IS_INDEXABLE, ORGANIZATION, SITE_NAME, localizedUrl } from '@/lib/seo/site'
import { translated } from '@/utilities/findByLocalizedSlug'

// /llms.txt (llmstxt.org): a Markdown map of the site for AI assistants and
// answer engines. Google doesn't use it; it's a cheap hint for the others.
// English only, built from the CMS and cached like the pages it lists. Its
// fixed, dotted path keeps src/proxy.ts from locale-rewriting it.

const POSTS_LIMIT = 30

type Entry = { name: string; path: string; summary?: string | null }

async function getEntries() {
  'use cache'
  cmsCache('services', 'solutions', 'industries', 'case-studies', 'blog')
  const payload = await getPayload({ config })
  const published = { ...translated, _status: { equals: 'published' } }

  const [services, solutions, industries, caseStudies, posts] = await Promise.all([
    payload.find({
      collection: 'services',
      locale: 'en',
      where: translated,
      depth: 0,
      pagination: false,
      sort: 'name',
      select: { name: true, slug: true, meta: { description: true } },
    }),
    payload.find({
      collection: 'solutions',
      locale: 'en',
      where: translated,
      depth: 0,
      pagination: false,
      sort: 'name',
      select: { name: true, slug: true, meta: { description: true } },
    }),
    payload.find({
      collection: 'industries',
      locale: 'en',
      where: published,
      depth: 0,
      pagination: false,
      sort: 'title',
      select: { title: true, slug: true, meta: { description: true } },
    }),
    payload.find({
      collection: 'case-studies',
      locale: 'en',
      where: translated,
      depth: 0,
      pagination: false,
      sort: '-createdAt',
      select: { title: true, slug: true, overview: true, meta: { description: true } },
    }),
    payload.find({
      collection: 'blog',
      locale: 'en',
      where: published,
      depth: 0,
      limit: POSTS_LIMIT,
      sort: '-publishedAt',
      select: { title: true, slug: true, excerpt: true, meta: { description: true } },
    }),
  ])

  return {
    services: services.docs.map<Entry>((doc) => ({
      name: doc.name,
      path: `/services/${doc.slug}`,
      summary: doc.meta?.description,
    })),
    solutions: solutions.docs.map<Entry>((doc) => ({
      name: doc.name,
      path: `/solutions/${doc.slug}`,
      summary: doc.meta?.description,
    })),
    industries: industries.docs.map<Entry>((doc) => ({
      name: doc.title,
      path: `/industries/${doc.slug}`,
      summary: doc.meta?.description,
    })),
    caseStudies: caseStudies.docs.map<Entry>((doc) => ({
      name: doc.title,
      path: `/case-studies/${doc.slug}`,
      summary: doc.meta?.description || doc.overview,
    })),
    posts: posts.docs.map<Entry>((doc) => ({
      name: doc.title,
      path: `/blog/${doc.slug}`,
      summary: doc.meta?.description || doc.excerpt,
    })),
  }
}

function section(heading: string, entries: Entry[]) {
  if (entries.length === 0) return ''
  const lines = entries.map(({ name, path, summary }) => {
    const text = summary?.replace(/\s+/g, ' ').trim()
    return `- [${name}](${localizedUrl(path, 'en')})${text ? `: ${text}` : ''}`
  })
  return `## ${heading}\n\n${lines.join('\n')}\n`
}

export async function GET() {
  if (!IS_INDEXABLE) return new Response('Not found', { status: 404 })

  const { services, solutions, industries, caseStudies, posts } = await getEntries()
  const page = (path: string) => localizedUrl(path, 'en')

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} (${ORGANIZATION.legalName}) is an SEO agency based in Sofia, Bulgaria. It grows organic traffic, rankings and AI search visibility for businesses across Bulgaria and Europe. The site is available in English and Bulgarian (${localizedUrl('/', 'bg')}).`,
    '',
    `Contact: ${ORGANIZATION.email}, ${ORGANIZATION.telephone}. Book a free consultation: ${page('/book-a-consultation')}`,
    '',
    section('Services', services),
    section('Solutions', solutions),
    section('Industries', industries),
    section('Case studies', caseStudies),
    section('Latest blog posts', posts),
    '## Company',
    '',
    `- [About](${page('/about')})`,
    `- [Clients](${page('/clients')})`,
    `- [Reviews](${page('/reviews')})`,
    `- [Open positions](${page('/open-positions')})`,
    `- [Privacy Policy](${page('/legal/privacy-policy')})`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
