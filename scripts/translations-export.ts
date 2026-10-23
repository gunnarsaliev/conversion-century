// Exports every localized field that has English text but no Bulgarian yet,
// one file per collection in `translations/<slug>.json`, for a translator to
// fill in the `bg` values (see translations/README.md). Fields that already
// have Bulgarian text are left out.
//
// Run with: pnpm translations:export [services blog …]
// Then:     pnpm translations:import (see scripts/translations-import.ts)
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload, type CollectionSlug } from 'payload'

import config from '../payload.config'
import {
  isBlank,
  leafPaths,
  localizedLeaves,
  readArgs,
  richTextNodes,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  translatableCollections,
  TRANSLATIONS_DIR,
  getAt,
  type Entry,
  type TranslationDoc,
  type TranslationFile,
} from './lib/translations'

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length

async function exportTranslations() {
  const payload = await getPayload({ config })
  const { collections: only } = readArgs()
  const slugs = translatableCollections(payload).filter((slug) => !only || only.includes(slug))

  if (slugs.length === 0) {
    throw new Error(`No translatable collections match: ${only?.join(', ')}`)
  }

  mkdirSync(TRANSLATIONS_DIR, { recursive: true })

  for (const slug of slugs) {
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

    const file: TranslationFile = {
      collection: slug,
      sourceLocale: SOURCE_LOCALE,
      targetLocale: TARGET_LOCALE,
      exportedAt: new Date().toISOString(),
      docs,
    }
    const outPath = path.join(TRANSLATIONS_DIR, `${slug}.json`)
    writeFileSync(outPath, `${JSON.stringify(file, null, 2)}\n`)

    const fieldCount = docs.reduce((sum, doc) => sum + doc.fields.length, 0)
    console.log(
      `${slug.padEnd(16)} ${String(docs.length).padStart(4)} docs  ${String(fieldCount).padStart(5)} fields  ${String(words).padStart(6)} words  → ${outPath}`,
    )
  }
}

// `payload run` calls process.exit() as soon as this module finishes loading,
// so the export must be awaited at the top level.
await exportTranslations()
