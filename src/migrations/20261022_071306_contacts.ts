import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"profile_image_id" integer,
  	"client_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "clients" DROP CONSTRAINT "clients_profile_image_id_media_id_fk";
  
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_profile_image_id_media_id_fk";
  
  DROP INDEX "clients_profile_image_idx";
  DROP INDEX "testimonials_profile_image_idx";
  ALTER TABLE "testimonials" ADD COLUMN "testimonial_rich" jsonb;
  UPDATE "testimonials" t SET "testimonial_rich" = jsonb_build_object('root', jsonb_build_object(
    'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
    'children', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr', 'textFormat', 0,
        'children', jsonb_build_array(jsonb_build_object(
          'type', 'text', 'text', btrim(line.l), 'format', 0, 'style', '', 'mode', 'normal', 'detail', 0, 'version', 1
        ))
      ) ORDER BY line.n)
      FROM regexp_split_to_table(t."testimonial", E'\\r?\\n') WITH ORDINALITY AS line(l, n)
      WHERE btrim(line.l) <> ''
    ), '[]'::jsonb)
  ));
  ALTER TABLE "testimonials" DROP COLUMN "testimonial";
  ALTER TABLE "testimonials" RENAME COLUMN "testimonial_rich" TO "testimonial";
  ALTER TABLE "testimonials" ALTER COLUMN "testimonial" SET NOT NULL;
  ALTER TABLE "clients" ADD COLUMN "primary_contact_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "title" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "testimonials" ADD COLUMN "order" numeric;
  ALTER TABLE "testimonials" ADD COLUMN "contact_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "submitted_by_name" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "submitted_by_email" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "submitted_by_role" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "submitted_by_profile_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contacts_id" integer;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contacts_profile_image_idx" ON "contacts" USING btree ("profile_image_id");
  CREATE INDEX "contacts_client_idx" ON "contacts" USING btree ("client_id");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  ALTER TABLE "clients" ADD CONSTRAINT "clients_primary_contact_id_contacts_id_fk" FOREIGN KEY ("primary_contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_submitted_by_profile_image_id_media_id_fk" FOREIGN KEY ("submitted_by_profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clients_primary_contact_idx" ON "clients" USING btree ("primary_contact_id");
  CREATE INDEX "testimonials_contact_idx" ON "testimonials" USING btree ("contact_id");
  CREATE INDEX "testimonials_submitted_by_submitted_by_profile_image_idx" ON "testimonials" USING btree ("submitted_by_profile_image_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  -- The old required name column is dropped below, but testimonials are
  -- inserted before that and don't set it.
  ALTER TABLE "testimonials" ALTER COLUMN "name" DROP NOT NULL;

  -- Submitted person details move into the submittedBy group.
  UPDATE "testimonials" SET
    "submitted_by_name" = "name",
    "submitted_by_email" = "email",
    "submitted_by_role" = "new_client_role",
    "submitted_by_profile_image_id" = "profile_image_id",
    "title" = "name";

  -- One contact per client that had a contact person; it becomes primary.
  INSERT INTO "contacts" ("name", "role", "email", "profile_image_id", "client_id")
  SELECT btrim("contact_name"), "contact_role", "email", "profile_image_id", "id"
  FROM "clients"
  WHERE btrim(COALESCE("contact_name", '')) <> '';

  UPDATE "clients" c SET "primary_contact_id" = ct."id"
  FROM "contacts" ct
  WHERE ct."client_id" = c."id";

  -- Approved testimonials written by that person link to the new contact.
  UPDATE "testimonials" t SET "contact_id" = c."primary_contact_id", "title" = ct."name"
  FROM "clients" c
  JOIN "contacts" ct ON ct."id" = c."primary_contact_id"
  WHERE t."client_id" = c."id"
    AND t."status" = 'approved'
    AND lower(btrim(t."name")) = lower(ct."name");

  -- Clients.testimonial is what the website showed. Where the client already
  -- has an approved testimonial, the latest one takes that text (approval
  -- copied it there, possibly edited since); otherwise create one.
  UPDATE "testimonials" t SET "testimonial" = c."testimonial"
  FROM "clients" c
  WHERE t."client_id" = c."id"
    AND c."testimonial"::text ~ '"text":\\s*"[^"]'
    AND t."id" = (
      SELECT max(t2."id") FROM "testimonials" t2
      WHERE t2."client_id" = c."id" AND t2."status" = 'approved'
    );

  INSERT INTO "testimonials" ("title", "testimonial", "status", "client_type", "client_id", "contact_id")
  SELECT COALESCE(ct."name", c."company_name"), c."testimonial", 'approved', 'existing', c."id", c."primary_contact_id"
  FROM "clients" c
  LEFT JOIN "contacts" ct ON ct."id" = c."primary_contact_id"
  WHERE c."testimonial"::text ~ '"text":\\s*"[^"]'
    AND NOT EXISTS (
      SELECT 1 FROM "testimonials" t
      WHERE t."client_id" = c."id" AND t."status" = 'approved'
    );

  -- Replaces the hard-coded TESTIMONIAL_CLIENT_IDS (homepage, services,
  -- solutions) and FEATURED_CLIENT_IDS (book a consultation), in that order.
  UPDATE "testimonials" t SET
    "featured" = true,
    "order" = array_position(ARRAY[47, 75, 90, 72, 83], t."client_id")
  WHERE t."client_id" = ANY(ARRAY[47, 75, 90, 72, 83])
    AND t."id" = (
      SELECT max(t2."id") FROM "testimonials" t2
      WHERE t2."client_id" = t."client_id" AND t2."status" = 'approved'
    );

  ALTER TABLE "clients" DROP COLUMN "contact_name";
  ALTER TABLE "clients" DROP COLUMN "contact_role";
  ALTER TABLE "clients" DROP COLUMN "profile_image_id";
  ALTER TABLE "clients" DROP COLUMN "testimonial";
  ALTER TABLE "testimonials" DROP COLUMN "name";
  ALTER TABLE "testimonials" DROP COLUMN "email";
  ALTER TABLE "testimonials" DROP COLUMN "profile_image_id";
  ALTER TABLE "testimonials" DROP COLUMN "new_client_role";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "clients" ADD COLUMN "contact_name" varchar;
  ALTER TABLE "clients" ADD COLUMN "contact_role" varchar;
  ALTER TABLE "clients" ADD COLUMN "profile_image_id" integer;
  ALTER TABLE "clients" ADD COLUMN "testimonial" jsonb;
  ALTER TABLE "testimonials" ADD COLUMN "name" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "email" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "profile_image_id" integer;
  ALTER TABLE "testimonials" ADD COLUMN "new_client_role" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "testimonial_plain" varchar;

  UPDATE "clients" c SET
    "contact_name" = ct."name",
    "contact_role" = ct."role",
    "profile_image_id" = ct."profile_image_id"
  FROM "contacts" ct
  WHERE ct."id" = c."primary_contact_id";

  UPDATE "clients" c SET "testimonial" = t."testimonial"
  FROM "testimonials" t
  WHERE t."client_id" = c."id"
    AND t."id" = (
      SELECT max(t2."id") FROM "testimonials" t2
      WHERE t2."client_id" = c."id" AND t2."status" = 'approved'
    );

  UPDATE "testimonials" t SET
    "name" = COALESCE(t."submitted_by_name", ct."name", t."title", ''),
    "email" = COALESCE(t."submitted_by_email", ct."email"),
    "new_client_role" = COALESCE(t."submitted_by_role", ct."role"),
    "profile_image_id" = COALESCE(t."submitted_by_profile_image_id", ct."profile_image_id"),
    "testimonial_plain" = COALESCE((
      SELECT string_agg(p.value #>> '{children,0,text}', E'\\n' ORDER BY p.n)
      FROM jsonb_array_elements(t."testimonial" #> '{root,children}') WITH ORDINALITY AS p(value, n)
    ), '')
  FROM "testimonials" t0
  LEFT JOIN "contacts" ct ON ct."id" = t0."contact_id"
  WHERE t0."id" = t."id";

  ALTER TABLE "testimonials" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "testimonials" DROP COLUMN "testimonial";
  ALTER TABLE "testimonials" RENAME COLUMN "testimonial_plain" TO "testimonial";
  ALTER TABLE "testimonials" ALTER COLUMN "testimonial" SET NOT NULL;

  ALTER TABLE "clients" DROP CONSTRAINT "clients_primary_contact_id_contacts_id_fk";
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_contact_id_contacts_id_fk";
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_submitted_by_profile_image_id_media_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contacts_fk";
  DROP INDEX "clients_primary_contact_idx";
  DROP INDEX "testimonials_contact_idx";
  DROP INDEX "testimonials_submitted_by_submitted_by_profile_image_idx";
  DROP INDEX "payload_locked_documents_rels_contacts_id_idx";
  ALTER TABLE "contacts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contacts" CASCADE;

  ALTER TABLE "clients" ADD CONSTRAINT "clients_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "clients_profile_image_idx" ON "clients" USING btree ("profile_image_id");
  CREATE INDEX "testimonials_profile_image_idx" ON "testimonials" USING btree ("profile_image_id");
  ALTER TABLE "clients" DROP COLUMN "primary_contact_id";
  ALTER TABLE "testimonials" DROP COLUMN "title";
  ALTER TABLE "testimonials" DROP COLUMN "featured";
  ALTER TABLE "testimonials" DROP COLUMN "order";
  ALTER TABLE "testimonials" DROP COLUMN "contact_id";
  ALTER TABLE "testimonials" DROP COLUMN "submitted_by_name";
  ALTER TABLE "testimonials" DROP COLUMN "submitted_by_email";
  ALTER TABLE "testimonials" DROP COLUMN "submitted_by_role";
  ALTER TABLE "testimonials" DROP COLUMN "submitted_by_profile_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contacts_id";`)
}
