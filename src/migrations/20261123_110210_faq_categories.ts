import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faq_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "faqs_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_questions_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faqs_questions" CASCADE;
  DROP TABLE "faqs_questions_locales" CASCADE;
  ALTER TABLE "faqs" ADD COLUMN "category_id" integer NOT NULL;
  ALTER TABLE "faqs_locales" ADD COLUMN "question" varchar NOT NULL;
  ALTER TABLE "faqs_locales" ADD COLUMN "answer" jsonb NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faq_categories_id" integer;
  ALTER TABLE "faq_categories_locales" ADD CONSTRAINT "faq_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faq_categories_updated_at_idx" ON "faq_categories" USING btree ("updated_at");
  CREATE INDEX "faq_categories_created_at_idx" ON "faq_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_categories_locales_locale_parent_id_unique" ON "faq_categories_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_faq_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."faq_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_categories_fk" FOREIGN KEY ("faq_categories_id") REFERENCES "public"."faq_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category_id");
  CREATE INDEX "payload_locked_documents_rels_faq_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_categories_id");
  ALTER TABLE "faqs_locales" DROP COLUMN "category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faqs_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faqs_questions_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "faq_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faq_categories_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "faq_categories" CASCADE;
  DROP TABLE "faq_categories_locales" CASCADE;
  ALTER TABLE "faqs" DROP CONSTRAINT "faqs_category_id_faq_categories_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faq_categories_fk";
  
  DROP INDEX "faqs_category_idx";
  DROP INDEX "payload_locked_documents_rels_faq_categories_id_idx";
  ALTER TABLE "faqs_locales" ADD COLUMN "category" varchar NOT NULL;
  ALTER TABLE "faqs_questions" ADD CONSTRAINT "faqs_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_questions_locales" ADD CONSTRAINT "faqs_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_questions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faqs_questions_order_idx" ON "faqs_questions" USING btree ("_order");
  CREATE INDEX "faqs_questions_parent_id_idx" ON "faqs_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "faqs_questions_locales_locale_parent_id_unique" ON "faqs_questions_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "faqs" DROP COLUMN "category_id";
  ALTER TABLE "faqs_locales" DROP COLUMN "question";
  ALTER TABLE "faqs_locales" DROP COLUMN "answer";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faq_categories_id";`)
}
