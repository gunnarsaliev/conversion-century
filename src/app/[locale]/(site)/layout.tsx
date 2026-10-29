import { cacheLife } from 'next/cache'
import { setRequestLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { cmsCache } from '@/lib/cms/cache'
import { BackgroundPattern27 } from '@/components/background-pattern27'
import { Footer3 } from '@/components/footer3'
import { Navbar3 } from '@/components/navbar3'
import type { Media } from '../../../../payload-types'
import { translated, untranslatedHrefs } from '@/utilities/findByLocalizedSlug'

// The navbar's "latest posts" preview. Cached across requests.
async function getNavbarBlogPosts(locale: string) {
  'use cache'
  cmsCache('blog', 'media')
  const payload = await getPayload({ config })

  const { docs: latestPosts } = await payload.find({
    collection: 'blog',
    locale: locale as 'en' | 'bg',
    depth: 1,
    limit: 2,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
      ...translated,
    },
  })

  return latestPosts.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === 'object'
        ? (post.featuredImage as Media)
        : null

    return {
      title: post.title,
      href: `/blog/${post.slug ?? post.id}`,
      image: image?.url ?? '',
      alt: image?.alt ?? post.title,
    }
  })
}

// The footer's copyright year. Prerendered pages can't read the clock, so
// it's cached and re-read daily.
async function getCurrentYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [navbarBlogPosts, hiddenHrefs, year] = await Promise.all([
    getNavbarBlogPosts(locale),
    untranslatedHrefs(locale),
    getCurrentYear(),
  ])

  return (
    <div className="relative isolate w-full min-w-0 overflow-x-clip">
      <BackgroundPattern27 />
      <Navbar3 blogPosts={navbarBlogPosts} hiddenHrefs={hiddenHrefs} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
        <Footer3 hiddenHrefs={hiddenHrefs} year={year} />
      </div>
    </div>
  )
}
