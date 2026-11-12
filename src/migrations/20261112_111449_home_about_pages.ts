import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_services_items_icon" AS ENUM('Search', 'Wrench', 'FileText', 'Globe', 'Bot', 'Link2', 'BarChart3', 'MapPin', 'GraduationCap');
  CREATE TYPE "public"."enum_home_page_industries_items_icon" AS ENUM('Zap', 'Palette', 'Layers', 'Rocket', 'Blocks', 'Globe', 'Briefcase', 'Plane', 'GraduationCap');
  CREATE TYPE "public"."enum_home_page_why_us_points_icon" AS ENUM('Users', 'UserCheck', 'BarChart3', 'ShieldCheck', 'Sparkles', 'Handshake');
  CREATE TYPE "public"."enum_about_page_principles_items_icon" AS ENUM('Search', 'ShieldCheck', 'MessagesSquare', 'Sprout', 'FlaskConical', 'Handshake');
  CREATE TABLE "home_page_hero_avatars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_hero_avatars_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_hero_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_intro_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_intro_stats_locales" (
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"icon" "enum_home_page_services_items_icon"
  );
  
  CREATE TABLE "home_page_services_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_industries_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"icon" "enum_home_page_industries_items_icon"
  );
  
  CREATE TABLE "home_page_industries_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_why_us_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_why_us_points_icon"
  );
  
  CREATE TABLE "home_page_why_us_points_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Home page' NOT NULL,
  	"hero_primary_cta_href" varchar,
  	"hero_secondary_cta_href" varchar,
  	"hero_image_id" integer,
  	"clients_view_all_href" varchar,
  	"intro_cta_href" varchar,
  	"services_view_all_href" varchar,
  	"case_studies_view_all_href" varchar,
  	"why_us_image_id" integer,
  	"founder_letter_portrait_id" integer,
  	"founder_letter_cta_href" varchar,
  	"testimonials_view_all_href" varchar,
  	"blog_view_all_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_heading" varchar,
  	"hero_description" varchar,
  	"hero_secondary_description" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_social_proof" varchar,
  	"hero_image_alt" varchar,
  	"clients_eyebrow" varchar,
  	"clients_heading" varchar,
  	"clients_footer" varchar,
  	"clients_view_all_label" varchar,
  	"intro_heading" varchar,
  	"intro_paragraphs" varchar,
  	"intro_cta_label" varchar,
  	"services_heading" varchar,
  	"services_description" varchar,
  	"services_view_all_label" varchar,
  	"case_studies_heading" varchar,
  	"case_studies_description" varchar,
  	"case_studies_view_all_label" varchar,
  	"industries_eyebrow" varchar,
  	"industries_heading" varchar,
  	"industries_description" varchar,
  	"why_us_badge" varchar,
  	"why_us_heading" varchar,
  	"why_us_subheading" varchar,
  	"why_us_image_alt" varchar,
  	"founder_letter_eyebrow" varchar,
  	"founder_letter_heading" varchar,
  	"founder_letter_portrait_alt" varchar,
  	"founder_letter_quote" varchar,
  	"founder_letter_name" varchar,
  	"founder_letter_role" varchar,
  	"founder_letter_cta_label" varchar,
  	"testimonials_heading" varchar,
  	"testimonials_view_all_label" varchar,
  	"blog_badge" varchar,
  	"blog_heading" varchar,
  	"blog_description" varchar,
  	"blog_view_all_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_story_years" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_story_years_locales" (
  	"title" varchar NOT NULL,
  	"content" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_markets_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_principles_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_principles_items_icon"
  );
  
  CREATE TABLE "about_page_principles_items_locales" (
  	"title" varchar NOT NULL,
  	"content" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'About page' NOT NULL,
  	"hero_cta_href" varchar,
  	"hero_image_id" integer,
  	"leadership_portrait_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_paragraphs" varchar,
  	"hero_cta_label" varchar,
  	"hero_image_alt" varchar,
  	"story_eyebrow" varchar,
  	"story_heading" varchar,
  	"people_eyebrow" varchar,
  	"people_heading" varchar,
  	"people_lead" varchar,
  	"people_paragraphs" varchar,
  	"leadership_eyebrow" varchar,
  	"leadership_heading" varchar,
  	"leadership_intro" varchar,
  	"leadership_portrait_alt" varchar,
  	"leadership_quote" varchar,
  	"leadership_name" varchar,
  	"leadership_role" varchar,
  	"markets_eyebrow" varchar,
  	"markets_heading" varchar,
  	"markets_lead" varchar,
  	"markets_spans" varchar,
  	"partners_eyebrow" varchar,
  	"partners_heading" varchar,
  	"partners_description" varchar,
  	"collaboration_eyebrow" varchar,
  	"collaboration_heading" varchar,
  	"collaboration_lead" varchar,
  	"collaboration_paragraphs" varchar,
  	"mission_eyebrow" varchar,
  	"mission_statement" varchar,
  	"mission_paragraphs" varchar,
  	"principles_eyebrow" varchar,
  	"principles_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "home_page_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "about_page_find" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "home_page_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "about_page_id" integer;
  ALTER TABLE "home_page_hero_avatars" ADD CONSTRAINT "home_page_hero_avatars_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_hero_avatars" ADD CONSTRAINT "home_page_hero_avatars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_avatars_locales" ADD CONSTRAINT "home_page_hero_avatars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hero_avatars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_highlights" ADD CONSTRAINT "home_page_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_highlights_locales" ADD CONSTRAINT "home_page_hero_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hero_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_intro_stats" ADD CONSTRAINT "home_page_intro_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_intro_stats_locales" ADD CONSTRAINT "home_page_intro_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_intro_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_services_items" ADD CONSTRAINT "home_page_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_services_items_locales" ADD CONSTRAINT "home_page_services_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_services_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_industries_items" ADD CONSTRAINT "home_page_industries_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_industries_items_locales" ADD CONSTRAINT "home_page_industries_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_industries_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_why_us_points" ADD CONSTRAINT "home_page_why_us_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_why_us_points_locales" ADD CONSTRAINT "home_page_why_us_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_why_us_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_why_us_image_id_media_id_fk" FOREIGN KEY ("why_us_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_founder_letter_portrait_id_media_id_fk" FOREIGN KEY ("founder_letter_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_years" ADD CONSTRAINT "about_page_story_years_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_years_locales" ADD CONSTRAINT "about_page_story_years_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_story_years"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_markets_countries" ADD CONSTRAINT "about_page_markets_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_principles_items" ADD CONSTRAINT "about_page_principles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_principles_items_locales" ADD CONSTRAINT "about_page_principles_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_principles_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_leadership_portrait_id_media_id_fk" FOREIGN KEY ("leadership_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_hero_avatars_order_idx" ON "home_page_hero_avatars" USING btree ("_order");
  CREATE INDEX "home_page_hero_avatars_parent_id_idx" ON "home_page_hero_avatars" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_avatars_image_idx" ON "home_page_hero_avatars" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_page_hero_avatars_locales_locale_parent_id_unique" ON "home_page_hero_avatars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_highlights_order_idx" ON "home_page_hero_highlights" USING btree ("_order");
  CREATE INDEX "home_page_hero_highlights_parent_id_idx" ON "home_page_hero_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_hero_highlights_locales_locale_parent_id_unique" ON "home_page_hero_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_intro_stats_order_idx" ON "home_page_intro_stats" USING btree ("_order");
  CREATE INDEX "home_page_intro_stats_parent_id_idx" ON "home_page_intro_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_intro_stats_locales_locale_parent_id_unique" ON "home_page_intro_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_services_items_order_idx" ON "home_page_services_items" USING btree ("_order");
  CREATE INDEX "home_page_services_items_parent_id_idx" ON "home_page_services_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_services_items_locales_locale_parent_id_unique" ON "home_page_services_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_industries_items_order_idx" ON "home_page_industries_items" USING btree ("_order");
  CREATE INDEX "home_page_industries_items_parent_id_idx" ON "home_page_industries_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_industries_items_locales_locale_parent_id_unique" ON "home_page_industries_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_why_us_points_order_idx" ON "home_page_why_us_points" USING btree ("_order");
  CREATE INDEX "home_page_why_us_points_parent_id_idx" ON "home_page_why_us_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_why_us_points_locales_locale_parent_id_unique" ON "home_page_why_us_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_why_us_why_us_image_idx" ON "home_page" USING btree ("why_us_image_id");
  CREATE INDEX "home_page_founder_letter_founder_letter_portrait_idx" ON "home_page" USING btree ("founder_letter_portrait_id");
  CREATE INDEX "home_page_updated_at_idx" ON "home_page" USING btree ("updated_at");
  CREATE INDEX "home_page_created_at_idx" ON "home_page" USING btree ("created_at");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_story_years_order_idx" ON "about_page_story_years" USING btree ("_order");
  CREATE INDEX "about_page_story_years_parent_id_idx" ON "about_page_story_years" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_story_years_locales_locale_parent_id_unique" ON "about_page_story_years_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_markets_countries_order_idx" ON "about_page_markets_countries" USING btree ("_order");
  CREATE INDEX "about_page_markets_countries_parent_id_idx" ON "about_page_markets_countries" USING btree ("_parent_id");
  CREATE INDEX "about_page_principles_items_order_idx" ON "about_page_principles_items" USING btree ("_order");
  CREATE INDEX "about_page_principles_items_parent_id_idx" ON "about_page_principles_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_principles_items_locales_locale_parent_id_unique" ON "about_page_principles_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_hero_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_leadership_leadership_portrait_idx" ON "about_page" USING btree ("leadership_portrait_id");
  CREATE INDEX "about_page_updated_at_idx" ON "about_page" USING btree ("updated_at");
  CREATE INDEX "about_page_created_at_idx" ON "about_page" USING btree ("created_at");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_page_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_about_page_fk" FOREIGN KEY ("about_page_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_home_page_id_idx" ON "payload_locked_documents_rels" USING btree ("home_page_id");
  CREATE INDEX "payload_locked_documents_rels_about_page_id_idx" ON "payload_locked_documents_rels" USING btree ("about_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_hero_avatars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_hero_avatars_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_hero_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_hero_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_intro_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_intro_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_services_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_services_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_industries_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_industries_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_why_us_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_why_us_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_story_years" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_story_years_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_markets_countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_principles_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_principles_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_hero_avatars" CASCADE;
  DROP TABLE "home_page_hero_avatars_locales" CASCADE;
  DROP TABLE "home_page_hero_highlights" CASCADE;
  DROP TABLE "home_page_hero_highlights_locales" CASCADE;
  DROP TABLE "home_page_intro_stats" CASCADE;
  DROP TABLE "home_page_intro_stats_locales" CASCADE;
  DROP TABLE "home_page_services_items" CASCADE;
  DROP TABLE "home_page_services_items_locales" CASCADE;
  DROP TABLE "home_page_industries_items" CASCADE;
  DROP TABLE "home_page_industries_items_locales" CASCADE;
  DROP TABLE "home_page_why_us_points" CASCADE;
  DROP TABLE "home_page_why_us_points_locales" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "about_page_story_years" CASCADE;
  DROP TABLE "about_page_story_years_locales" CASCADE;
  DROP TABLE "about_page_markets_countries" CASCADE;
  DROP TABLE "about_page_principles_items" CASCADE;
  DROP TABLE "about_page_principles_items_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_home_page_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_about_page_fk";
  
  DROP INDEX "payload_locked_documents_rels_home_page_id_idx";
  DROP INDEX "payload_locked_documents_rels_about_page_id_idx";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "home_page_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN "about_page_find";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "home_page_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "about_page_id";
  DROP TYPE "public"."enum_home_page_services_items_icon";
  DROP TYPE "public"."enum_home_page_industries_items_icon";
  DROP TYPE "public"."enum_home_page_why_us_points_icon";
  DROP TYPE "public"."enum_about_page_principles_items_icon";`)
}
