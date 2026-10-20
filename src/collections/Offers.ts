import type { CollectionConfig, FieldHook, PayloadRequest } from 'payload'

// A commercial offer prepared for one client, rendered at
// /website/offers/[id] (and as a PDF). Only the per-client values live here;
// the template copy shared by every offer is in src/data/offers/static.json.
// Offers are written in Bulgarian, so nothing is localized.

const isAdmin = ({ req: { user } }: { req: { user?: { role?: string | null } | null } }) =>
  user?.role === 'admin'

// Where the audit metrics came from. The offer page prints the label.
export const metricsSourceOptions = [
  { label: 'Manual', value: 'manual' },
  { label: 'Ahrefs', value: 'ahrefs' },
  { label: 'Semrush', value: 'semrush' },
  { label: 'Other', value: 'other' },
]

// How long an offer is valid by default, counted from its date.
const VALIDITY_WEEKS = 5

const addWeeks = (date: Date, weeks: number) =>
  new Date(date.getTime() + weeks * 7 * 24 * 60 * 60 * 1000)

type ServiceLine = { service?: number | { id: number; price?: number | null } | null; hours?: number | null }

const lineServiceId = (line: ServiceLine) =>
  typeof line.service === 'object' ? line.service?.id : line.service

// Hourly rates (Services.price) by service id, memoised on the request so a
// list of offers reads each service once.
async function getServiceRates(
  ids: number[],
  req: PayloadRequest,
): Promise<Map<number, number | null>> {
  const rates = (req.context.serviceRates ??= new Map()) as Map<number, number | null>
  const missing = ids.filter((id) => !rates.has(id))
  if (missing.length > 0) {
    const { docs } = await req.payload.find({
      collection: 'services',
      where: { id: { in: missing } },
      select: { price: true },
      depth: 0,
      limit: missing.length,
      pagination: false,
      req,
    })
    for (const id of missing) rates.set(id, null)
    for (const doc of docs) rates.set(doc.id, doc.price ?? null)
  }
  return rates
}

// The offer's total hours: the sum of its service lines.
const sumHours: FieldHook = ({ siblingData }) => {
  const lines = (siblingData?.services ?? []) as ServiceLine[]
  return lines.length > 0 ? lines.reduce((sum, line) => sum + (line.hours ?? 0), 0) : null
}

// The offer's price: its fixed price if set, otherwise the sum of each
// line's hours × that service's hourly rate. Null when a line's service has
// no rate, so a missing rate is never priced as 0. Computed on read, so
// changing a service's rate reprices its offers.
const calculatePrice: FieldHook = async ({ siblingData, req }) => {
  if (typeof siblingData?.fixedPrice === 'number') return siblingData.fixedPrice
  const lines = (siblingData?.services ?? []) as ServiceLine[]
  if (lines.length === 0) return null

  // Only services that aren't already populated need their rate looked up.
  const ids = lines.flatMap((line) => (typeof line.service === 'number' ? [line.service] : []))
  const rates = await getServiceRates(ids, req)

  let total = 0
  for (const line of lines) {
    const id = lineServiceId(line)
    const rate =
      typeof line.service === 'object' && typeof line.service?.price === 'number'
        ? line.service.price
        : typeof id === 'number'
          ? rates.get(id)
          : null
    if (typeof rate !== 'number' || typeof line.hours !== 'number') return null
    total += line.hours * rate
  }
  return total
}

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: {
    defaultColumns: ['id', 'client', 'status', 'validUntil', 'updatedAt'],
  },
  access: {
    // Offers are private: signed-in users can read them, admins manage them.
    read: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'preparedBy',
      type: 'relationship',
      relationTo: 'users',
      // The signed-in user creating the offer.
      defaultValue: ({ user }) => user?.id,
      admin: { position: 'sidebar', description: 'Shown as "Оферта от".' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Declined', value: 'declined' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'validUntil',
      type: 'date',
      required: true,
      // 5 weeks from `date`, which defaults to today.
      defaultValue: () => addWeeks(new Date(), VALIDITY_WEEKS).toISOString(),
      hooks: {
        // Offers created without an expiry (e.g. via the API) get one from their date.
        beforeValidate: [
          ({ value, siblingData }) =>
            value ??
            (siblingData?.date
              ? addWeeks(new Date(siblingData.date), VALIDITY_WEEKS).toISOString()
              : value),
        ],
      },
      admin: { position: 'sidebar' },
    },
    {
      // Hours per service, e.g. SEO миграция 15 h + Писане 10 h.
      name: 'services',
      type: 'array',
      labels: { singular: 'Service', plural: 'Services' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'service', type: 'relationship', relationTo: 'services', required: true },
            { name: 'hours', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fixedPrice',
          label: 'Fixed price (EUR)',
          type: 'number',
          min: 0,
          admin: { description: 'Overrides the calculated price.' },
        },
        {
          name: 'hours',
          label: 'Total hours',
          type: 'number',
          virtual: true,
          admin: { readOnly: true },
          hooks: { afterRead: [sumHours] },
        },
        {
          name: 'price',
          label: 'Price (EUR)',
          type: 'number',
          virtual: true,
          admin: {
            readOnly: true,
            description: 'Fixed price, or Σ hours × each service’s hourly rate.',
          },
          hooks: { afterRead: [calculatePrice] },
        },
      ],
    },
    { name: 'description', type: 'richText' },
    {
      name: 'metrics',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'source',
              type: 'select',
              defaultValue: 'manual',
              options: metricsSourceOptions,
            },
            { name: 'date', type: 'date' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'domainRating', label: 'Domain Rating', type: 'number', min: 0, max: 100 },
            { name: 'backlinks', type: 'number', min: 0 },
            { name: 'organicKeywords', type: 'number', min: 0 },
            { name: 'organicTraffic', label: 'Organic traffic / month', type: 'number', min: 0 },
          ],
        },
      ],
    },
    {
      name: 'keywords',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'keyword', type: 'text', required: true },
            { name: 'position', type: 'number', required: true, min: 1 },
            { name: 'volume', label: 'Searches / month', type: 'number', required: true, min: 0 },
          ],
        },
      ],
    },
  ],
}
