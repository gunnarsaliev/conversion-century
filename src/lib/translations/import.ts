import { ValidationError, type CollectionSlug, type Payload } from 'payload'

import {
  getAt,
  hasRichText,
  isBlank,
  replaceRichText,
  richTextNodes,
  setAt,
  slugSourceField,
  splitRichTextPath,
  SOURCE_LOCALE,
  TARGET_LOCALE,
  type Entry,
  type TranslationFile,
} from './core'

// ---------------------------------------------------------------------------
// Import: fill empty Bulgarian fields from a translated TranslationFile
// ---------------------------------------------------------------------------
//
// Dry run unless `apply` is set. Only ever fills empty Bulgarian fields: a
// field someone has translated in the meantime is left alone, as is any
// field whose English text changed since the export (the translation may be
// stale). Rich text is only filled when every text node of that field has a
// translation, so a field is never half English. Arrays aren't localized, so
// rows keep their ids and the English rows are untouched.

export type ImportCounts = {
  filled: number
  existing: number
  stale: number
  missing: number
  incomplete: number
  failedDocs: number
}

export type ImportLogKind = 'fill' | 'stale' | 'missing' | 'partial' | 'error'

export type ImportDocReport = {
  id: number | string
  label: string
  log: { kind: ImportLogKind; path: string; detail?: string }[]
}

export type ImportReport = {
  collection: string
  counts: ImportCounts
  docs: ImportDocReport[]
  /** Previous Bulgarian values of the changed top-level fields, by doc id. */
  backup: Record<string, Record<string, unknown>>
}

const topLevelKey = (fieldPath: string) => fieldPath.split(/[.[]/)[0]

export function isTranslationFile(value: unknown): value is TranslationFile {
  const file = value as TranslationFile | null
  return Boolean(
    file &&
      typeof file.collection === 'string' &&
      Array.isArray(file.docs) &&
      file.docs.every((doc) => doc && Array.isArray(doc.fields)),
  )
}

export async function importTranslationFile(
  payload: Payload,
  file: TranslationFile,
  { apply }: { apply: boolean },
): Promise<ImportReport> {
  const slug = file.collection
  const collectionConfig = payload.collections[slug as CollectionSlug]?.config
  if (!collectionConfig) throw new Error(`Unknown collection: ${slug}`)

  const slugSource = slugSourceField(collectionConfig.fields)
  const counts: ImportCounts = { filled: 0, existing: 0, stale: 0, missing: 0, incomplete: 0, failedDocs: 0 }
  const docs: ImportDocReport[] = []
  const backup: ImportReport['backup'] = {}

  for (const doc of file.docs) {
    const translated = doc.fields.filter((entry) => !isBlank(entry.bg))
    if (translated.length === 0) continue

    const report: ImportDocReport = { id: doc.id, label: doc.label, log: [] }
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
      counts.missing += translated.length
      report.log.push({ kind: 'missing', path: '', detail: 'document no longer exists' })
      docs.push(report)
      continue
    }

    const before = structuredClone(bgDoc)
    const changedKeys = new Set<string>()

    // Plain text fields.
    for (const entry of translated.filter((item) => !item.path.includes('#'))) {
      const en = getAt(enDoc, entry.path)
      const bg = getAt(bgDoc, entry.path)
      if (en === undefined) {
        counts.missing++
        report.log.push({ kind: 'missing', path: entry.path })
      } else if (!isBlank(bg)) {
        counts.existing++
      } else if (en !== entry.en) {
        counts.stale++
        report.log.push({ kind: 'stale', path: entry.path })
      } else if (setAt(bgDoc, entry.path, entry.bg)) {
        counts.filled++
        changedKeys.add(topLevelKey(entry.path))
        report.log.push({ kind: 'fill', path: entry.path })
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
        report.log.push({ kind: 'missing', path: fieldPath })
      } else if (hasRichText(getAt(bgDoc, fieldPath))) {
        counts.existing++
      } else if (
        enNodes.size !== entries.length ||
        entries.some((entry) => enNodes.get(splitRichTextPath(entry.path).nodePath!) !== entry.en)
      ) {
        counts.stale++
        report.log.push({ kind: 'stale', path: fieldPath })
      } else if (entries.some((entry) => isBlank(entry.bg))) {
        counts.incomplete++
        report.log.push({ kind: 'partial', path: fieldPath })
      } else {
        const texts = new Map(
          entries.map((entry) => [splitRichTextPath(entry.path).nodePath!, entry.bg]),
        )
        setAt(bgDoc, fieldPath, replaceRichText(en, texts))
        counts.filled++
        changedKeys.add(topLevelKey(fieldPath))
        report.log.push({ kind: 'fill', path: fieldPath, detail: 'rich text' })
      }
    }

    if (report.log.length > 0) docs.push(report)
    if (changedKeys.size === 0 || !apply) continue

    // Only send the top-level fields that changed; array rows keep their ids.
    const data: Record<string, unknown> = {}
    for (const key of changedKeys) data[key] = bgDoc[key]

    // Let the localized slug generate from the Bulgarian title.
    if (slugSource && changedKeys.has(slugSource) && isBlank(bgDoc.slug)) {
      data.generateSlug = true
    }

    backup[String(doc.id)] = Object.fromEntries(
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
      delete backup[String(doc.id)]
      report.log.push({
        kind: 'error',
        path: '',
        detail:
          error instanceof ValidationError
            ? `required in Bulgarian too: ${error.data.errors.map((item) => item.path).join(', ')}`
            : error instanceof Error
              ? error.message
              : String(error),
      })
    }
  }

  return { collection: slug, counts, docs, backup }
}
