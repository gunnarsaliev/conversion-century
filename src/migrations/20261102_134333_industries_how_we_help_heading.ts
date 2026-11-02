import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "industries_how_we_help_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "industries_how_we_help_items_locales" (
  	"heading" varchar,
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_industries_v_version_how_we_help_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_industries_v_version_how_we_help_items_locales" (
  	"heading" varchar,
  	"paragraph" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "industries_how_we_help" CASCADE;
  DROP TABLE "industries_how_we_help_locales" CASCADE;
  DROP TABLE "_industries_v_version_how_we_help" CASCADE;
  DROP TABLE "_industries_v_version_how_we_help_locales" CASCADE;
  ALTER TABLE "industries_locales" ADD COLUMN "how_we_help_heading" varchar;
  ALTER TABLE "_industries_v_locales" ADD COLUMN "version_how_we_help_heading" varchar;
  ALTER TABLE "industries_how_we_help_items" ADD CONSTRAINT "industries_how_we_help_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_how_we_help_items_locales" ADD CONSTRAINT "industries_how_we_help_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries_how_we_help_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_how_we_help_items" ADD CONSTRAINT "_industries_v_version_how_we_help_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_how_we_help_items_locales" ADD CONSTRAINT "_industries_v_version_how_we_help_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v_version_how_we_help_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "industries_how_we_help_items_order_idx" ON "industries_how_we_help_items" USING btree ("_order");
  CREATE INDEX "industries_how_we_help_items_parent_id_idx" ON "industries_how_we_help_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industries_how_we_help_items_locales_locale_parent_id_unique" ON "industries_how_we_help_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_version_how_we_help_items_order_idx" ON "_industries_v_version_how_we_help_items" USING btree ("_order");
  CREATE INDEX "_industries_v_version_how_we_help_items_parent_id_idx" ON "_industries_v_version_how_we_help_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_industries_v_version_how_we_help_items_locales_locale_paren" ON "_industries_v_version_how_we_help_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
  
  DROP TABLE "industries_how_we_help_items" CASCADE;
  DROP TABLE "industries_how_we_help_items_locales" CASCADE;
  DROP TABLE "_industries_v_version_how_we_help_items" CASCADE;
  DROP TABLE "_industries_v_version_how_we_help_items_locales" CASCADE;
  ALTER TABLE "industries_how_we_help" ADD CONSTRAINT "industries_how_we_help_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_how_we_help_locales" ADD CONSTRAINT "industries_how_we_help_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries_how_we_help"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_how_we_help" ADD CONSTRAINT "_industries_v_version_how_we_help_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v_version_how_we_help_locales" ADD CONSTRAINT "_industries_v_version_how_we_help_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v_version_how_we_help"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "industries_how_we_help_order_idx" ON "industries_how_we_help" USING btree ("_order");
  CREATE INDEX "industries_how_we_help_parent_id_idx" ON "industries_how_we_help" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "industries_how_we_help_locales_locale_parent_id_unique" ON "industries_how_we_help_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_version_how_we_help_order_idx" ON "_industries_v_version_how_we_help" USING btree ("_order");
  CREATE INDEX "_industries_v_version_how_we_help_parent_id_idx" ON "_industries_v_version_how_we_help" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_industries_v_version_how_we_help_locales_locale_parent_id_u" ON "_industries_v_version_how_we_help_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "industries_locales" DROP COLUMN "how_we_help_heading";
  ALTER TABLE "_industries_v_locales" DROP COLUMN "version_how_we_help_heading";`)
}
