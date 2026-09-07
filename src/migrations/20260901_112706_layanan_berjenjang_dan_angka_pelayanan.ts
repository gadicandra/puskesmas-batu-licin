import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_service_statistics_kelompok" AS ENUM('umur', 'asuransi', 'poli', 'status-pulang');
  CREATE TABLE "service_statistics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"periode" varchar NOT NULL,
  	"kelompok" "enum_service_statistics_kelompok" NOT NULL,
  	"label" varchar NOT NULL,
  	"jumlah" numeric NOT NULL,
  	"urutan" numeric DEFAULT 0,
  	"sumber" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN "slug" varchar;
  ALTER TABLE "services" ADD COLUMN "induk_id" integer;
  ALTER TABLE "services" ADD COLUMN "jadwal" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_statistics_id" integer;
  CREATE INDEX "service_statistics_updated_at_idx" ON "service_statistics" USING btree ("updated_at");
  CREATE INDEX "service_statistics_created_at_idx" ON "service_statistics" USING btree ("created_at");
  ALTER TABLE "services" ADD CONSTRAINT "services_induk_id_services_id_fk" FOREIGN KEY ("induk_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_statistics_fk" FOREIGN KEY ("service_statistics_id") REFERENCES "public"."service_statistics"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_induk_idx" ON "services" USING btree ("induk_id");
  CREATE INDEX "payload_locked_documents_rels_service_statistics_id_idx" ON "payload_locked_documents_rels" USING btree ("service_statistics_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service_statistics" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "service_statistics" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_induk_id_services_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_statistics_fk";
  
  DROP INDEX "services_slug_idx";
  DROP INDEX "services_induk_idx";
  DROP INDEX "payload_locked_documents_rels_service_statistics_id_idx";
  ALTER TABLE "services" DROP COLUMN "slug";
  ALTER TABLE "services" DROP COLUMN "induk_id";
  ALTER TABLE "services" DROP COLUMN "jadwal";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_statistics_id";
  DROP TYPE "public"."enum_service_statistics_kelompok";`)
}
