# Content translations (English → Bulgarian)

Each `<collection>.json` file here lists the website content that has English
text but no Bulgarian translation yet. They are generated with
`pnpm translations:export` and read back with `pnpm translations:import`.

## For the translator

Only change the `"bg"` values. Leave everything else exactly as it is.

```json
{ "path": "hero.heading", "en": "Organic growth built on trust", "bg": "" }
```

becomes

```json
{ "path": "hero.heading", "en": "Organic growth built on trust", "bg": "Органичен растеж, изграден върху доверие" }
```

- **Don't edit `path` or `en`.** They tell the import where the text goes and
  are used to check that the English hasn't changed in the meantime.
- **Keep line breaks** (`\n`) where the English has them. Blank lines
  (`\n\n`) separate paragraphs on the page.
- **Rich text** (articles, descriptions) is split into pieces with the same
  `path` before the `#`, e.g. `content#0.1.0`, `content#0.1.1`. Together they
  form one paragraph, and bold text or links often start a new piece.
  Translate every piece of a field. A field with any piece left empty is not
  imported, so a page never mixes languages within one block.
- Entries marked `"required": true` must be translated before that page can
  be saved in Bulgarian at all.
- Leave a `"bg"` value empty to skip it. It can be translated in a later round.
- Keep the file valid JSON: escape double quotes inside text as `\"`, or use
  „Bulgarian quotes“ instead.

## For developers

```sh
pnpm translations:export                 # all collections
pnpm translations:export services blog   # only these
pnpm translations:import                 # dry run: shows what would change
pnpm translations:import services apply  # save (one collection)
pnpm translations:import apply           # save (all)
```

The import only fills Bulgarian fields that are still empty. It skips fields
that were translated in the admin since the export, and fields whose English
changed since the export (re-export to get the new text). A Bulgarian slug is
generated from the translated title. Previous Bulgarian values of every
changed document are saved to `translations/backup/` (git-ignored). Take a
full backup with `GET /api/export-all` before applying, since the dev
database is shared.
