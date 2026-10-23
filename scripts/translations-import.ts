// Imports the Bulgarian values a translator filled into
// `translations/<slug>.json` (written by scripts/translations-export.ts).
//
// Dry run by default: prints what would change. Add `apply` to save.
//
// Run with: pnpm translations:import [services blog …] [apply]
//
// Only ever fills empty Bulgarian fields: a field someone has translated in
// the meantime is left alone, as is any field whose English text changed
// since the export (the translation may be stale). Rich text is only filled
// when every text node of that field has a translation, so a field is never
// half English. Arrays aren't localized, so rows keep their ids and the
// English rows are untouched.
//
// Before applying, take a full backup with GET /api/export-all; this script
// also saves the previous Bulgarian values of every document it changes to
// translations/backup/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload, ValidationError, type CollectionSlug } from 'payload'

import config from '../payload.config'
import {
  getAt,
  hasRichText,
  isBlank,
  readArgs,
  replaceRichText,
  richTextNodes,
  setAt,
  slugSourceField,
  splitRichTextPath,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  translatableCollections,
  TRANSLATIONS_DIR,
  type Entry,
  type TranslationFile,
} from './lib/translations'

type Counts = {
  filled: number
  existing: number
  stale: number
  missing: number
  incomplete: number
  failedDocs: number
}

const topLevelKey = (fieldPath: string) => fieldPath.split(/[.[]/)[0]

async function importTranslations() {
  const payload = await getPayload({ config })
  const { collections: only, apply } = readArgs()
  const slugs = translatableCollections(payload).filter(
    (slug) =>
      (!only || only.includes(slug)) && existsSync(path.join(TRANSLATIONS_DIR, `${slug}.json`)),
  )

  if (slugs.length === 0) {
    throw new Error(`No translation files found in ${TRANSLATIONS_DIR}/ for: ${only?.join(', ') ?? '(all)'}`)
  }

  console.log(apply ? 'Applying translations…' : 'Dry run (add `apply` to save)…')
  const backupStamp = new Date().toISOString().replace(/[:.]/g, '-')

  for (const slug of slugs) {
    const file = JSON.parse(
      readFileSync(path.join(TRANSLATIONS_DIR, `${slug}.json`), 'utf8'),
    ) as TranslationFile
    const collectionConfig = payload.collections[slug as CollectionSlug].config
    const slugSource = slugSourceField(collectionConfig.fields)
    const counts: Counts = { filled: 0, existing: 0, stale: 0, missing: 0, incomplete: 0, failedDocs: 0 }
    const backups: Record<string, unknown> = {}

    for (const doc of file.docs) {
      const translated = doc.fields.filter((entry) => !isBlank(entry.bg))
      if (translated.length === 0) continue

      const read = (locale: string) =>
        payload
          .findByID({
            collection: slug as CollectionSlug,
            id: doc.id,
            locale: locale as 'en' | 'bg',
            fallbackLocale: false,
            depth: 0,
          })
          // Walked generically by path, whatever the collection's type.
          .then((found) => found as unknown as Record<string, unknown>)
          .catch(() => null)

      const [enDoc, bgDoc] = await Promise.all([read(SOURCE_LOCALE), read(TARGET_LOCALE)])
      if (!enDoc || !bgDoc) {
        console.warn(`  ${slug} ${doc.id}: document no longer exists, skipped`)
        counts.missing += translated.length
        continue
      }

      const before = structuredClone(bgDoc)
      const changedKeys = new Set<string>()
      const log: string[] = []

      // Plain text fields.
      for (const entry of translated.filter((item) => !item.path.includes('#'))) {
        const en = getAt(enDoc, entry.path)
        const bg = getAt(bgDoc, entry.path)
        if (en === undefined) {
          counts.missing++
          log.push(`missing  ${entry.path}`)
        } else if (!isBlank(bg)) {
          counts.existing++
        } else if (en !== entry.en) {
          counts.stale++
          log.push(`stale    ${entry.path} (English changed since export)`)
        } else if (setAt(bgDoc, entry.path, entry.bg)) {
          counts.filled++
          changedKeys.add(topLevelKey(entry.path))
          log.push(`fill     ${entry.path}`)
        }
      }

      // Rich text, one field at a time.
      const richByField = new Map<string, Entry[]>()
      for (const entry of doc.fields.filter((item) => item.path.includes('#'))) {
        const { fieldPath } = splitRichTextPath(entry.path)
        richByField.set(fieldPath, [...(richByField.get(fieldPath) ?? []), entry])
      }

      for (const [fieldPath, entries] of richByField) {
        if (!entries.some((entry) => !isBlank(entry.bg))) continue
        const en = getAt(enDoc, fieldPath)
        const enNodes = new Map(richTextNodes(en).map((node) => [node.nodePath, node.text]))

        if (en === undefined) {
          counts.missing++
          log.push(`missing  ${fieldPath}`)
        } else if (hasRichText(getAt(bgDoc, fieldPath))) {
          counts.existing++
        } else if (
          enNodes.size !== entries.length ||
          entries.some((entry) => enNodes.get(splitRichTextPath(entry.path).nodePath!) !== entry.en)
        ) {
          counts.stale++
          log.push(`stale    ${fieldPath} (English rich text changed since export)`)
        } else if (entries.some((entry) => isBlank(entry.bg))) {
          counts.incomplete++
          log.push(`partial  ${fieldPath} (translate every part of this field to import it)`)
        } else {
          const texts = new Map(
            entries.map((entry) => [splitRichTextPath(entry.path).nodePath!, entry.bg]),
          )
          setAt(bgDoc, fieldPath, replaceRichText(en, texts))
          counts.filled++
          changedKeys.add(topLevelKey(fieldPath))
          log.push(`fill     ${fieldPath} (rich text)`)
        }
      }

      if (log.length > 0) {
        console.log(`  ${slug} ${doc.id} "${doc.label}"`)
        for (const line of log) console.log(`    ${line}`)
      }
      if (changedKeys.size === 0) continue

      // Only send the top-level fields that changed; array rows keep their ids.
      const data: Record<string, unknown> = {}
      for (const key of changedKeys) data[key] = bgDoc[key]

      // Let the localized slug generate from the Bulgarian title.
      if (slugSource && changedKeys.has(slugSource) && isBlank(bgDoc.slug)) {
        data.generateSlug = true
      }

      if (!apply) continue

      backups[String(doc.id)] = Object.fromEntries(
        [...changedKeys].map((key) => [key, before[key]]),
      )

      try {
        await payload.update({
          collection: slug as CollectionSlug,
          id: doc.id,
          locale: TARGET_LOCALE as 'bg',
          data,
          depth: 0,
        })
      } catch (error) {
        counts.failedDocs++
        if (error instanceof ValidationError) {
          const fields = error.data.errors.map((item) => item.path).join(', ')
          console.error(`    ✗ not saved: required in Bulgarian too: ${fields}`)
        } else {
          console.error(`    ✗ not saved:`, error instanceof Error ? error.message : error)
        }
      }
    }

    if (apply && Object.keys(backups).length > 0) {
      const backupDir = path.join(TRANSLATIONS_DIR, 'backup')
      mkdirSync(backupDir, { recursive: true })
      writeFileSync(
        path.join(backupDir, `${slug}-${backupStamp}.json`),
        `${JSON.stringify(backups, null, 2)}\n`,
      )
    }

    console.log(
      `${slug}: filled ${counts.filled}, already translated ${counts.existing}, stale ${counts.stale}, missing ${counts.missing}, incomplete rich text ${counts.incomplete}` +
        (apply ? `, docs not saved ${counts.failedDocs}` : ''),
    )
  }
}

// `payload run` calls process.exit() as soon as this module finishes loading,
// so the import must be awaited at the top level.
await importTranslations()
