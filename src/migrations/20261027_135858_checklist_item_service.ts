import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "work_checklist" ADD COLUMN "service_id" integer;
  ALTER TABLE "work_checklist" ADD CONSTRAINT "work_checklist_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "work_checklist_service_idx" ON "work_checklist" USING btree ("service_id");
  ALTER TABLE "work_checklist" DROP COLUMN "type";
  DROP TYPE "public"."enum_work_checklist_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_work_checklist_type" AS ENUM('301s-and-302s', '404s', '500s', 'additional', 'breadcrumbs', 'duplicate-pages', 'force-https', 'general', 'google-analytics-and-gsc', 'h1', 'images', 'indexation', 'internal-linking', 'keywords', 'localized-content', 'meta-titles-and-descriptions', 'navigation', 'page-content', 'pagination', 'robots-txt', 'schema-markup', 'site-speed', 'url-structure', 'xml-sitemap');
  ALTER TABLE "work_checklist" DROP CONSTRAINT "work_checklist_service_id_services_id_fk";
  
  DROP INDEX "work_checklist_service_idx";
  ALTER TABLE "work_checklist" ADD COLUMN "type" "enum_work_checklist_type" NOT NULL;
  ALTER TABLE "work_checklist" DROP COLUMN "service_id";`)
}
