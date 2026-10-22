import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Baseline of the schema as it was before migrations were introduced.
// Existing databases were built by dev-mode schema push, so on those the
// tables already exist and this only records itself as run.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await db.execute(sql`SELECT to_regclass('public.clients') AS t`)
  if (existing.rows[0]?.t) {
    payload.logger.info('initial: schema already exists (built by push), skipping')
    return
  }

  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'bg');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'on-leave', 'inactive');
  CREATE TYPE "public"."enum_users_role" AS ENUM('user', 'admin', 'editor');
  CREATE TYPE "public"."enum_clients_region" AS ENUM('EU', 'AL', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'MD', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB', 'US', 'OTHER');
  CREATE TYPE "public"."enum_clients_status" AS ENUM('lead', 'consultation', 'active', 'inactive');
  CREATE TYPE "public"."enum_clients_business_size" AS ENUM('small-business', 'midmarket', 'enterprise');
  CREATE TYPE "public"."enum_blog_categories" AS ENUM('web-development', 'seo-performance', 'content-optimization', 'blogging', 'seo-consulting', 'keyword-research', 'link-building');
  CREATE TYPE "public"."enum_blog_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_v_version_categories" AS ENUM('web-development', 'seo-performance', 'content-optimization', 'blogging', 'seo-consulting', 'keyword-research', 'link-building');
  CREATE TYPE "public"."enum__blog_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blog_v_published_locale" AS ENUM('en', 'bg');
  CREATE TYPE "public"."enum_work_checklist_type" AS ENUM('301s-and-302s', '404s', '500s', 'additional', 'breadcrumbs', 'duplicate-pages', 'force-https', 'general', 'google-analytics-and-gsc', 'h1', 'images', 'indexation', 'internal-linking', 'keywords', 'localized-content', 'meta-titles-and-descriptions', 'navigation', 'page-content', 'pagination', 'robots-txt', 'schema-markup', 'site-speed', 'url-structure', 'xml-sitemap');
  CREATE TYPE "public"."enum_work_checklist_priority" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "public"."enum_work_checklist_label" AS ENUM('technical', 'copyright');
  CREATE TYPE "public"."enum_work_checklist_team" AS ENUM('content', 'dev', 'seo');
  CREATE TYPE "public"."enum_client_checklist_progress_status" AS ENUM('pending', 'in-progress', 'done');
  CREATE TYPE "public"."enum_job_listings_type" AS ENUM('part-time', 'full-time', 'full-time-hybrid');
  CREATE TYPE "public"."enum_job_applicants_status" AS ENUM('new', 'reviewing', 'shortlisted', 'rejected', 'hired');
  CREATE TYPE "public"."enum_industries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__industries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__industries_v_published_locale" AS ENUM('en', 'bg');
  CREATE TYPE "public"."enum_events_type" AS ENUM('conference', 'webinar', 'workshop', 'podcast', 'interview', 'press');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_type" AS ENUM('conference', 'webinar', 'workshop', 'podcast', 'interview', 'press');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en', 'bg');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_testimonials_client_type" AS ENUM('existing', 'new');
  CREATE TYPE "public"."enum_offers_status" AS ENUM('draft', 'sent', 'accepted', 'declined');
  CREATE TYPE "public"."enum_offers_metrics_source" AS ENUM('manual', 'ahrefs', 'semrush', 'other');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('consultation', 'contract-renewal', 'offer-accepted');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'en', 'bg');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'notifyContractRenewals', 'createCollectionExport', 'createCollectionImport', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'notifyContractRenewals', 'createCollectionExport', 'createCollectionImport', 'schedulePublish');
  CREATE TABLE "users_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"file_id" integer NOT NULL,
  	"notes" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"job_title" varchar,
  	"about" varchar,
  	"profile_image_id" integer,
  	"status" "enum_users_status" DEFAULT 'active' NOT NULL,
  	"birthday" timestamp(3) with time zone,
  	"work_birthday" timestamp(3) with time zone,
  	"dismissed_banners" jsonb DEFAULT '[]'::jsonb,
  	"role" "enum_users_role" DEFAULT 'user' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "clients_website_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "clients_website_login_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "clients_report_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "clients_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"file_id" integer NOT NULL,
  	"notes" varchar
  );
  
  CREATE TABLE "clients_region" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_region",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar NOT NULL,
  	"logo_id" integer,
  	"show_on_website" boolean DEFAULT false,
  	"contact_name" varchar,
  	"contact_role" varchar,
  	"profile_image_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"link_building_docs" varchar,
  	"blog_docs" varchar,
  	"status" "enum_clients_status" DEFAULT 'lead' NOT NULL,
  	"contract_date" timestamp(3) with time zone,
  	"notes" varchar,
  	"description" jsonb,
  	"testimonial" jsonb,
  	"business_size" "enum_clients_business_size",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clients_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"services_id" integer,
  	"industries_id" integer
  );
  
  CREATE TABLE "services_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_hero_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_includes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_includes_items_locales" (
  	"title" varchar NOT NULL,
  	"paragraphs" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_priorities_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_priorities_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_process_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_fit_right_choice_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_fit_right_choice_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_why_us_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_why_us_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_measurement_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_measurement_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_team_extension_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_team_extension_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"price" numeric,
  	"fit_not_right_cta_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_description" varchar,
  	"partnership_eyebrow" varchar,
  	"partnership_heading" varchar,
  	"partnership_paragraphs" varchar,
  	"what_is_heading" varchar,
  	"what_is_paragraphs" varchar,
  	"includes_heading" varchar,
  	"includes_description" varchar,
  	"priorities_heading" varchar,
  	"priorities_paragraphs" varchar,
  	"priorities_list_intro" varchar,
  	"process_heading" varchar,
  	"process_note" varchar,
  	"fit_right_choice_heading" varchar,
  	"fit_right_choice_list_intro" varchar,
  	"fit_not_right_heading" varchar,
  	"fit_not_right_paragraphs" varchar,
  	"fit_not_right_cta_label" varchar,
  	"why_us_heading" varchar,
  	"measurement_heading" varchar,
  	"measurement_paragraphs" varchar,
  	"measurement_list_intro" varchar,
  	"team_extension_heading" varchar,
  	"team_extension_paragraphs" varchar,
  	"team_extension_list_intro" varchar,
  	"faq_heading" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'documents',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "blog_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_blog_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blog_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "blog_locales" (
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_blog_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__blog_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_blog_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_featured_image_id" integer,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blog_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__blog_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_blog_v_locales" (
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "work_checklist_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "work_checklist" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_work_checklist_type" NOT NULL,
  	"short_description" jsonb,
  	"description" jsonb,
  	"priority" "enum_work_checklist_priority",
  	"label" "enum_work_checklist_label",
  	"team" "enum_work_checklist_team",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "client_checklist_progress" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"checklist_item_id" integer NOT NULL,
  	"status" "enum_client_checklist_progress_status" DEFAULT 'pending' NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_listings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_job_listings_type" DEFAULT 'full-time' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_listings_locales" (
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"location" varchar,
  	"description" jsonb,
  	"responsibilities" jsonb,
  	"requirements" jsonb,
  	"offer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "job_applicants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_job_applicants_status" DEFAULT 'new' NOT NULL,
  	"message" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL
  );
  
  CREATE TABLE "case_studies_achievements_locales" (
  	"metric" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_locales" (
  	"title" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"overview" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "industries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_industries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "industries_locales" (
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_industries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__industries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__industries_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_industries_v_locales" (
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_description" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solutions_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_hero_highlights_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_concerns_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_concerns_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_audience_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_audience_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_partner_needs_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_partner_needs_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_why_us_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_why_us_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_includes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_includes_items_locales" (
  	"title" varchar NOT NULL,
  	"paragraphs" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_outcomes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_outcomes_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_process_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_team_extension_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_team_extension_list_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "solutions_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "solutions_locales" (
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_paragraphs" varchar,
  	"concerns_heading" varchar,
  	"business_growth_eyebrow" varchar,
  	"business_growth_heading" varchar,
  	"business_growth_lead" varchar,
  	"business_growth_paragraphs" varchar,
  	"audience_heading" varchar,
  	"audience_paragraphs" varchar,
  	"audience_list_intro" varchar,
  	"partner_needs_heading" varchar,
  	"partner_needs_paragraphs" varchar,
  	"partner_needs_list_intro" varchar,
  	"why_us_heading" varchar,
  	"includes_heading" varchar,
  	"includes_description" varchar,
  	"outcomes_heading" varchar,
  	"outcomes_description" varchar,
  	"process_heading" varchar,
  	"process_note" varchar,
  	"team_extension_heading" varchar,
  	"team_extension_paragraphs" varchar,
  	"team_extension_list_intro" varchar,
  	"faq_heading" varchar,
  	"consultation_heading" varchar,
  	"consultation_description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_events_type" DEFAULT 'conference',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"image_id" integer,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"location" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "enum__events_v_version_type" DEFAULT 'conference',
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_external_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_location" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"profile_image_id" integer,
  	"testimonial" varchar NOT NULL,
  	"status" "enum_testimonials_status" DEFAULT 'pending' NOT NULL,
  	"client_type" "enum_testimonials_client_type" DEFAULT 'existing' NOT NULL,
  	"client_id" integer,
  	"new_client_company_name" varchar,
  	"new_client_role" varchar,
  	"new_client_website" varchar,
  	"new_client_logo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offers_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer NOT NULL,
  	"hours" numeric NOT NULL
  );
  
  CREATE TABLE "offers_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL,
  	"position" numeric NOT NULL,
  	"volume" numeric NOT NULL
  );
  
  CREATE TABLE "offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"prepared_by_id" integer,
  	"status" "enum_offers_status" DEFAULT 'draft' NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"valid_until" timestamp(3) with time zone NOT NULL,
  	"fixed_price" numeric,
  	"discount" numeric,
  	"description" jsonb,
  	"metrics_source" "enum_offers_metrics_source" DEFAULT 'manual',
  	"metrics_date" timestamp(3) with time zone,
  	"metrics_domain_rating" numeric,
  	"metrics_backlinks" numeric,
  	"metrics_organic_keywords" numeric,
  	"metrics_organic_traffic" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar,
  	"href" varchar,
  	"dedupe_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'users' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'users' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"meta" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"clients_id" integer,
  	"services_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"blog_id" integer,
  	"work_checklist_id" integer,
  	"client_checklist_progress_id" integer,
  	"job_listings_id" integer,
  	"job_applicants_id" integer,
  	"case_studies_id" integer,
  	"industries_id" integer,
  	"solutions_id" integer,
  	"events_id" integer,
  	"testimonials_id" integer,
  	"offers_id" integer,
  	"notifications_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_documents" ADD CONSTRAINT "users_documents_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_documents" ADD CONSTRAINT "users_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_website_links" ADD CONSTRAINT "clients_website_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_website_login_links" ADD CONSTRAINT "clients_website_login_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_report_urls" ADD CONSTRAINT "clients_report_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_documents" ADD CONSTRAINT "clients_documents_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_documents" ADD CONSTRAINT "clients_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_region" ADD CONSTRAINT "clients_region_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clients_rels" ADD CONSTRAINT "clients_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_hero_highlights" ADD CONSTRAINT "services_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_hero_highlights_locales" ADD CONSTRAINT "services_hero_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_hero_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_includes_items" ADD CONSTRAINT "services_includes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_includes_items_locales" ADD CONSTRAINT "services_includes_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_includes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_priorities_list" ADD CONSTRAINT "services_priorities_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_priorities_list_locales" ADD CONSTRAINT "services_priorities_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_priorities_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process_steps" ADD CONSTRAINT "services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process_steps_locales" ADD CONSTRAINT "services_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_fit_right_choice_list" ADD CONSTRAINT "services_fit_right_choice_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_fit_right_choice_list_locales" ADD CONSTRAINT "services_fit_right_choice_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_fit_right_choice_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_why_us_items" ADD CONSTRAINT "services_why_us_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_why_us_items_locales" ADD CONSTRAINT "services_why_us_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_why_us_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_measurement_list" ADD CONSTRAINT "services_measurement_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_measurement_list_locales" ADD CONSTRAINT "services_measurement_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_measurement_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_team_extension_list" ADD CONSTRAINT "services_team_extension_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_team_extension_list_locales" ADD CONSTRAINT "services_team_extension_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_team_extension_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faq_items" ADD CONSTRAINT "services_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faq_items_locales" ADD CONSTRAINT "services_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog" ADD CONSTRAINT "blog_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_locales" ADD CONSTRAINT "blog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v_version_categories" ADD CONSTRAINT "_blog_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blog_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_parent_id_blog_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v" ADD CONSTRAINT "_blog_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blog_v_locales" ADD CONSTRAINT "_blog_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blog_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_checklist_links" ADD CONSTRAINT "work_checklist_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "client_checklist_progress" ADD CONSTRAINT "client_checklist_progress_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "client_checklist_progress" ADD CONSTRAINT "client_checklist_progress_checklist_item_id_work_checklist_id_fk" FOREIGN KEY ("checklist_item_id") REFERENCES "public"."work_checklist"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_listings_locales" ADD CONSTRAINT "job_listings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_listings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_achievements" ADD CONSTRAINT "case_studies_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_achievements_locales" ADD CONSTRAINT "case_studies_achievements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries_locales" ADD CONSTRAINT "industries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_parent_id_industries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v_locales" ADD CONSTRAINT "_industries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_hero_highlights" ADD CONSTRAINT "solutions_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_hero_highlights_locales" ADD CONSTRAINT "solutions_hero_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_hero_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_concerns_items" ADD CONSTRAINT "solutions_concerns_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_concerns_items_locales" ADD CONSTRAINT "solutions_concerns_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_concerns_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_audience_list" ADD CONSTRAINT "solutions_audience_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_audience_list_locales" ADD CONSTRAINT "solutions_audience_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_audience_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_partner_needs_list" ADD CONSTRAINT "solutions_partner_needs_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_partner_needs_list_locales" ADD CONSTRAINT "solutions_partner_needs_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_partner_needs_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_why_us_items" ADD CONSTRAINT "solutions_why_us_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_why_us_items_locales" ADD CONSTRAINT "solutions_why_us_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_why_us_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_includes_items" ADD CONSTRAINT "solutions_includes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_includes_items_locales" ADD CONSTRAINT "solutions_includes_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_includes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_outcomes_items" ADD CONSTRAINT "solutions_outcomes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_outcomes_items_locales" ADD CONSTRAINT "solutions_outcomes_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_outcomes_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_process_steps" ADD CONSTRAINT "solutions_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_process_steps_locales" ADD CONSTRAINT "solutions_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_team_extension_list" ADD CONSTRAINT "solutions_team_extension_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_team_extension_list_locales" ADD CONSTRAINT "solutions_team_extension_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_team_extension_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_faq_items" ADD CONSTRAINT "solutions_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_faq_items_locales" ADD CONSTRAINT "solutions_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_locales" ADD CONSTRAINT "solutions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_new_client_logo_id_media_id_fk" FOREIGN KEY ("new_client_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers_services" ADD CONSTRAINT "offers_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers_services" ADD CONSTRAINT "offers_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_keywords" ADD CONSTRAINT "offers_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_prepared_by_id_users_id_fk" FOREIGN KEY ("prepared_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications_rels" ADD CONSTRAINT "notifications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "notifications_rels" ADD CONSTRAINT "notifications_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_checklist_fk" FOREIGN KEY ("work_checklist_id") REFERENCES "public"."work_checklist"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_client_checklist_progress_fk" FOREIGN KEY ("client_checklist_progress_id") REFERENCES "public"."client_checklist_progress"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_listings_fk" FOREIGN KEY ("job_listings_id") REFERENCES "public"."job_listings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applicants_fk" FOREIGN KEY ("job_applicants_id") REFERENCES "public"."job_applicants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offers_fk" FOREIGN KEY ("offers_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_documents_order_idx" ON "users_documents" USING btree ("_order");
  CREATE INDEX "users_documents_parent_id_idx" ON "users_documents" USING btree ("_parent_id");
  CREATE INDEX "users_documents_file_idx" ON "users_documents" USING btree ("file_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_profile_image_idx" ON "users" USING btree ("profile_image_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "clients_website_links_order_idx" ON "clients_website_links" USING btree ("_order");
  CREATE INDEX "clients_website_links_parent_id_idx" ON "clients_website_links" USING btree ("_parent_id");
  CREATE INDEX "clients_website_login_links_order_idx" ON "clients_website_login_links" USING btree ("_order");
  CREATE INDEX "clients_website_login_links_parent_id_idx" ON "clients_website_login_links" USING btree ("_parent_id");
  CREATE INDEX "clients_report_urls_order_idx" ON "clients_report_urls" USING btree ("_order");
  CREATE INDEX "clients_report_urls_parent_id_idx" ON "clients_report_urls" USING btree ("_parent_id");
  CREATE INDEX "clients_documents_order_idx" ON "clients_documents" USING btree ("_order");
  CREATE INDEX "clients_documents_parent_id_idx" ON "clients_documents" USING btree ("_parent_id");
  CREATE INDEX "clients_documents_file_idx" ON "clients_documents" USING btree ("file_id");
  CREATE INDEX "clients_region_order_idx" ON "clients_region" USING btree ("order");
  CREATE INDEX "clients_region_parent_idx" ON "clients_region" USING btree ("parent_id");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_profile_image_idx" ON "clients" USING btree ("profile_image_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "clients_rels_order_idx" ON "clients_rels" USING btree ("order");
  CREATE INDEX "clients_rels_parent_idx" ON "clients_rels" USING btree ("parent_id");
  CREATE INDEX "clients_rels_path_idx" ON "clients_rels" USING btree ("path");
  CREATE INDEX "clients_rels_users_id_idx" ON "clients_rels" USING btree ("users_id");
  CREATE INDEX "clients_rels_services_id_idx" ON "clients_rels" USING btree ("services_id");
  CREATE INDEX "clients_rels_industries_id_idx" ON "clients_rels" USING btree ("industries_id");
  CREATE INDEX "services_hero_highlights_order_idx" ON "services_hero_highlights" USING btree ("_order");
  CREATE INDEX "services_hero_highlights_parent_id_idx" ON "services_hero_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_hero_highlights_locales_locale_parent_id_unique" ON "services_hero_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_includes_items_order_idx" ON "services_includes_items" USING btree ("_order");
  CREATE INDEX "services_includes_items_parent_id_idx" ON "services_includes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_includes_items_locales_locale_parent_id_unique" ON "services_includes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_priorities_list_order_idx" ON "services_priorities_list" USING btree ("_order");
  CREATE INDEX "services_priorities_list_parent_id_idx" ON "services_priorities_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_priorities_list_locales_locale_parent_id_unique" ON "services_priorities_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_process_steps_order_idx" ON "services_process_steps" USING btree ("_order");
  CREATE INDEX "services_process_steps_parent_id_idx" ON "services_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_process_steps_locales_locale_parent_id_unique" ON "services_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_fit_right_choice_list_order_idx" ON "services_fit_right_choice_list" USING btree ("_order");
  CREATE INDEX "services_fit_right_choice_list_parent_id_idx" ON "services_fit_right_choice_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_fit_right_choice_list_locales_locale_parent_id_uniq" ON "services_fit_right_choice_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_why_us_items_order_idx" ON "services_why_us_items" USING btree ("_order");
  CREATE INDEX "services_why_us_items_parent_id_idx" ON "services_why_us_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_why_us_items_locales_locale_parent_id_unique" ON "services_why_us_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_measurement_list_order_idx" ON "services_measurement_list" USING btree ("_order");
  CREATE INDEX "services_measurement_list_parent_id_idx" ON "services_measurement_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_measurement_list_locales_locale_parent_id_unique" ON "services_measurement_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_team_extension_list_order_idx" ON "services_team_extension_list" USING btree ("_order");
  CREATE INDEX "services_team_extension_list_parent_id_idx" ON "services_team_extension_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_team_extension_list_locales_locale_parent_id_unique" ON "services_team_extension_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_faq_items_order_idx" ON "services_faq_items" USING btree ("_order");
  CREATE INDEX "services_faq_items_parent_id_idx" ON "services_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_faq_items_locales_locale_parent_id_unique" ON "services_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "blog_categories_order_idx" ON "blog_categories" USING btree ("order");
  CREATE INDEX "blog_categories_parent_idx" ON "blog_categories" USING btree ("parent_id");
  CREATE INDEX "blog_featured_image_idx" ON "blog" USING btree ("featured_image_id");
  CREATE INDEX "blog_author_idx" ON "blog" USING btree ("author_id");
  CREATE INDEX "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX "blog__status_idx" ON "blog" USING btree ("_status");
  CREATE UNIQUE INDEX "blog_slug_idx" ON "blog_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "blog_locales_locale_parent_id_unique" ON "blog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_blog_v_version_categories_order_idx" ON "_blog_v_version_categories" USING btree ("order");
  CREATE INDEX "_blog_v_version_categories_parent_idx" ON "_blog_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_blog_v_parent_idx" ON "_blog_v" USING btree ("parent_id");
  CREATE INDEX "_blog_v_version_version_featured_image_idx" ON "_blog_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_blog_v_version_version_author_idx" ON "_blog_v" USING btree ("version_author_id");
  CREATE INDEX "_blog_v_version_version_updated_at_idx" ON "_blog_v" USING btree ("version_updated_at");
  CREATE INDEX "_blog_v_version_version_created_at_idx" ON "_blog_v" USING btree ("version_created_at");
  CREATE INDEX "_blog_v_version_version__status_idx" ON "_blog_v" USING btree ("version__status");
  CREATE INDEX "_blog_v_created_at_idx" ON "_blog_v" USING btree ("created_at");
  CREATE INDEX "_blog_v_updated_at_idx" ON "_blog_v" USING btree ("updated_at");
  CREATE INDEX "_blog_v_snapshot_idx" ON "_blog_v" USING btree ("snapshot");
  CREATE INDEX "_blog_v_published_locale_idx" ON "_blog_v" USING btree ("published_locale");
  CREATE INDEX "_blog_v_latest_idx" ON "_blog_v" USING btree ("latest");
  CREATE INDEX "_blog_v_autosave_idx" ON "_blog_v" USING btree ("autosave");
  CREATE INDEX "_blog_v_version_version_slug_idx" ON "_blog_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_blog_v_locales_locale_parent_id_unique" ON "_blog_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "work_checklist_links_order_idx" ON "work_checklist_links" USING btree ("_order");
  CREATE INDEX "work_checklist_links_parent_id_idx" ON "work_checklist_links" USING btree ("_parent_id");
  CREATE INDEX "work_checklist_updated_at_idx" ON "work_checklist" USING btree ("updated_at");
  CREATE INDEX "work_checklist_created_at_idx" ON "work_checklist" USING btree ("created_at");
  CREATE INDEX "client_checklist_progress_client_idx" ON "client_checklist_progress" USING btree ("client_id");
  CREATE INDEX "client_checklist_progress_checklist_item_idx" ON "client_checklist_progress" USING btree ("checklist_item_id");
  CREATE INDEX "client_checklist_progress_updated_at_idx" ON "client_checklist_progress" USING btree ("updated_at");
  CREATE INDEX "client_checklist_progress_created_at_idx" ON "client_checklist_progress" USING btree ("created_at");
  CREATE INDEX "job_listings_updated_at_idx" ON "job_listings" USING btree ("updated_at");
  CREATE INDEX "job_listings_created_at_idx" ON "job_listings" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_listings_slug_idx" ON "job_listings_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "job_listings_locales_locale_parent_id_unique" ON "job_listings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "job_applicants_updated_at_idx" ON "job_applicants" USING btree ("updated_at");
  CREATE INDEX "job_applicants_created_at_idx" ON "job_applicants" USING btree ("created_at");
  CREATE INDEX "case_studies_achievements_order_idx" ON "case_studies_achievements" USING btree ("_order");
  CREATE INDEX "case_studies_achievements_parent_id_idx" ON "case_studies_achievements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "case_studies_achievements_locales_locale_parent_id_unique" ON "case_studies_achievements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_client_idx" ON "case_studies" USING btree ("client_id");
  CREATE INDEX "case_studies_image_idx" ON "case_studies" USING btree ("image_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "industries_image_idx" ON "industries" USING btree ("image_id");
  CREATE INDEX "industries_updated_at_idx" ON "industries" USING btree ("updated_at");
  CREATE INDEX "industries_created_at_idx" ON "industries" USING btree ("created_at");
  CREATE INDEX "industries__status_idx" ON "industries" USING btree ("_status");
  CREATE UNIQUE INDEX "industries_slug_idx" ON "industries_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "industries_locales_locale_parent_id_unique" ON "industries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_industries_v_parent_idx" ON "_industries_v" USING btree ("parent_id");
  CREATE INDEX "_industries_v_version_version_image_idx" ON "_industries_v" USING btree ("version_image_id");
  CREATE INDEX "_industries_v_version_version_updated_at_idx" ON "_industries_v" USING btree ("version_updated_at");
  CREATE INDEX "_industries_v_version_version_created_at_idx" ON "_industries_v" USING btree ("version_created_at");
  CREATE INDEX "_industries_v_version_version__status_idx" ON "_industries_v" USING btree ("version__status");
  CREATE INDEX "_industries_v_created_at_idx" ON "_industries_v" USING btree ("created_at");
  CREATE INDEX "_industries_v_updated_at_idx" ON "_industries_v" USING btree ("updated_at");
  CREATE INDEX "_industries_v_snapshot_idx" ON "_industries_v" USING btree ("snapshot");
  CREATE INDEX "_industries_v_published_locale_idx" ON "_industries_v" USING btree ("published_locale");
  CREATE INDEX "_industries_v_latest_idx" ON "_industries_v" USING btree ("latest");
  CREATE INDEX "_industries_v_autosave_idx" ON "_industries_v" USING btree ("autosave");
  CREATE INDEX "_industries_v_version_version_slug_idx" ON "_industries_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_industries_v_locales_locale_parent_id_unique" ON "_industries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_hero_highlights_order_idx" ON "solutions_hero_highlights" USING btree ("_order");
  CREATE INDEX "solutions_hero_highlights_parent_id_idx" ON "solutions_hero_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_hero_highlights_locales_locale_parent_id_unique" ON "solutions_hero_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_concerns_items_order_idx" ON "solutions_concerns_items" USING btree ("_order");
  CREATE INDEX "solutions_concerns_items_parent_id_idx" ON "solutions_concerns_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_concerns_items_locales_locale_parent_id_unique" ON "solutions_concerns_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_audience_list_order_idx" ON "solutions_audience_list" USING btree ("_order");
  CREATE INDEX "solutions_audience_list_parent_id_idx" ON "solutions_audience_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_audience_list_locales_locale_parent_id_unique" ON "solutions_audience_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_partner_needs_list_order_idx" ON "solutions_partner_needs_list" USING btree ("_order");
  CREATE INDEX "solutions_partner_needs_list_parent_id_idx" ON "solutions_partner_needs_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_partner_needs_list_locales_locale_parent_id_unique" ON "solutions_partner_needs_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_why_us_items_order_idx" ON "solutions_why_us_items" USING btree ("_order");
  CREATE INDEX "solutions_why_us_items_parent_id_idx" ON "solutions_why_us_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_why_us_items_locales_locale_parent_id_unique" ON "solutions_why_us_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_includes_items_order_idx" ON "solutions_includes_items" USING btree ("_order");
  CREATE INDEX "solutions_includes_items_parent_id_idx" ON "solutions_includes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_includes_items_locales_locale_parent_id_unique" ON "solutions_includes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_outcomes_items_order_idx" ON "solutions_outcomes_items" USING btree ("_order");
  CREATE INDEX "solutions_outcomes_items_parent_id_idx" ON "solutions_outcomes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_outcomes_items_locales_locale_parent_id_unique" ON "solutions_outcomes_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_process_steps_order_idx" ON "solutions_process_steps" USING btree ("_order");
  CREATE INDEX "solutions_process_steps_parent_id_idx" ON "solutions_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_process_steps_locales_locale_parent_id_unique" ON "solutions_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_team_extension_list_order_idx" ON "solutions_team_extension_list" USING btree ("_order");
  CREATE INDEX "solutions_team_extension_list_parent_id_idx" ON "solutions_team_extension_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_team_extension_list_locales_locale_parent_id_uniqu" ON "solutions_team_extension_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_faq_items_order_idx" ON "solutions_faq_items" USING btree ("_order");
  CREATE INDEX "solutions_faq_items_parent_id_idx" ON "solutions_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_faq_items_locales_locale_parent_id_unique" ON "solutions_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solutions_image_idx" ON "solutions" USING btree ("image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "solutions_locales_locale_parent_id_unique" ON "solutions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_profile_image_idx" ON "testimonials" USING btree ("profile_image_id");
  CREATE INDEX "testimonials_client_idx" ON "testimonials" USING btree ("client_id");
  CREATE INDEX "testimonials_new_client_new_client_logo_idx" ON "testimonials" USING btree ("new_client_logo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "offers_services_order_idx" ON "offers_services" USING btree ("_order");
  CREATE INDEX "offers_services_parent_id_idx" ON "offers_services" USING btree ("_parent_id");
  CREATE INDEX "offers_services_service_idx" ON "offers_services" USING btree ("service_id");
  CREATE INDEX "offers_keywords_order_idx" ON "offers_keywords" USING btree ("_order");
  CREATE INDEX "offers_keywords_parent_id_idx" ON "offers_keywords" USING btree ("_parent_id");
  CREATE INDEX "offers_client_idx" ON "offers" USING btree ("client_id");
  CREATE INDEX "offers_prepared_by_idx" ON "offers" USING btree ("prepared_by_id");
  CREATE INDEX "offers_updated_at_idx" ON "offers" USING btree ("updated_at");
  CREATE INDEX "offers_created_at_idx" ON "offers" USING btree ("created_at");
  CREATE UNIQUE INDEX "notifications_dedupe_key_idx" ON "notifications" USING btree ("dedupe_key");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "notifications_rels_order_idx" ON "notifications_rels" USING btree ("order");
  CREATE INDEX "notifications_rels_parent_idx" ON "notifications_rels" USING btree ("parent_id");
  CREATE INDEX "notifications_rels_path_idx" ON "notifications_rels" USING btree ("path");
  CREATE INDEX "notifications_rels_users_id_idx" ON "notifications_rels" USING btree ("users_id");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX "payload_locked_documents_rels_work_checklist_id_idx" ON "payload_locked_documents_rels" USING btree ("work_checklist_id");
  CREATE INDEX "payload_locked_documents_rels_client_checklist_progress__idx" ON "payload_locked_documents_rels" USING btree ("client_checklist_progress_id");
  CREATE INDEX "payload_locked_documents_rels_job_listings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_listings_id");
  CREATE INDEX "payload_locked_documents_rels_job_applicants_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applicants_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_industries_id_idx" ON "payload_locked_documents_rels" USING btree ("industries_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("offers_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_documents" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "clients_website_links" CASCADE;
  DROP TABLE "clients_website_login_links" CASCADE;
  DROP TABLE "clients_report_urls" CASCADE;
  DROP TABLE "clients_documents" CASCADE;
  DROP TABLE "clients_region" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "clients_rels" CASCADE;
  DROP TABLE "services_hero_highlights" CASCADE;
  DROP TABLE "services_hero_highlights_locales" CASCADE;
  DROP TABLE "services_includes_items" CASCADE;
  DROP TABLE "services_includes_items_locales" CASCADE;
  DROP TABLE "services_priorities_list" CASCADE;
  DROP TABLE "services_priorities_list_locales" CASCADE;
  DROP TABLE "services_process_steps" CASCADE;
  DROP TABLE "services_process_steps_locales" CASCADE;
  DROP TABLE "services_fit_right_choice_list" CASCADE;
  DROP TABLE "services_fit_right_choice_list_locales" CASCADE;
  DROP TABLE "services_why_us_items" CASCADE;
  DROP TABLE "services_why_us_items_locales" CASCADE;
  DROP TABLE "services_measurement_list" CASCADE;
  DROP TABLE "services_measurement_list_locales" CASCADE;
  DROP TABLE "services_team_extension_list" CASCADE;
  DROP TABLE "services_team_extension_list_locales" CASCADE;
  DROP TABLE "services_faq_items" CASCADE;
  DROP TABLE "services_faq_items_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "blog_locales" CASCADE;
  DROP TABLE "_blog_v_version_categories" CASCADE;
  DROP TABLE "_blog_v" CASCADE;
  DROP TABLE "_blog_v_locales" CASCADE;
  DROP TABLE "work_checklist_links" CASCADE;
  DROP TABLE "work_checklist" CASCADE;
  DROP TABLE "client_checklist_progress" CASCADE;
  DROP TABLE "job_listings" CASCADE;
  DROP TABLE "job_listings_locales" CASCADE;
  DROP TABLE "job_applicants" CASCADE;
  DROP TABLE "case_studies_achievements" CASCADE;
  DROP TABLE "case_studies_achievements_locales" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_locales" CASCADE;
  DROP TABLE "industries" CASCADE;
  DROP TABLE "industries_locales" CASCADE;
  DROP TABLE "_industries_v" CASCADE;
  DROP TABLE "_industries_v_locales" CASCADE;
  DROP TABLE "solutions_hero_highlights" CASCADE;
  DROP TABLE "solutions_hero_highlights_locales" CASCADE;
  DROP TABLE "solutions_concerns_items" CASCADE;
  DROP TABLE "solutions_concerns_items_locales" CASCADE;
  DROP TABLE "solutions_audience_list" CASCADE;
  DROP TABLE "solutions_audience_list_locales" CASCADE;
  DROP TABLE "solutions_partner_needs_list" CASCADE;
  DROP TABLE "solutions_partner_needs_list_locales" CASCADE;
  DROP TABLE "solutions_why_us_items" CASCADE;
  DROP TABLE "solutions_why_us_items_locales" CASCADE;
  DROP TABLE "solutions_includes_items" CASCADE;
  DROP TABLE "solutions_includes_items_locales" CASCADE;
  DROP TABLE "solutions_outcomes_items" CASCADE;
  DROP TABLE "solutions_outcomes_items_locales" CASCADE;
  DROP TABLE "solutions_process_steps" CASCADE;
  DROP TABLE "solutions_process_steps_locales" CASCADE;
  DROP TABLE "solutions_team_extension_list" CASCADE;
  DROP TABLE "solutions_team_extension_list_locales" CASCADE;
  DROP TABLE "solutions_faq_items" CASCADE;
  DROP TABLE "solutions_faq_items_locales" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "offers_services" CASCADE;
  DROP TABLE "offers_keywords" CASCADE;
  DROP TABLE "offers" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "notifications_rels" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_clients_region";
  DROP TYPE "public"."enum_clients_status";
  DROP TYPE "public"."enum_clients_business_size";
  DROP TYPE "public"."enum_blog_categories";
  DROP TYPE "public"."enum_blog_status";
  DROP TYPE "public"."enum__blog_v_version_categories";
  DROP TYPE "public"."enum__blog_v_version_status";
  DROP TYPE "public"."enum__blog_v_published_locale";
  DROP TYPE "public"."enum_work_checklist_type";
  DROP TYPE "public"."enum_work_checklist_priority";
  DROP TYPE "public"."enum_work_checklist_label";
  DROP TYPE "public"."enum_work_checklist_team";
  DROP TYPE "public"."enum_client_checklist_progress_status";
  DROP TYPE "public"."enum_job_listings_type";
  DROP TYPE "public"."enum_job_applicants_status";
  DROP TYPE "public"."enum_industries_status";
  DROP TYPE "public"."enum__industries_v_version_status";
  DROP TYPE "public"."enum__industries_v_published_locale";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum_testimonials_client_type";
  DROP TYPE "public"."enum_offers_status";
  DROP TYPE "public"."enum_offers_metrics_source";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
