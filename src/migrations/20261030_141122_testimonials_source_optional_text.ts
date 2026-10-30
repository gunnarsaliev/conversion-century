import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_testimonials_source" AS ENUM('website', 'google', 'clutch', 'trustpilot', 'linkedin', 'facebook', 'other');
  ALTER TABLE "testimonials" ALTER COLUMN "testimonial" DROP NOT NULL;
  ALTER TABLE "testimonials" ADD COLUMN "source" "enum_testimonials_source" DEFAULT 'website' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" ALTER COLUMN "testimonial" SET NOT NULL;
  ALTER TABLE "testimonials" DROP COLUMN "source";
  DROP TYPE "public"."enum_testimonials_source";`)
}
