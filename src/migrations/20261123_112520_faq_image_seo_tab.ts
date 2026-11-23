import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" DROP CONSTRAINT "faqs_meta_image_id_media_id_fk";
  
  ALTER TABLE "faq_categories" DROP CONSTRAINT "faq_categories_meta_image_id_media_id_fk";
  
  DROP INDEX "faqs_meta_meta_image_idx";
  DROP INDEX "faq_categories_meta_meta_image_idx";
  ALTER TABLE "faqs" ADD COLUMN "image_id" integer;
  ALTER TABLE "faq_categories" ADD COLUMN "image_id" integer;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "faqs_image_idx" ON "faqs" USING btree ("image_id");
  CREATE INDEX "faq_categories_image_idx" ON "faq_categories" USING btree ("image_id");
  ALTER TABLE "faqs" DROP COLUMN "meta_image_id";
  ALTER TABLE "faqs" DROP COLUMN "meta_noindex";
  ALTER TABLE "faq_categories" DROP COLUMN "meta_image_id";
  ALTER TABLE "faq_categories" DROP COLUMN "meta_noindex";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" DROP CONSTRAINT "faqs_image_id_media_id_fk";
  
  ALTER TABLE "faq_categories" DROP CONSTRAINT "faq_categories_image_id_media_id_fk";
  
  DROP INDEX "faqs_image_idx";
  DROP INDEX "faq_categories_image_idx";
  ALTER TABLE "faqs" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "faqs" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "faq_categories" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "faq_categories" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "faqs_meta_meta_image_idx" ON "faqs" USING btree ("meta_image_id");
  CREATE INDEX "faq_categories_meta_meta_image_idx" ON "faq_categories" USING btree ("meta_image_id");
  ALTER TABLE "faqs" DROP COLUMN "image_id";
  ALTER TABLE "faq_categories" DROP COLUMN "image_id";`)
}
