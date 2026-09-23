import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Providers } from '@/app/[locale]/(frontend)/providers'
import { BackgroundPattern27 } from '@/components/background-pattern27'
import { Footer3 } from '@/components/footer3'
import { Navbar3 } from '@/components/navbar3'
import type { Media } from '../../../../../payload-types'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const payload = await getPayload({ config })

  const { docs: latestPosts } = await payload.find({
    collection: 'blog',
    locale: locale as 'en' | 'bg',
    depth: 1,
    limit: 2,
    sort: '-publishedAt',
    where: {
      _status: { equals: 'published' },
    },
  })

  const navbarBlogPosts = latestPosts.map((post) => {
    const image =
      post.featuredImage && typeof post.featuredImage === 'object'
        ? (post.featuredImage as Media)
        : null

    return {
      title: post.title,
      href: `/website/blog/${post.slug ?? post.id}`,
      image: image?.url ?? '',
      alt: image?.alt ?? post.title,
    }
  })

  return (
    <Providers>
      <div className="relative isolate w-full min-w-0">
        <BackgroundPattern27 />
        <Navbar3 blogPosts={navbarBlogPosts} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
          <Footer3 />
        </div>
      </div>
    </Providers>
  )
}
