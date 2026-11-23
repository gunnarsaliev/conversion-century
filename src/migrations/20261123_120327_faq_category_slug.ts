import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import slugify from 'slugify'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faq_categories_locales" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "faq_categories_locales" ADD COLUMN "slug" varchar;`)

  // Backfill slugs for existing categories from their localized name, the same
  // way localizedSlugField does, so the column can be made NOT NULL.
  const { rows } = await db.execute(sql`
    SELECT "id", "name", "_locale" FROM "faq_categories_locales" ORDER BY "id"`)
  const taken = new Set<string>()
  for (const row of rows as { id: number; name: string | null; _locale: string }[]) {
    const base =
      slugify(row.name ?? '', {
        lower: true,
        strict: true,
        locale: row._locale === 'bg' ? 'bg' : 'en',
      }) || `category-${row.id}`
    let slug = base
    for (let n = 2; taken.has(`${row._locale}:${slug}`); n++) slug = `${base}-${n}`
    taken.add(`${row._locale}:${slug}`)
    await db.execute(sql`
      UPDATE "faq_categories_locales" SET "slug" = ${slug} WHERE "id" = ${row.id}`)
  }

  await db.execute(sql`
   ALTER TABLE "faq_categories_locales" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "faq_categories_slug_idx" ON "faq_categories_locales" USING btree ("slug","_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "faq_categories_slug_idx";
  ALTER TABLE "faq_categories_locales" DROP COLUMN "generate_slug";
  ALTER TABLE "faq_categories_locales" DROP COLUMN "slug";`)
}
