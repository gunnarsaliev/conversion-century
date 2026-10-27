import type { PayloadRequest } from 'payload'

// Keeps Client Progress in step with the services a client has: every
// checklist item of a client's service gets a "not started" progress row.
// Both helpers take `req` so they run in the same transaction as the save
// that triggered them.

type ID = string | number

export const relationId = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value
    ? (value as { id: ID }).id
    : (value as ID | null | undefined)

export const relationIds = (value: unknown): ID[] =>
  Array.isArray(value)
    ? value.map(relationId).filter((id): id is ID => id != null)
    : []

// Creates the missing "not started" rows for each client × checklist item of
// the given services. Existing rows (whatever their status) are left alone.
export const assignChecklistItems = async ({
  req,
  clientIds,
  serviceIds,
}: {
  req: PayloadRequest
  clientIds: ID[]
  serviceIds: ID[]
}) => {
  if (clientIds.length === 0 || serviceIds.length === 0) return

  const items = await req.payload.find({
    collection: 'work-checklist',
    where: { service: { in: serviceIds } },
    pagination: false,
    depth: 0,
    select: {},
    req,
  })
  if (items.docs.length === 0) return

  const itemIds = items.docs.map((item) => item.id)

  const existing = await req.payload.find({
    collection: 'client-checklist-progress',
    where: {
      and: [{ client: { in: clientIds } }, { checklistItem: { in: itemIds } }],
    },
    pagination: false,
    depth: 0,
    select: { client: true, checklistItem: true },
    req,
  })
  const existingPairs = new Set(
    existing.docs.map(
      (row) => `${relationId(row.client)}:${relationId(row.checklistItem)}`,
    ),
  )

  for (const clientId of clientIds) {
    for (const itemId of itemIds) {
      if (existingPairs.has(`${clientId}:${itemId}`)) continue
      await req.payload.create({
        collection: 'client-checklist-progress',
        data: {
          client: clientId as number,
          checklistItem: itemId,
          status: 'not-started',
        },
        req,
      })
    }
  }
}

// Removes a client's progress rows for the given services that were never
// started. Rows that are in progress or done are kept.
export const removeUntouchedChecklistItems = async ({
  req,
  clientId,
  serviceIds,
}: {
  req: PayloadRequest
  clientId: ID
  serviceIds: ID[]
}) => {
  if (serviceIds.length === 0) return

  await req.payload.delete({
    collection: 'client-checklist-progress',
    where: {
      and: [
        { client: { equals: clientId } },
        { 'checklistItem.service': { in: serviceIds } },
        { status: { equals: 'not-started' } },
      ],
    },
    req,
  })
}
