import type { CollectionSlug, Payload } from 'payload'

import {
  getAt,
  isBlank,
  leafPaths,
  localizedLeaves,
  richTextNodes,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  type Entry,
  type TranslationDoc,
  type TranslationFile,
} from './core'

// ---------------------------------------------------------------------------
// Export: localized fields with English text but no Bulgarian yet
// ---------------------------------------------------------------------------
//
// One TranslationFile per collection, for a translator to fill in the `bg`
// values. Fields that already have Bulgarian text are left out.

export type ExportSummary = { docs: number; fields: number; words: number }

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length

export async function exportCollection(
  payload: Payload,
  slug: string,
): Promise<{ file: TranslationFile; summary: ExportSummary }> {
  const collection = payload.collections[slug as CollectionSlug].config
  const leaves = localizedLeaves(collection.fields)
  const titleField = collection.admin?.useAsTitle

  const read = (locale: string) =>
    payload.find({
      collection: slug as CollectionSlug,
      locale: locale as 'en' | 'bg',
      fallbackLocale: false,
      depth: 0,
      pagination: false,
      sort: 'id',
    })

  const [{ docs: enDocs }, { docs: bgDocs }] = await Promise.all([
    read(SOURCE_LOCALE),
    read(TARGET_LOCALE),
  ])
  const bgById = new Map(bgDocs.map((doc) => [String(doc.id), doc]))

  const docs: TranslationDoc[] = []
  let words = 0

  for (const enDoc of enDocs) {
    const bgDoc = bgById.get(String(enDoc.id)) ?? {}
    const fields: Entry[] = []

    for (const leaf of leaves) {
      for (const fieldPath of leafPaths(enDoc, leaf)) {
        const en = getAt(enDoc, fieldPath)
        const bg = getAt(bgDoc, fieldPath)
        const required = leaf.required ? ({ required: true } as const) : {}

        if (leaf.kind === 'richText') {
          const enNodes = richTextNodes(en)
          if (enNodes.length === 0 || richTextNodes(bg).length > 0) continue
          for (const node of enNodes) {
            fields.push({ path: `${fieldPath}#${node.nodePath}`, en: node.text, bg: '', ...required })
            words += wordCount(node.text)
          }
        } else if (typeof en === 'string' && !isBlank(en) && isBlank(bg)) {
          fields.push({ path: fieldPath, en, bg: '', ...required })
          words += wordCount(en)
        }
      }
    }

    if (fields.length > 0) {
      const label = titleField ? getAt(enDoc, titleField) : undefined
      docs.push({ id: enDoc.id, label: typeof label === 'string' ? label : String(enDoc.id), fields })
    }
  }

  return {
    file: {
      collection: slug,
      sourceLocale: SOURCE_LOCALE,
      targetLocale: TARGET_LOCALE,
      exportedAt: new Date().toISOString(),
      docs,
    },
    summary: {
      docs: docs.length,
      fields: docs.reduce((sum, doc) => sum + doc.fields.length, 0),
      words,
    },
  }
}
