import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posyandu_jadwal" ADD COLUMN "pola_minggu" varchar;
  ALTER TABLE "posyandu_jadwal" ADD COLUMN "jam_mulai" varchar;
  ALTER TABLE "posyandu_jadwal" ADD COLUMN "jam_selesai" varchar;
  ALTER TABLE "posyandu" ADD COLUMN "deskripsi" varchar;
  ALTER TABLE "posyandu" ADD COLUMN "foto_id" integer;
  ALTER TABLE "posyandu" ADD COLUMN "desa" varchar;
  ALTER TABLE "posyandu" ADD CONSTRAINT "posyandu_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posyandu_foto_idx" ON "posyandu" USING btree ("foto_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posyandu" DROP CONSTRAINT "posyandu_foto_id_media_id_fk";
  
  DROP INDEX "posyandu_foto_idx";
  ALTER TABLE "posyandu_jadwal" DROP COLUMN "pola_minggu";
  ALTER TABLE "posyandu_jadwal" DROP COLUMN "jam_mulai";
  ALTER TABLE "posyandu_jadwal" DROP COLUMN "jam_selesai";
  ALTER TABLE "posyandu" DROP COLUMN "deskripsi";
  ALTER TABLE "posyandu" DROP COLUMN "foto_id";
  ALTER TABLE "posyandu" DROP COLUMN "desa";`)
}
