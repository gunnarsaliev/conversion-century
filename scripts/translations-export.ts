// Exports every localized field that has English text but no Bulgarian yet,
// one file per collection in `translations/<slug>.json`, for a translator to
// fill in the `bg` values (see translations/README.md). The same export is
// available from Dashboard → Translations.
//
// Run with: pnpm translations:export [services blog …]
// Then:     pnpm translations:import (see scripts/translations-import.ts)
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../payload.config'
import { translatableCollections, TRANSLATIONS_DIR } from '../src/lib/translations/core'
import { exportCollection } from '../src/lib/translations/export'
import { readArgs } from './lib/args'

async function exportTranslations() {
  const payload = await getPayload({ config })
  const { collections: only } = readArgs()
  const slugs = translatableCollections(payload).filter((slug) => !only || only.includes(slug))

  if (slugs.length === 0) {
    throw new Error(`No translatable collections match: ${only?.join(', ')}`)
  }

  mkdirSync(TRANSLATIONS_DIR, { recursive: true })

  for (const slug of slugs) {
    const { file, summary } = await exportCollection(payload, slug)
    const outPath = path.join(TRANSLATIONS_DIR, `${slug}.json`)
    writeFileSync(outPath, `${JSON.stringify(file, null, 2)}\n`)
    console.log(
      `${slug.padEnd(16)} ${String(summary.docs).padStart(4)} docs  ${String(summary.fields).padStart(5)} fields  ${String(summary.words).padStart(6)} words  → ${outPath}`,
    )
  }
}

// `payload run` calls process.exit() as soon as this module finishes loading,
// so the export must be awaited at the top level.
await exportTranslations()
