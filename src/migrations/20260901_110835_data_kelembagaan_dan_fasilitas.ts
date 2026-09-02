import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_facilities_kategori" ADD VALUE 'kantor' BEFORE 'alat';
  ALTER TABLE "site_settings" ADD COLUMN "telepon_darurat" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "nama_petugas_darurat" varchar;
  ALTER TABLE "profile" ADD COLUMN "kode_puskesmas" varchar;
  ALTER TABLE "profile" ADD COLUMN "kepala_puskesmas" varchar;
  ALTER TABLE "profile" ADD COLUMN "kategori" varchar;
  ALTER TABLE "profile" ADD COLUMN "jenis" varchar;
  ALTER TABLE "profile" ADD COLUMN "letak" varchar;
  ALTER TABLE "profile" ADD COLUMN "topografi" varchar;
  ALTER TABLE "profile" ADD COLUMN "luas_wilayah" varchar;
  ALTER TABLE "profile" ADD COLUMN "jumlah_desa" varchar;
  ALTER TABLE "profile" ADD COLUMN "jumlah_r_t" numeric;
  ALTER TABLE "profile" ADD COLUMN "jumlah_penduduk" numeric;
  ALTER TABLE "profile" ADD COLUMN "jumlah_k_k" numeric;
  ALTER TABLE "profile" ADD COLUMN "sumber_visi" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "facilities" ALTER COLUMN "kategori" SET DATA TYPE text;
  ALTER TABLE "facilities" ALTER COLUMN "kategori" SET DEFAULT 'ruang'::text;
  DROP TYPE "public"."enum_facilities_kategori";
  CREATE TYPE "public"."enum_facilities_kategori" AS ENUM('ruang', 'alat', 'kendaraan', 'penunjang');
  ALTER TABLE "facilities" ALTER COLUMN "kategori" SET DEFAULT 'ruang'::"public"."enum_facilities_kategori";
  ALTER TABLE "facilities" ALTER COLUMN "kategori" SET DATA TYPE "public"."enum_facilities_kategori" USING "kategori"::"public"."enum_facilities_kategori";
  ALTER TABLE "site_settings" DROP COLUMN "telepon_darurat";
  ALTER TABLE "site_settings" DROP COLUMN "nama_petugas_darurat";
  ALTER TABLE "profile" DROP COLUMN "kode_puskesmas";
  ALTER TABLE "profile" DROP COLUMN "kepala_puskesmas";
  ALTER TABLE "profile" DROP COLUMN "kategori";
  ALTER TABLE "profile" DROP COLUMN "jenis";
  ALTER TABLE "profile" DROP COLUMN "letak";
  ALTER TABLE "profile" DROP COLUMN "topografi";
  ALTER TABLE "profile" DROP COLUMN "luas_wilayah";
  ALTER TABLE "profile" DROP COLUMN "jumlah_desa";
  ALTER TABLE "profile" DROP COLUMN "jumlah_r_t";
  ALTER TABLE "profile" DROP COLUMN "jumlah_penduduk";
  ALTER TABLE "profile" DROP COLUMN "jumlah_k_k";
  ALTER TABLE "profile" DROP COLUMN "sumber_visi";`)
}
