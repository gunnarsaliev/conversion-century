import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ai_chats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"owner_id" integer NOT NULL,
  	"last_message_at" timestamp(3) with time zone,
  	"session_id" varchar NOT NULL,
  	"session" jsonb,
  	"events" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ai_chats_id" integer;
  ALTER TABLE "ai_chats" ADD CONSTRAINT "ai_chats_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "ai_chats_owner_idx" ON "ai_chats" USING btree ("owner_id");
  CREATE INDEX "ai_chats_last_message_at_idx" ON "ai_chats" USING btree ("last_message_at");
  CREATE UNIQUE INDEX "ai_chats_session_id_idx" ON "ai_chats" USING btree ("session_id");
  CREATE INDEX "ai_chats_updated_at_idx" ON "ai_chats" USING btree ("updated_at");
  CREATE INDEX "ai_chats_created_at_idx" ON "ai_chats" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ai_chats_fk" FOREIGN KEY ("ai_chats_id") REFERENCES "public"."ai_chats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_ai_chats_id_idx" ON "payload_locked_documents_rels" USING btree ("ai_chats_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ai_chats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "ai_chats" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ai_chats_fk";
  
  DROP INDEX "payload_locked_documents_rels_ai_chats_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ai_chats_id";`)
}
