import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" DROP COLUMN "order";
  ALTER TABLE "faq_categories" DROP COLUMN "order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "faqs" ADD COLUMN "order" numeric;
  ALTER TABLE "faq_categories" ADD COLUMN "order" numeric;`)
}
