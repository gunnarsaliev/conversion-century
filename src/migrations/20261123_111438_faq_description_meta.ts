import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faqs_locales" (
  	"short_description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "faqs" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "faqs" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "faq_categories" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "faq_categories" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "faq_categories_locales" ADD COLUMN "short_description" jsonb;
  ALTER TABLE "faq_categories_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "faq_categories_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "faqs_meta_meta_image_idx" ON "faqs" USING btree ("meta_image_id");
  CREATE INDEX "faq_categories_meta_meta_image_idx" ON "faq_categories" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faqs_locales" CASCADE;
  ALTER TABLE "faqs" DROP CONSTRAINT "faqs_meta_image_id_media_id_fk";
  
  ALTER TABLE "faq_categories" DROP CONSTRAINT "faq_categories_meta_image_id_media_id_fk";
  
  DROP INDEX "faqs_meta_meta_image_idx";
  DROP INDEX "faq_categories_meta_meta_image_idx";
  ALTER TABLE "faqs" DROP COLUMN "meta_image_id";
  ALTER TABLE "faqs" DROP COLUMN "meta_noindex";
  ALTER TABLE "faq_categories" DROP COLUMN "meta_image_id";
  ALTER TABLE "faq_categories" DROP COLUMN "meta_noindex";
  ALTER TABLE "faq_categories_locales" DROP COLUMN "short_description";
  ALTER TABLE "faq_categories_locales" DROP COLUMN "meta_title";
  ALTER TABLE "faq_categories_locales" DROP COLUMN "meta_description";`)
}
