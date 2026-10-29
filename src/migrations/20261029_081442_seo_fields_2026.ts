import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_page_meta_page" ADD VALUE 'termsAndConditions' BEFORE 'docsGettingStarted';
  ALTER TYPE "public"."enum_page_meta_page" ADD VALUE 'privacyPolicy' BEFORE 'docsGettingStarted';
  ALTER TYPE "public"."enum_page_meta_page" ADD VALUE 'cookiePolicy' BEFORE 'docsGettingStarted';
  ALTER TABLE "services" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "services" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "blog" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "blog" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "_blog_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_blog_v" ADD COLUMN "version_meta_noindex" boolean DEFAULT false;
  ALTER TABLE "job_listings" ADD COLUMN "expires_at" timestamp(3) with time zone;
  ALTER TABLE "case_studies" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "case_studies" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "case_studies" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "industries" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "industries" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "_industries_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_industries_v" ADD COLUMN "version_meta_noindex" boolean DEFAULT false;
  ALTER TABLE "solutions" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "solutions" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "events" ADD COLUMN "meta_noindex" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_events_v" ADD COLUMN "version_meta_noindex" boolean DEFAULT false;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE INDEX "blog_meta_meta_image_idx" ON "blog" USING btree ("meta_image_id");
  CREATE INDEX "_blog_v_version_meta_version_meta_image_idx" ON "_blog_v" USING btree ("version_meta_image_id");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies" USING btree ("meta_image_id");
  CREATE INDEX "industries_meta_meta_image_idx" ON "industries" USING btree ("meta_image_id");
  CREATE INDEX "_industries_v_version_meta_version_meta_image_idx" ON "_industries_v" USING btree ("version_meta_image_id");
  CREATE INDEX "solutions_meta_meta_image_idx" ON "solutions" USING btree ("meta_image_id");
  CREATE INDEX "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v" USING btree ("version_meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DROP CONSTRAINT "services_meta_image_id_media_id_fk";
  
  ALTER TABLE "blog" DROP CONSTRAINT "blog_meta_image_id_media_id_fk";
  
  ALTER TABLE "_blog_v" DROP CONSTRAINT "_blog_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_meta_image_id_media_id_fk";
  
  ALTER TABLE "industries" DROP CONSTRAINT "industries_meta_image_id_media_id_fk";
  
  ALTER TABLE "_industries_v" DROP CONSTRAINT "_industries_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "solutions" DROP CONSTRAINT "solutions_meta_image_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_meta_image_id_media_id_fk";
  
  ALTER TABLE "_events_v" DROP CONSTRAINT "_events_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "page_meta" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum_page_meta_page";
  CREATE TYPE "public"."enum_page_meta_page" AS ENUM('home', 'about', 'services', 'solutions', 'industries', 'caseStudies', 'blog', 'clients', 'reviews', 'openPositions', 'bookAConsultation', 'eventsAndMedia', 'docsGettingStarted');
  ALTER TABLE "page_meta" ALTER COLUMN "page" SET DATA TYPE "public"."enum_page_meta_page" USING "page"::"public"."enum_page_meta_page";
  DROP INDEX "services_meta_meta_image_idx";
  DROP INDEX "blog_meta_meta_image_idx";
  DROP INDEX "_blog_v_version_meta_version_meta_image_idx";
  DROP INDEX "case_studies_meta_meta_image_idx";
  DROP INDEX "industries_meta_meta_image_idx";
  DROP INDEX "_industries_v_version_meta_version_meta_image_idx";
  DROP INDEX "solutions_meta_meta_image_idx";
  DROP INDEX "events_meta_meta_image_idx";
  DROP INDEX "_events_v_version_meta_version_meta_image_idx";
  ALTER TABLE "services" DROP COLUMN "meta_image_id";
  ALTER TABLE "services" DROP COLUMN "meta_noindex";
  ALTER TABLE "blog" DROP COLUMN "meta_image_id";
  ALTER TABLE "blog" DROP COLUMN "meta_noindex";
  ALTER TABLE "_blog_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_blog_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "job_listings" DROP COLUMN "expires_at";
  ALTER TABLE "case_studies" DROP COLUMN "published_at";
  ALTER TABLE "case_studies" DROP COLUMN "meta_image_id";
  ALTER TABLE "case_studies" DROP COLUMN "meta_noindex";
  ALTER TABLE "industries" DROP COLUMN "meta_image_id";
  ALTER TABLE "industries" DROP COLUMN "meta_noindex";
  ALTER TABLE "_industries_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_industries_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "solutions" DROP COLUMN "meta_image_id";
  ALTER TABLE "solutions" DROP COLUMN "meta_noindex";
  ALTER TABLE "events" DROP COLUMN "meta_image_id";
  ALTER TABLE "events" DROP COLUMN "meta_noindex";
  ALTER TABLE "_events_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_meta_noindex";`)
}
