import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" ADD COLUMN "rating" numeric;
  ALTER TABLE "testimonials" ADD COLUMN "date" timestamp(3) with time zone;
  UPDATE "testimonials" SET "date" = "created_at";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" DROP COLUMN "rating";
  ALTER TABLE "testimonials" DROP COLUMN "date";`)
}
