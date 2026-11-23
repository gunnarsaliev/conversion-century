import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import slugify from 'slugify'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. New localized columns, nullable until they're backfilled.
  await db.execute(sql`
   ALTER TABLE "faqs_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "faqs_locales" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "faqs_locales" ADD COLUMN "slug" varchar;`)

  // 2. Every FAQ needs at least an English locales row to hold its title.
  await db.execute(sql`
   INSERT INTO "faqs_locales" ("_locale", "_parent_id")
  SELECT 'en', f."id" FROM "faqs" f
  WHERE NOT EXISTS (SELECT 1 FROM "faqs_locales" l WHERE l."_parent_id" = f."id");`)

  // 3. Title = the category's name in that locale (the old hidden title was
  //    copied from it), falling back to the old title, then to the id.
  await db.execute(sql`
   UPDATE "faqs_locales" l
  SET "title" = COALESCE(NULLIF(cl."name", ''), NULLIF(f."title", ''), 'FAQ ' || f."id")
  FROM "faqs" f
  LEFT JOIN "faq_categories_locales" cl ON cl."_parent_id" = f."category_id"
  WHERE l."_parent_id" = f."id" AND (cl."_locale" = l."_locale" OR cl."_locale" IS NULL);`)
  await db.execute(sql`
   UPDATE "faqs_locales" l
  SET "title" = COALESCE(NULLIF(f."title", ''), 'FAQ ' || f."id")
  FROM "faqs" f
  WHERE l."_parent_id" = f."id" AND l."title" IS NULL;`)

  // 4. Slug from the title, the way localizedSlugField builds it; unique per locale.
  const { rows } = await db.execute(sql`
    SELECT "id", "title", "_locale" FROM "faqs_locales" ORDER BY "_parent_id", "id"`)
  const taken = new Set<string>()
  for (const row of rows as { id: number; title: string; _locale: string }[]) {
    const base =
      slugify(row.title, {
        lower: true,
        strict: true,
        locale: row._locale === 'bg' ? 'bg' : 'en',
      }) || `faq-${row.id}`
    let slug = base
    for (let n = 2; taken.has(`${row._locale}:${slug}`); n++) slug = `${base}-${n}`
    taken.add(`${row._locale}:${slug}`)
    await db.execute(sql`
      UPDATE "faqs_locales" SET "slug" = ${slug} WHERE "id" = ${row.id}`)
  }

  // 5. Lock the columns down, then drop FAQ categories.
  await db.execute(sql`
   ALTER TABLE "faqs_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "faqs_locales" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "faqs_slug_idx" ON "faqs_locales" USING btree ("slug","_locale");
  ALTER TABLE "faqs" DROP CONSTRAINT "faqs_category_id_faq_categories_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_categories_fk";
  DROP INDEX "faqs_category_idx";
  DROP INDEX "payload_locked_documents_rels_faq_categories_id_idx";
  ALTER TABLE "faqs" DROP COLUMN "title";
  ALTER TABLE "faqs" DROP COLUMN "category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_categories_id";
  DROP TABLE "faq_categories_locales" CASCADE;
  DROP TABLE "faq_categories" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faq_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_categories_locales" (
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"short_description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "faqs_slug_idx";
  ALTER TABLE "faqs" ADD COLUMN "title" varchar;
  ALTER TABLE "faqs" ADD COLUMN "category_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_categories_id" integer;
  ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_categories_locales" ADD CONSTRAINT "faq_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faq_categories_image_idx" ON "faq_categories" USING btree ("image_id");
  CREATE INDEX "faq_categories_updated_at_idx" ON "faq_categories" USING btree ("updated_at");
  CREATE INDEX "faq_categories_created_at_idx" ON "faq_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_categories_slug_idx" ON "faq_categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "faq_categories_locales_locale_parent_id_unique" ON "faq_categories_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_categories_fk" FOREIGN KEY ("faq_categories_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category_id");
  CREATE INDEX "payload_locked_documents_rels_faq_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_categories_id");
  ALTER TABLE "faqs_locales" DROP COLUMN "title";
  ALTER TABLE "faqs_locales" DROP COLUMN "generate_slug";
  ALTER TABLE "faqs_locales" DROP COLUMN "slug";`)
}
