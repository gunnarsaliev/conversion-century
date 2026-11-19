import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import { plainTextToLexical } from '../lib/plain-text-to-lexical'

// Blog FAQ answers: textarea (varchar) → richText (jsonb). Postgres can't cast
// plain text to jsonb, so existing answers are read first, the column is
// retyped, and each answer is written back as a Lexical document (one
// paragraph per line).

const TABLES = ['blog_faqs_locales', '_blog_v_version_faqs_locales'] as const

type Row = { id: number; answer: unknown }

const textFromNode = (node: SerializedLexicalNode): string => {
  if ('text' in node && typeof node.text === 'string') return node.text
  const children = (node as { children?: SerializedLexicalNode[] }).children
  return Array.isArray(children) ? children.map(textFromNode).join('') : ''
}

const lexicalToText = (value: unknown): string => {
  const state = (typeof value === 'string' ? JSON.parse(value) : value) as SerializedEditorState
  return ((state?.root?.children ?? []) as SerializedLexicalNode[]).map(textFromNode).join('\n')
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    const { rows } = await db.execute(
      sql`SELECT "id", "answer" FROM ${sql.identifier(table)} WHERE "answer" IS NOT NULL`,
    )
    await db.execute(
      sql`ALTER TABLE ${sql.identifier(table)} ALTER COLUMN "answer" SET DATA TYPE jsonb USING NULL`,
    )
    for (const { id, answer } of rows as Row[]) {
      const value = JSON.stringify(plainTextToLexical(String(answer)))
      await db.execute(
        sql`UPDATE ${sql.identifier(table)} SET "answer" = ${value}::jsonb WHERE "id" = ${id}`,
      )
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    const { rows } = await db.execute(
      sql`SELECT "id", "answer" FROM ${sql.identifier(table)} WHERE "answer" IS NOT NULL`,
    )
    await db.execute(
      sql`ALTER TABLE ${sql.identifier(table)} ALTER COLUMN "answer" SET DATA TYPE varchar USING NULL`,
    )
    for (const { id, answer } of rows as Row[]) {
      await db.execute(
        sql`UPDATE ${sql.identifier(table)} SET "answer" = ${lexicalToText(answer)} WHERE "id" = ${id}`,
      )
    }
  }
}
