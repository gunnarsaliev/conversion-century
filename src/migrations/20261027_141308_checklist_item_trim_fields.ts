import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "work_checklist" DROP COLUMN "short_description";
  ALTER TABLE "work_checklist" DROP COLUMN "priority";
  ALTER TABLE "work_checklist" DROP COLUMN "label";
  ALTER TABLE "work_checklist" DROP COLUMN "team";
  DROP TYPE "public"."enum_work_checklist_priority";
  DROP TYPE "public"."enum_work_checklist_label";
  DROP TYPE "public"."enum_work_checklist_team";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_work_checklist_priority" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_work_checklist_label" AS ENUM('technical', 'copyright');
  CREATE TYPE "public"."enum_work_checklist_team" AS ENUM('content', 'dev', 'seo');
  ALTER TABLE "work_checklist" ADD COLUMN "short_description" jsonb;
  ALTER TABLE "work_checklist" ADD COLUMN "priority" "enum_work_checklist_priority";
  ALTER TABLE "work_checklist" ADD COLUMN "label" "enum_work_checklist_label";
  ALTER TABLE "work_checklist" ADD COLUMN "team" "enum_work_checklist_team";`)
}
