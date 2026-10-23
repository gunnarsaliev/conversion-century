// Imports the Ayurvedabio fixture (src/data/offers/ayurvedabio-seo-migration.json)
// into the Offers collection, so /offers has a real record to show.
// Safe to re-run: the client's offer is matched and updated.
//
// Run with: pnpm seed:offers
//
// Needs an existing client whose company name contains "Ayurveda" and a
// service whose Bulgarian or English name contains "миграц"/"migration".
// The fixture's recommended package becomes the offer's services, priced as
// Σ hours × each service's hourly rate: its 25 hours go to the migration
// service, and if it has no rate yet it's set to 100 €/h (→ 2 500 €). A
// package without hours keeps its price as a fixed price.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../payload.config'
import type { Offer as OfferFixture } from '../src/types/offer'

const FIXTURE = path.resolve(process.cwd(), 'src/data/offers/ayurvedabio-seo-migration.json')
const DEFAULT_HOURLY_RATE = 100

async function seedOffers() {
  const fixture = JSON.parse(readFileSync(FIXTURE, 'utf8')) as OfferFixture
  const payload = await getPayload({ config })

  const { docs: clients } = await payload.find({
    collection: 'clients',
    where: { companyName: { like: 'Ayurveda' } },
    limit: 1,
    depth: 0,
  })
  const { docs: services } = await payload.find({
    collection: 'services',
    locale: 'bg',
    where: {
      or: [{ name: { like: 'миграц' } }, { name: { like: 'migration' } }],
    },
    limit: 1,
    depth: 0,
  })
  const client = clients[0]
  const service = services[0]
  if (!client || !service) {
    console.error(
      [
        !client && 'No client whose company name contains "Ayurveda".',
        !service && 'No service whose name contains "миграц" or "migration".',
        'Create them in the admin panel, then run this again. Nothing was imported.',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    return
  }

  if (typeof service.price !== 'number') {
    await payload.update({
      collection: 'services',
      id: service.id,
      data: { price: DEFAULT_HOURLY_RATE },
    })
    console.log(`set ${service.name} hourly rate to ${DEFAULT_HOURLY_RATE} €`)
  }

  const pkg = fixture.packages.find((p) => p.recommended) ?? fixture.packages[0]
  const data = {
    client: client.id,
    status: 'draft' as const,
    date: fixture.date,
    validUntil: fixture.validUntil,
    metrics: {
      ...fixture.metrics,
      source: fixture.metrics.source.toLowerCase() as 'manual' | 'ahrefs' | 'semrush' | 'other',
    },
    keywords: fixture.keywords,
    // Quoted in hours → priced from the service rate; otherwise fixed.
    services: pkg.hours === undefined ? [] : [{ service: service.id, hours: pkg.hours }],
    fixedPrice: pkg.hours === undefined ? pkg.price : undefined,
  }

  const { docs } = await payload.find({
    collection: 'offers',
    where: { client: { equals: client.id } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) {
    await payload.update({ collection: 'offers', id: docs[0].id, data })
    console.log(`updated offer ${docs[0].id} for ${client.companyName}`)
  } else {
    const created = await payload.create({ collection: 'offers', data })
    console.log(`created offer ${created.id} for ${client.companyName}`)
  }
}

// `payload run` calls process.exit() as soon as this module finishes loading,
// so the seed must be awaited at the top level.
await seedOffers()
