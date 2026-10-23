// Shared helpers for exporting/importing content translations (used by the
// dashboard's Translations page and scripts/translations-*.ts).
//
// Localized text lives at "paths" inside a document. A path is dot-separated
// field names; array rows are addressed by their row id rather than index
// (`includes.items[id=6512ab].title`), so reordering rows between export and
// import can't put text in the wrong row. Rich text is translated per text
// node: `content#0.2.1` is the text node reached by those child indices from
// the Lexical root, and the import rebuilds the English tree with the
// Bulgarian text so formatting, links and lists carry over.
import type { Field, Payload } from 'payload'

export const SOURCE_LOCALE = 'en'
export const TARGET_LOCALE = 'bg'
export const TRANSLATIONS_DIR = 'translations'

export type Entry = {
  path: string
  en: string
  bg: string
  /** Bulgarian can't be saved for this document until this field is filled. */
  required?: true
}

export type TranslationDoc = { id: number | string; label: string; fields: Entry[] }

export type TranslationFile = {
  collection: string
  sourceLocale: string
  targetLocale: string
  exportedAt: string
  docs: TranslationDoc[]
}

// ---------------------------------------------------------------------------
// Schema: which fields are localized
// ---------------------------------------------------------------------------

type Segment = { key: string } | { rows: string }

export type LocalizedLeaf = {
  segments: Segment[]
  kind: 'text' | 'textarea' | 'richText'
  required: boolean
}

// Localized text/textarea/richText fields, with how to reach them. Rows,
// collapsibles and unnamed tabs/groups don't add a path segment.
export function localizedLeaves(fields: Field[], prefix: Segment[] = []): LocalizedLeaf[] {
  const leaves: LocalizedLeaf[] = []

  for (const field of fields) {
    switch (field.type) {
      case 'row':
      case 'collapsible':
        leaves.push(...localizedLeaves(field.fields, prefix))
        break
      case 'tabs':
        for (const tab of field.tabs) {
          const tabPrefix = 'name' in tab && tab.name ? [...prefix, { key: tab.name }] : prefix
          leaves.push(...localizedLeaves(tab.fields, tabPrefix))
        }
        break
      case 'group': {
        const groupPrefix = 'name' in field && field.name ? [...prefix, { key: field.name }] : prefix
        if (field.localized) {
          console.warn(`skipping localized group ${field.name}: not supported`)
          break
        }
        leaves.push(...localizedLeaves(field.fields, groupPrefix))
        break
      }
      case 'array':
        if (field.localized) {
          console.warn(`skipping localized array ${field.name}: not supported`)
          break
        }
        leaves.push(...localizedLeaves(field.fields, [...prefix, { rows: field.name }]))
        break
      case 'text':
      case 'textarea':
      case 'richText':
        if (field.localized && !isSlugField(field)) {
          leaves.push({
            segments: [...prefix, { key: field.name }],
            kind: field.type,
            required: Boolean(field.required),
          })
        }
        break
      default:
        break
    }
  }

  return leaves
}

// Slugs are regenerated from the Bulgarian title on import, never translated.
const isSlugField = (field: Field) => 'name' in field && field.name === 'slug'

// The field a localized `slug` is generated from (Payload's slugField passes
// it to its admin component), if the collection has one.
export function slugSourceField(fields: Field[]): string | undefined {
  for (const field of fields) {
    if (field.type === 'row' || field.type === 'collapsible') {
      const found = slugSourceField(field.fields)
      if (found) return found
    }
    if (field.type === 'text' && field.name === 'slug' && field.localized) {
      const component = field.admin?.components?.Field
      const props =
        component && typeof component === 'object' && 'clientProps' in component
          ? (component.clientProps as { useAsSlug?: string } | undefined)
          : undefined
      return props?.useAsSlug ?? 'title'
    }
  }
  return undefined
}

// Concrete paths of a leaf in one document, e.g. `faq.items[id=ab].question`.
export function leafPaths(doc: unknown, leaf: LocalizedLeaf): string[] {
  let current: { path: string; value: unknown }[] = [{ path: '', value: doc }]

  for (const segment of leaf.segments) {
    const next: typeof current = []
    for (const { path, value } of current) {
      if (!value || typeof value !== 'object') continue
      const join = (part: string) => (path ? `${path}.${part}` : part)
      if ('key' in segment) {
        next.push({ path: join(segment.key), value: (value as Record<string, unknown>)[segment.key] })
      } else {
        const rows = (value as Record<string, unknown>)[segment.rows]
        if (!Array.isArray(rows)) continue
        for (const row of rows) {
          if (row && typeof row === 'object' && 'id' in row && row.id) {
            next.push({ path: join(`${segment.rows}[id=${row.id}]`), value: row })
          }
        }
      }
    }
    current = next
  }

  return current.map(({ path }) => path)
}

// ---------------------------------------------------------------------------
// Reading and writing values by path
// ---------------------------------------------------------------------------

const ROW_TOKEN = /^(.+)\[id=(.+)\]$/

type Container = Record<string, unknown>

// The object holding the last path segment, and that segment's key.
function resolveParent(doc: unknown, path: string): { parent: Container; key: string } | null {
  const tokens = path.split('.')
  let node: unknown = doc

  for (const token of tokens.slice(0, -1)) {
    if (!node || typeof node !== 'object') return null
    const row = ROW_TOKEN.exec(token)
    if (row) {
      const rows = (node as Container)[row[1]]
      node = Array.isArray(rows)
        ? rows.find((item) => item && typeof item === 'object' && String(item.id) === row[2])
        : undefined
    } else {
      node = (node as Container)[token]
    }
  }

  return node && typeof node === 'object' ? { parent: node as Container, key: tokens.at(-1)! } : null
}

/** `undefined` when the path no longer exists (e.g. the array row was deleted). */
export function getAt(doc: unknown, path: string): unknown {
  const target = resolveParent(doc, path)
  return target && target.key in target.parent ? target.parent[target.key] : undefined
}

/** Returns false when the path no longer exists. */
export function setAt(doc: unknown, path: string, value: unknown): boolean {
  const target = resolveParent(doc, path)
  if (!target) return false
  target.parent[target.key] = value
  return true
}

export const isBlank = (value: unknown) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '')

// ---------------------------------------------------------------------------
// Lexical rich text
// ---------------------------------------------------------------------------

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

/** Non-empty text nodes in document order, keyed by child-index path. */
export function richTextNodes(value: unknown): { nodePath: string; text: string }[] {
  const root = (value as { root?: LexicalNode } | null)?.root
  const nodes: { nodePath: string; text: string }[] = []

  const walk = (node: LexicalNode, indices: number[]) => {
    if (node.type === 'text' && typeof node.text === 'string' && node.text.trim()) {
      nodes.push({ nodePath: indices.join('.'), text: node.text })
    }
    node.children?.forEach((child, index) => walk(child, [...indices, index]))
  }

  if (root) walk(root, [])
  return nodes
}

export const hasRichText = (value: unknown) => richTextNodes(value).length > 0

/** A copy of `value` with each listed text node's text replaced. */
export function replaceRichText(value: unknown, texts: Map<string, string>): unknown {
  const copy = structuredClone(value) as { root: LexicalNode }

  for (const [nodePath, text] of texts) {
    let node: LexicalNode | undefined = copy.root
    for (const index of nodePath.split('.').map(Number)) node = node?.children?.[index]
    if (node?.type === 'text') node.text = text
  }

  return copy
}

// `content#0.2.1` → field path and node path.
export function splitRichTextPath(path: string): { fieldPath: string; nodePath?: string } {
  const [fieldPath, nodePath] = path.split('#')
  return { fieldPath, nodePath }
}

// ---------------------------------------------------------------------------
// Payload
// ---------------------------------------------------------------------------

/** Collections with at least one localized text field. */
export function translatableCollections(payload: Payload): string[] {
  return payload.config.collections
    .filter((collection) => localizedLeaves(collection.fields).length > 0)
    .map((collection) => collection.slug)
}
