// Imports the Bulgarian values a translator filled into
// `translations/<slug>.json` (written by scripts/translations-export.ts).
// The same import is available from Dashboard → Translations.
//
// Dry run by default: prints what would change. Add `apply` to save.
//
// Run with: pnpm translations:import [services blog …] [apply]
//
// See src/lib/translations/import.ts for what is filled and what is skipped.
// Before applying, take a full backup with GET /api/export-all; this script
// also saves the previous Bulgarian values of every document it changes to
// translations/backup/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../payload.config'
import { translatableCollections, TRANSLATIONS_DIR } from '../src/lib/translations/core'
import { importTranslationFile, isTranslationFile } from '../src/lib/translations/import'
import { readArgs } from './lib/args'

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
    const file: unknown = JSON.parse(readFileSync(path.join(TRANSLATIONS_DIR, `${slug}.json`), 'utf8'))
    if (!isTranslationFile(file)) throw new Error(`${slug}.json is not a translation file`)

    const { counts, docs, backup } = await importTranslationFile(payload, file, { apply })

    for (const doc of docs) {
      console.log(`  ${slug} ${doc.id} "${doc.label}"`)
      for (const { kind, path: fieldPath, detail } of doc.log) {
        console.log(`    ${kind.padEnd(8)} ${fieldPath}${detail ? ` (${detail})` : ''}`)
      }
    }

    if (apply && Object.keys(backup).length > 0) {
      const backupDir = path.join(TRANSLATIONS_DIR, 'backup')
      mkdirSync(backupDir, { recursive: true })
      writeFileSync(path.join(backupDir, `${slug}-${backupStamp}.json`), `${JSON.stringify(backup, null, 2)}\n`)
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
