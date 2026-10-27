import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { toSlug } from '../collections/Users'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "slug" varchar;
  CREATE UNIQUE INDEX "users_slug_idx" ON "users" USING btree ("slug");`)

  // Backfill author page slugs from existing names (same rule as the field
  // hook in collections/Users: duplicates get -2, -3, …). Users without a
  // name keep a null slug and their id-based URL.
  const { rows } = await db.execute(sql`
    SELECT "id", "first_name", "last_name" FROM "users" ORDER BY "id"`)
  const taken = new Set<string>()
  for (const row of rows as { id: number; first_name: string | null; last_name: string | null }[]) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(' ')
    const base = name ? toSlug(name) : ''
    if (!base) continue
    let slug = base
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`
    taken.add(slug)
    await db.execute(sql`UPDATE "users" SET "slug" = ${slug} WHERE "id" = ${row.id}`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "users_slug_idx";
  ALTER TABLE "users" DROP COLUMN "slug";`)
}
