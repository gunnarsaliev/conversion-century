import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "blog_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog_faqs_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_blog_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blog_v_version_faqs_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "blog_faqs" ADD CONSTRAINT "blog_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_faqs_locales" ADD CONSTRAINT "blog_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v_version_faqs" ADD CONSTRAINT "_blog_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v_version_faqs_locales" ADD CONSTRAINT "_blog_v_version_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_v_version_faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blog_faqs_order_idx" ON "blog_faqs" USING btree ("_order");
  CREATE INDEX "blog_faqs_parent_id_idx" ON "blog_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blog_faqs_locales_locale_parent_id_unique" ON "blog_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_v_version_faqs_order_idx" ON "_blog_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_blog_v_version_faqs_parent_id_idx" ON "_blog_v_version_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_blog_v_version_faqs_locales_locale_parent_id_unique" ON "_blog_v_version_faqs_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "blog_faqs" CASCADE;
  DROP TABLE "blog_faqs_locales" CASCADE;
  DROP TABLE "_blog_v_version_faqs" CASCADE;
  DROP TABLE "_blog_v_version_faqs_locales" CASCADE;`)
}
