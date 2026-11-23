import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_page_meta_page" ADD VALUE 'faqs' BEFORE 'clients';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_meta" ALTER COLUMN "page" SET DATA TYPE text;
  DROP TYPE "public"."enum_page_meta_page";
  CREATE TYPE "public"."enum_page_meta_page" AS ENUM('home', 'about', 'services', 'solutions', 'industries', 'caseStudies', 'blog', 'clients', 'reviews', 'openPositions', 'bookAConsultation', 'eventsAndMedia', 'termsAndConditions', 'privacyPolicy', 'cookiePolicy', 'docsGettingStarted');
  ALTER TABLE "page_meta" ALTER COLUMN "page" SET DATA TYPE "public"."enum_page_meta_page" USING "page"::"public"."enum_page_meta_page";`)
}
