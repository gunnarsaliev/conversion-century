import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import JobListing from '@/components/job-listing'
import { JsonLd } from '@/components/json-ld'
import { richTextToPlainText } from '@/lib/rich-text-to-plain-text'
import { buildMetadata, truncate } from '@/lib/seo/metadata'
import { localizedDocPath, pageBreadcrumbs } from '@/lib/seo/pages'
import { graph, jobPostingSchema } from '@/lib/seo/schema'
import { toLocale } from '@/lib/seo/site'
import { slugStaticParams } from '@/lib/cms/slugs'
import { findByLocalizedSlug } from '@/utilities/findByLocalizedSlug'
import type { JobListing as JobListingDoc } from '../../../../../../payload-types'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

// Shared by generateMetadata and the page so the lookup runs once per
// request.
const getListing = cache((slug: string, locale: string) =>
  findByLocalizedSlug('job-listings', slug, locale, { depth: 0 }),
)

const plainDescription = (listing: JobListingDoc) =>
  [
    richTextToPlainText(listing.description),
    richTextToPlainText(listing.responsibilities),
    richTextToPlainText(listing.requirements),
    richTextToPlainText(listing.offer),
  ]
    .filter(Boolean)
    .join(' ')

// Published docs are prerendered at build; new ones render on first visit
// and are then cached.
export const generateStaticParams = slugStaticParams('job-listings')

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const listing = await getListing(slug, locale)

  if (!listing) return {}

  return buildMetadata({
    title: listing.title,
    description: truncate(plainDescription(listing)),
    path: await localizedDocPath('job-listings', listing.id, '/careers'),
    locale: toLocale(locale),
  })
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const listing = await getListing(slug, locale)

  if (!listing) {
    notFound()
  }

  const seoLocale = toLocale(locale)
  const path = await localizedDocPath('job-listings', listing.id, '/careers')

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
        description={listing.description}
        responsibilities={listing.responsibilities}
        requirements={listing.requirements}
        offer={listing.offer}
      />
    </>
  )
}
