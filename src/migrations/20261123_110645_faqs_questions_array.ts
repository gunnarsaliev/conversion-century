import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  DROP TABLE "faqs_locales" CASCADE;
  ALTER TABLE "faqs" ADD COLUMN "title" varchar;
  ALTER TABLE "faqs_questions" ADD CONSTRAINT "faqs_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_questions_locales" ADD CONSTRAINT "faqs_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_questions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "faqs_questions_order_idx" ON "faqs_questions" USING btree ("_order");
  CREATE INDEX "faqs_questions_parent_id_idx" ON "faqs_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "faqs_questions_locales_locale_parent_id_unique" ON "faqs_questions_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "faqs_questions" CASCADE;
  DROP TABLE "faqs_questions_locales" CASCADE;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "faqs" DROP COLUMN "title";`)
}
