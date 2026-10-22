import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contacts_status" AS ENUM('active', 'pending', 'archived');
  ALTER TABLE "contacts" ADD COLUMN "status" "enum_contacts_status" DEFAULT 'active' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contacts" DROP COLUMN "status";
  DROP TYPE "public"."enum_contacts_status";`)
}
