import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "industries_client_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "industries_client_types_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "industries_industry_goal_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "industries_industry_goal_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "industries_how_we_help" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "industries_how_we_help_locales" (
  	"heading" varchar,
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "industries_measure_progress_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "industries_measure_progress_items_locales" (
  	"heading" varchar,
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_industries_v_version_client_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_client_types_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_industries_v_version_industry_goal_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_industry_goal_paragraphs_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_industries_v_version_how_we_help" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_how_we_help_locales" (
  	"heading" varchar,
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_industries_v_version_measure_progress_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_measure_progress_items_locales" (
  	"heading" varchar,
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "industries_locales" ADD COLUMN "industry_goal_heading" varchar;
  ALTER TABLE "industries_locales" ADD COLUMN "measure_progress_heading" varchar;
  ALTER TABLE "industries_locales" ADD COLUMN "measure_progress_description" jsonb;
  ALTER TABLE "_industries_v_locales" ADD COLUMN "version_industry_goal_heading" varchar;
  ALTER TABLE "_industries_v_locales" ADD COLUMN "version_measure_progress_heading" varchar;
  ALTER TABLE "_industries_v_locales" ADD COLUMN "version_measure_progress_description" jsonb;
  ALTER TABLE "industries_client_types" ADD CONSTRAINT "industries_client_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_client_types_locales" ADD CONSTRAINT "industries_client_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries_client_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_industry_goal_paragraphs" ADD CONSTRAINT "industries_industry_goal_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_industry_goal_paragraphs_locales" ADD CONSTRAINT "industries_industry_goal_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries_industry_goal_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_how_we_help" ADD CONSTRAINT "industries_how_we_help_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_how_we_help_locales" ADD CONSTRAINT "industries_how_we_help_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries_how_we_help"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_measure_progress_items" ADD CONSTRAINT "industries_measure_progress_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_measure_progress_items_locales" ADD CONSTRAINT "industries_measure_progress_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries_measure_progress_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_client_types" ADD CONSTRAINT "_industries_v_version_client_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_client_types_locales" ADD CONSTRAINT "_industries_v_version_client_types_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v_version_client_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_industry_goal_paragraphs" ADD CONSTRAINT "_industries_v_version_industry_goal_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_industry_goal_paragraphs_locales" ADD CONSTRAINT "_industries_v_version_industry_goal_paragraphs_locales_pa_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v_version_industry_goal_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_how_we_help" ADD CONSTRAINT "_industries_v_version_how_we_help_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_how_we_help_locales" ADD CONSTRAINT "_industries_v_version_how_we_help_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v_version_how_we_help"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_measure_progress_items" ADD CONSTRAINT "_industries_v_version_measure_progress_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_measure_progress_items_locales" ADD CONSTRAINT "_industries_v_version_measure_progress_items_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v_version_measure_progress_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "industries_client_types_order_idx" ON "industries_client_types" USING btree ("_order");
  CREATE INDEX "industries_client_types_parent_id_idx" ON "industries_client_types" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industries_client_types_locales_locale_parent_id_unique" ON "industries_client_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "industries_industry_goal_paragraphs_order_idx" ON "industries_industry_goal_paragraphs" USING btree ("_order");
  CREATE INDEX "industries_industry_goal_paragraphs_parent_id_idx" ON "industries_industry_goal_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industries_industry_goal_paragraphs_locales_locale_parent_id" ON "industries_industry_goal_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "industries_how_we_help_order_idx" ON "industries_how_we_help" USING btree ("_order");
  CREATE INDEX "industries_how_we_help_parent_id_idx" ON "industries_how_we_help" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industries_how_we_help_locales_locale_parent_id_unique" ON "industries_how_we_help_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "industries_measure_progress_items_order_idx" ON "industries_measure_progress_items" USING btree ("_order");
  CREATE INDEX "industries_measure_progress_items_parent_id_idx" ON "industries_measure_progress_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industries_measure_progress_items_locales_locale_parent_id_u" ON "industries_measure_progress_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_version_client_types_order_idx" ON "_industries_v_version_client_types" USING btree ("_order");
  CREATE INDEX "_industries_v_version_client_types_parent_id_idx" ON "_industries_v_version_client_types" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_industries_v_version_client_types_locales_locale_parent_id_" ON "_industries_v_version_client_types_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_version_industry_goal_paragraphs_order_idx" ON "_industries_v_version_industry_goal_paragraphs" USING btree ("_order");
  CREATE INDEX "_industries_v_version_industry_goal_paragraphs_parent_id_idx" ON "_industries_v_version_industry_goal_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_industries_v_version_industry_goal_paragraphs_locales_local" ON "_industries_v_version_industry_goal_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_version_how_we_help_order_idx" ON "_industries_v_version_how_we_help" USING btree ("_order");
  CREATE INDEX "_industries_v_version_how_we_help_parent_id_idx" ON "_industries_v_version_how_we_help" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_industries_v_version_how_we_help_locales_locale_parent_id_u" ON "_industries_v_version_how_we_help_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_version_measure_progress_items_order_idx" ON "_industries_v_version_measure_progress_items" USING btree ("_order");
  CREATE INDEX "_industries_v_version_measure_progress_items_parent_id_idx" ON "_industries_v_version_measure_progress_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_industries_v_version_measure_progress_items_locales_locale_" ON "_industries_v_version_measure_progress_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "industries_client_types" CASCADE;
  DROP TABLE "industries_client_types_locales" CASCADE;
  DROP TABLE "industries_industry_goal_paragraphs" CASCADE;
  DROP TABLE "industries_industry_goal_paragraphs_locales" CASCADE;
  DROP TABLE "industries_how_we_help" CASCADE;
  DROP TABLE "industries_how_we_help_locales" CASCADE;
  DROP TABLE "industries_measure_progress_items" CASCADE;
  DROP TABLE "industries_measure_progress_items_locales" CASCADE;
  DROP TABLE "_industries_v_version_client_types" CASCADE;
  DROP TABLE "_industries_v_version_client_types_locales" CASCADE;
  DROP TABLE "_industries_v_version_industry_goal_paragraphs" CASCADE;
  DROP TABLE "_industries_v_version_industry_goal_paragraphs_locales" CASCADE;
  DROP TABLE "_industries_v_version_how_we_help" CASCADE;
  DROP TABLE "_industries_v_version_how_we_help_locales" CASCADE;
  DROP TABLE "_industries_v_version_measure_progress_items" CASCADE;
  DROP TABLE "_industries_v_version_measure_progress_items_locales" CASCADE;
  ALTER TABLE "industries_locales" DROP COLUMN "industry_goal_heading";
  ALTER TABLE "industries_locales" DROP COLUMN "measure_progress_heading";
  ALTER TABLE "industries_locales" DROP COLUMN "measure_progress_description";
  ALTER TABLE "_industries_v_locales" DROP COLUMN "version_industry_goal_heading";
  ALTER TABLE "_industries_v_locales" DROP COLUMN "version_measure_progress_heading";
  ALTER TABLE "_industries_v_locales" DROP COLUMN "version_measure_progress_description";`)
}
