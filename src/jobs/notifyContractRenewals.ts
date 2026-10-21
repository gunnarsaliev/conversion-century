import type { TaskConfig } from 'payload'
import { clientHref, createNotification } from '../lib/notifications'

// A client's Contract Date is its renewal date. Every morning this task
// notifies the dashboard about each client whose renewal date is today.
// It also looks back CATCH_UP_DAYS so a renewal isn't missed when the server
// was down on the day; the dedupe key (client + date) keeps re-runs and the
// look-back from notifying twice, while next year's date gets a new key.

const CATCH_UP_DAYS = 7

export const notifyContractRenewals: TaskConfig<'notifyContractRenewals'> = {
  slug: 'notifyContractRenewals',
  schedule: [{ cron: '0 6 * * *', queue: 'default' }],
  retries: 2,
  handler: async ({ req }) => {
    const endOfToday = new Date()
    endOfToday.setUTCHours(23, 59, 59, 999)
    const from = new Date(endOfToday)
    from.setUTCDate(from.getUTCDate() - CATCH_UP_DAYS)
    from.setUTCHours(0, 0, 0, 0)

    const { docs } = await req.payload.find({
      collection: 'clients',
      where: {
        and: [
          { contractDate: { greater_than_equal: from.toISOString() } },
          { contractDate: { less_than_equal: endOfToday.toISOString() } },
        ],
      },
      select: { companyName: true, contractDate: true, status: true },
      pagination: false,
      depth: 0,
      req,
    })

    let created = 0
    for (const client of docs) {
      if (!client.contractDate) continue
      const date = client.contractDate.slice(0, 10)
      const ok = await createNotification(
        req.payload,
        {
          type: 'contract-renewal',
          title: `Contract renewal: ${client.companyName}`,
          message: `The contract renews on ${date}.`,
          href: clientHref(client),
          dedupeKey: `contract-renewal-${client.id}-${date}`,
        },
        req,
      )
      if (ok) created++
    }

    return { output: { created } }
  },
}
