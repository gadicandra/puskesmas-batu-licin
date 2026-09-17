import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pengaduan_status" AS ENUM('baru', 'diproses', 'selesai');
  CREATE TYPE "public"."enum_kritik_saran_status" AS ENUM('baru', 'diproses', 'selesai');
  CREATE TABLE "alur_pengaduan_steps_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "alur_pengaduan_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pengaduan" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"contact" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_pengaduan_status" DEFAULT 'baru' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "kritik_saran" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"contact" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"status" "enum_kritik_saran_status" DEFAULT 'baru' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "alur_pengaduan_steps_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pengaduan_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "kritik_saran_id" integer;
  ALTER TABLE "alur_pengaduan_steps_details" ADD CONSTRAINT "alur_pengaduan_steps_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alur_pengaduan_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "alur_pengaduan_steps_details_order_idx" ON "alur_pengaduan_steps_details" USING btree ("_order");
  CREATE INDEX "alur_pengaduan_steps_details_parent_id_idx" ON "alur_pengaduan_steps_details" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "alur_pengaduan_steps_order_idx" ON "alur_pengaduan_steps" USING btree ("order");
  CREATE INDEX "alur_pengaduan_steps_active_idx" ON "alur_pengaduan_steps" USING btree ("active");
  CREATE INDEX "alur_pengaduan_steps_updated_at_idx" ON "alur_pengaduan_steps" USING btree ("updated_at");
  CREATE INDEX "alur_pengaduan_steps_created_at_idx" ON "alur_pengaduan_steps" USING btree ("created_at");
  CREATE INDEX "pengaduan_updated_at_idx" ON "pengaduan" USING btree ("updated_at");
  CREATE INDEX "pengaduan_created_at_idx" ON "pengaduan" USING btree ("created_at");
  CREATE INDEX "kritik_saran_updated_at_idx" ON "kritik_saran" USING btree ("updated_at");
  CREATE INDEX "kritik_saran_created_at_idx" ON "kritik_saran" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alur_pengaduan_steps_fk" FOREIGN KEY ("alur_pengaduan_steps_id") REFERENCES "public"."alur_pengaduan_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pengaduan_fk" FOREIGN KEY ("pengaduan_id") REFERENCES "public"."pengaduan"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_kritik_saran_fk" FOREIGN KEY ("kritik_saran_id") REFERENCES "public"."kritik_saran"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_alur_pengaduan_steps_id_idx" ON "payload_locked_documents_rels" USING btree ("alur_pengaduan_steps_id");
  CREATE INDEX "payload_locked_documents_rels_pengaduan_id_idx" ON "payload_locked_documents_rels" USING btree ("pengaduan_id");
  CREATE INDEX "payload_locked_documents_rels_kritik_saran_id_idx" ON "payload_locked_documents_rels" USING btree ("kritik_saran_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Constraint dilepas SEBELUM tabel dihapus. Urutan hasil generator Payload
  // terbalik: `DROP TABLE ... CASCADE` sudah ikut menghapus foreign key dari
  // payload_locked_documents_rels yang menunjuk ke tabel itu, sehingga
  // `DROP CONSTRAINT` sesudahnya gagal dengan "constraint ... does not exist"
  // dan seluruh rollback dibatalkan.
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_alur_pengaduan_steps_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pengaduan_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_kritik_saran_fk";
  ALTER TABLE "alur_pengaduan_steps_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "alur_pengaduan_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pengaduan" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "kritik_saran" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "alur_pengaduan_steps_details" CASCADE;
  DROP TABLE "alur_pengaduan_steps" CASCADE;
  DROP TABLE "pengaduan" CASCADE;
  DROP TABLE "kritik_saran" CASCADE;
  DROP INDEX "payload_locked_documents_rels_alur_pengaduan_steps_id_idx";
  DROP INDEX "payload_locked_documents_rels_pengaduan_id_idx";
  DROP INDEX "payload_locked_documents_rels_kritik_saran_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "alur_pengaduan_steps_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pengaduan_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "kritik_saran_id";
  DROP TYPE "public"."enum_pengaduan_status";
  DROP TYPE "public"."enum_kritik_saran_status";`)
}
