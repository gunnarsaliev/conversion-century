import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" DROP COLUMN "client_type";
  DROP TYPE "public"."enum_testimonials_client_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_testimonials_client_type" AS ENUM('existing', 'new');
  ALTER TABLE "testimonials" ADD COLUMN "client_type" "enum_testimonials_client_type" DEFAULT 'existing' NOT NULL;`)
}
