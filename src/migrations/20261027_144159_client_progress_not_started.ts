import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Renames the enum value in place so existing "pending" rows become
// "not-started" (the generated drop/recreate would fail to cast them).

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_client_checklist_progress_status" RENAME VALUE 'pending' TO 'not-started';
  ALTER TABLE "client_checklist_progress" ALTER COLUMN "status" SET DEFAULT 'not-started'::"public"."enum_client_checklist_progress_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_client_checklist_progress_status" RENAME VALUE 'not-started' TO 'pending';
  ALTER TABLE "client_checklist_progress" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."enum_client_checklist_progress_status";`)
}
