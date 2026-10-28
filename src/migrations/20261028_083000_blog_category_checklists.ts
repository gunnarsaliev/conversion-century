import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_blog_categories" ADD VALUE 'checklists';
  ALTER TYPE "public"."enum__blog_v_version_categories" ADD VALUE 'checklists';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blog_categories" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_blog_categories";
  CREATE TYPE "public"."enum_blog_categories" AS ENUM('web-development', 'seo-performance', 'content-optimization', 'blogging', 'seo-consulting', 'keyword-research', 'link-building');
  ALTER TABLE "blog_categories" ALTER COLUMN "value" SET DATA TYPE "public"."enum_blog_categories" USING "value"::"public"."enum_blog_categories";
  ALTER TABLE "_blog_v_version_categories" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum__blog_v_version_categories";
  CREATE TYPE "public"."enum__blog_v_version_categories" AS ENUM('web-development', 'seo-performance', 'content-optimization', 'blogging', 'seo-consulting', 'keyword-research', 'link-building');
  ALTER TABLE "_blog_v_version_categories" ALTER COLUMN "value" SET DATA TYPE "public"."enum__blog_v_version_categories" USING "value"::"public"."enum__blog_v_version_categories";`)
}
