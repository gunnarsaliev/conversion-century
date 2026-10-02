import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import JobListing from '@/components/job-listing'
import { JsonLd } from '@/components/json-ld'
import { richTextToPlainText } from '@/lib/rich-text-to-plain-text'
import { buildMetadata, truncate } from '@/lib/seo/metadata'
import { localizedDocPath, pageBreadcrumbs } from '@/lib/seo/pages'
import { graph, jobPostingSchema } from '@/lib/seo/schema'
import { toLocale } from '@/lib/seo/site'
import type { JobListing as JobListingDoc } from '../../../../../../../payload-types'

type PageProps = {
  params: Promise<{ slug: string }>
}

// Shared by generateMetadata and the page so the lookup runs once per
// request.
const getListing = cache(async (slug: string, locale: string) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'job-listings',
    locale: locale as 'en' | 'bg',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })

  return docs[0] ?? null
})

const plainDescription = (listing: JobListingDoc) =>
  [richTextToPlainText(listing.requirements), richTextToPlainText(listing.offer)]
    .filter(Boolean)
    .join(' ')

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const listing = await getListing(slug, locale)

  if (!listing) return {}

  return buildMetadata({
    title: listing.title,
    description: truncate(plainDescription(listing)),
    path: await localizedDocPath('job-listings', listing.id, '/website/careers'),
    locale: toLocale(locale),
  })
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const listing = await getListing(slug, locale)

  if (!listing) {
    notFound()
  }

  const seoLocale = toLocale(locale)
  const path = await localizedDocPath('job-listings', listing.id, '/website/careers')

  return (
    <>
      <JsonLd
        data={graph(
          await pageBreadcrumbs(seoLocale, ['openPositions', { name: listing.title, path }]),
          jobPostingSchema({
            locale: seoLocale,
            path,
            title: listing.title,
            description: plainDescription(listing) || listing.title,
            datePosted: listing.createdAt,
            employmentType: listing.type,
            location: listing.location,
          }),
        )}
      />
      <JobListing
        title={listing.title}
        type={listing.type}
        location={listing.location}
        requirements={listing.requirements}
        offer={listing.offer}
      />
    </>
  )
}
