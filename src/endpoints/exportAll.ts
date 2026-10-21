import { strToU8, zipSync } from 'fflate'
import type { CollectionSlug, Endpoint } from 'payload'
import { isAdmin } from '../lib/roles'

// GET /api/export-all — every document of every content collection as one
// ZIP, for backups or moving data between environments. Admins only.
//
// The archive holds, per collection, `json/<slug>.json` (the documents as
// Payload returns them) and `csv/<slug>.csv` (the same documents flattened to
// one row each), plus `manifest.json` with the export time and counts.
//
// Documents are read at depth 0 (relationships stay ids, so the files can be
// re-imported without duplicating related docs) and in all locales, so
// localized fields come back as { en, bg } (CSV columns `name_en`,
// `name_bg`). Media docs carry their metadata and URLs; the files themselves
// stay in storage. Payload never returns password hashes or salts, so user
// docs are safe to include.

// Payload's own bookkeeping and the import/export plugin's job collections.
const isInternal = (slug: string) =>
  slug.startsWith('payload-') || slug === 'exports' || slug === 'imports'

// Lexical rich text is kept whole (as JSON in one cell) rather than exploded
// into hundreds of columns.
const isRichText = (value: object) => 'root' in value

// Nested groups, arrays and locales become `parent_child` / `items_0_title`
// columns, the same naming the import/export plugin's CSVs use.
function flatten(value: unknown, key: string, row: Record<string, string>) {
  if (value === null || value === undefined) {
    row[key] = ''
  } else if (Array.isArray(value)) {
    if (value.length === 0) row[key] = ''
    value.forEach((item, index) => flatten(item, `${key}_${index}`, row))
  } else if (typeof value === 'object' && !isRichText(value)) {
    for (const [child, childValue] of Object.entries(value)) {
      flatten(childValue, key ? `${key}_${child}` : child, row)
    }
  } else {
    row[key] = typeof value === 'object' ? JSON.stringify(value) : String(value)
  }
}

const csvCell = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

function toCsv(docs: unknown[]): string {
  const rows = docs.map((doc) => {
    const row: Record<string, string> = {}
    flatten(doc, '', row)
    return row
  })
  // Every column any document has, in first-seen order, with `id` first.
  const columns = [...new Set(['id', ...rows.flatMap((row) => Object.keys(row))])]
  const lines = [
    columns.map(csvCell).join(','),
    ...rows.map((row) => columns.map((column) => csvCell(row[column] ?? '')).join(',')),
  ]
  // BOM so Excel reads the Cyrillic text as UTF-8.
  return `﻿${lines.join('\r\n')}\r\n`
}

export const exportAll: Endpoint = {
  path: '/export-all',
  method: 'get',
  handler: async (req) => {
    if (!isAdmin(req.user)) {
      return Response.json({ error: 'Only admins can export data.' }, { status: 403 })
    }

    const slugs = req.payload.config.collections
      .map((collection) => collection.slug)
      .filter((slug) => !isInternal(slug)) as CollectionSlug[]

    const files: Record<string, Uint8Array> = {}
    const counts: Record<string, number> = {}
    for (const slug of slugs) {
      const { docs } = await req.payload.find({
        collection: slug,
        depth: 0,
        locale: 'all',
        pagination: false,
        req,
      })
      counts[slug] = docs.length
      files[`json/${slug}.json`] = strToU8(JSON.stringify(docs, null, 2))
      files[`csv/${slug}.csv`] = strToU8(toCsv(docs))
    }

    const exportedAt = new Date().toISOString()
    files['manifest.json'] = strToU8(JSON.stringify({ exportedAt, counts }, null, 2))

    const zip = zipSync(files, { level: 6 })

    return new Response(zip, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="conversion-century-export-${exportedAt.slice(0, 10)}.zip"`,
        'Cache-Control': 'private, no-store',
      },
    })
  },
}
