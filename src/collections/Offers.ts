import type { CollectionConfig, FieldHook, PayloadRequest } from 'payload'

// A commercial offer prepared for one client, rendered at
// /website/offers/[id] (and as a PDF). Only the per-client values live here;
// the template copy shared by every offer is in src/data/offers/static.json.
// Offers are written in Bulgarian, so nothing is localized.

const isAdmin = ({ req: { user } }: { req: { user?: { role?: string | null } | null } }) =>
  user?.role === 'admin'

type PackageLine = { service?: number | { id: number; price?: number | null } | null; hours?: number | null }

const lineServiceId = (line: PackageLine) =>
  typeof line.service === 'object' ? line.service?.id : line.service

// Hourly rates (Services.price) by service id, memoised on the request so an
// offer with several packages reads the services once.
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

// A package's total hours: the sum of its service lines.
const sumPackageHours: FieldHook = ({ siblingData }) => {
  const lines = (siblingData?.services ?? []) as PackageLine[]
  return lines.length > 0 ? lines.reduce((sum, line) => sum + (line.hours ?? 0), 0) : null
}

// A package's price: its fixed price if set, otherwise the sum of each
// line's hours × that service's hourly rate. Null when a line's service has
// no rate, so a missing rate is never priced as 0. Computed on read, so
// changing a service's rate reprices its offers.
const calculatePackagePrice: FieldHook = async ({ siblingData, req }) => {
  if (typeof siblingData?.fixedPrice === 'number') return siblingData.fixedPrice
  const lines = (siblingData?.services ?? []) as PackageLine[]
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
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'validUntil', 'updatedAt'],
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
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal name, e.g. "SEO миграция – Ayurvedabio".' },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        position: 'sidebar',
        description: 'Services in this offer. Their hourly rates price the packages.',
      },
    },
    {
      name: 'preparedBy',
      type: 'relationship',
      relationTo: 'users',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'validUntil',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'siteType',
      type: 'text',
      required: true,
      admin: { description: 'Appended to some headings, e.g. "био магазин".' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Audit',
          fields: [
            {
              name: 'metrics',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'source', type: 'text', defaultValue: 'Ahrefs' },
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
        },
        {
          label: 'Scope',
          fields: [
            { name: 'startLabel', type: 'text', admin: { description: 'e.g. "Старт 1-ви октомври".' } },
            {
              name: 'timeline',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'startWeek', type: 'number', required: true, min: 1 },
                    { name: 'endWeek', type: 'number', required: true, min: 1 },
                  ],
                },
                { name: 'description', type: 'textarea' },
              ],
            },
            { name: 'responsibilities', type: 'textarea' },
            {
              name: 'content',
              type: 'group',
              admin: {
                description: 'Fills placeholders like {blogArticles} in the content strategy text.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'blogArticles', type: 'number', min: 0, defaultValue: 0 },
                    { name: 'categoryPages', type: 'number', min: 0, defaultValue: 0 },
                    { name: 'brandPages', type: 'number', min: 0, defaultValue: 0 },
                  ],
                },
              ],
            },
            { name: 'supportWeeks', type: 'number', min: 0 },
            {
              name: 'team',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'scopeSummary',
              type: 'array',
              admin: { description: 'Summary points shown above the packages.' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'text', type: 'textarea', required: true },
              ],
            },
            {
              name: 'packages',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                {
                  // Hours per service, e.g. SEO миграция 15 h + Писане 10 h.
                  name: 'services',
                  type: 'array',
                  labels: { singular: 'Service', plural: 'Services' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'service',
                          type: 'relationship',
                          relationTo: 'services',
                          required: true,
                          // Only the services selected on this offer.
                          filterOptions: ({ data }) => {
                            const ids = ((data?.services ?? []) as (number | { id: number })[]).map(
                              (service) => (typeof service === 'object' ? service.id : service),
                            )
                            return { id: { in: ids } }
                          },
                        },
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
                      hooks: { afterRead: [sumPackageHours] },
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
                      hooks: { afterRead: [calculatePackagePrice] },
                    },
                  ],
                },
                { name: 'recommended', type: 'checkbox', defaultValue: false },
                {
                  name: 'features',
                  type: 'array',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
