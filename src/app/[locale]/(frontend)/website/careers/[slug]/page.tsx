import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import JobListing from '@/components/job-listing'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'job-listings',
    locale: locale as 'en' | 'bg',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })

  const listing = docs[0] ?? null

  if (!listing) {
    notFound()
  }

  return (
    <JobListing
      title={listing.title}
      type={listing.type}
      location={listing.location}
      requirements={listing.requirements}
      offer={listing.offer}
    />
  )
}
