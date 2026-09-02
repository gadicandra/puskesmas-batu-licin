import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'admin');
  CREATE TYPE "public"."enum_users_metode_login" AS ENUM('sandi', 'google', 'keduanya');
  CREATE TYPE "public"."enum_doctors_jadwal_praktik_hari" AS ENUM('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu');
  CREATE TYPE "public"."enum_doctors_poli" AS ENUM('umum', 'gigi', 'kia-kb', 'lansia', 'gizi', 'sanitasi', 'mtbs', 'lab', 'farmasi', 'iva', 'promkes', 'ugd', 'tata-usaha', 'keuangan');
  CREATE TYPE "public"."enum_medical_staff_jabatan" AS ENUM('dokter', 'perawat', 'bidan', 'apoteker', 'analis', 'gizi', 'sanitarian', 'administrasi', 'lainnya');
  CREATE TYPE "public"."enum_medical_staff_poli" AS ENUM('umum', 'gigi', 'kia-kb', 'lansia', 'gizi', 'sanitasi', 'mtbs', 'lab', 'farmasi', 'iva', 'promkes', 'ugd', 'tata-usaha', 'keuangan');
  CREATE TYPE "public"."enum_vaccines_poli" AS ENUM('umum', 'gigi', 'kia-kb', 'lansia', 'gizi', 'sanitasi', 'mtbs', 'lab', 'farmasi', 'iva', 'promkes', 'ugd', 'tata-usaha', 'keuangan');
  CREATE TYPE "public"."enum_certificates_jenis" AS ENUM('akreditasi', 'penghargaan');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('berita', 'pengumuman', 'kegiatan', 'kesehatan');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('berita', 'pengumuman', 'kegiatan', 'kesehatan');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_kategori" AS ENUM('dalam-gedung', 'luar-gedung', 'posyandu');
  CREATE TYPE "public"."enum_posyandu_jadwal_hari" AS ENUM('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu');
  CREATE TYPE "public"."enum_facilities_kategori" AS ENUM('ruang', 'alat', 'kendaraan', 'penunjang');
  CREATE TYPE "public"."enum_complaints_kategori" AS ENUM('layanan', 'petugas', 'sarana', 'saran', 'lainnya');
  CREATE TYPE "public"."enum_complaints_status" AS ENUM('baru', 'diproses', 'selesai');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"metode_login" "enum_users_metode_login" DEFAULT 'sandi' NOT NULL,
  	"google_sub" varchar,
  	"lokasi" varchar,
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  
  CREATE TABLE "doctors_jadwal_praktik" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hari" "enum_doctors_jadwal_praktik_hari" NOT NULL,
  	"jam_mulai" varchar NOT NULL,
  	"jam_selesai" varchar NOT NULL
  );
  
  CREATE TABLE "doctors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"spesialisasi" varchar NOT NULL,
  	"foto_id" integer,
  	"pendidikan" varchar,
  	"nomor_s_t_r" varchar,
  	"deskripsi" varchar,
  	"aktif" boolean DEFAULT true,
  	"poli" "enum_doctors_poli",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "medical_staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"jabatan" "enum_medical_staff_jabatan" NOT NULL,
  	"foto_id" integer,
  	"aktif" boolean DEFAULT true,
  	"poli" "enum_medical_staff_poli",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vaccines" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"jenis" varchar,
  	"stok" numeric DEFAULT 0 NOT NULL,
  	"satuan" varchar DEFAULT 'dosis',
  	"keterangan" varchar,
  	"poli" "enum_vaccines_poli",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certificates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"judul" varchar NOT NULL,
  	"jenis" "enum_certificates_jenis" DEFAULT 'akreditasi' NOT NULL,
  	"penerbit" varchar,
  	"tanggal" timestamp(3) with time zone,
  	"berkas_id" integer NOT NULL,
  	"keterangan" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"cover_id" integer,
  	"excerpt" varchar,
  	"content" varchar,
  	"category" "enum_articles_category" DEFAULT 'berita',
  	"author_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_cover_id" integer,
  	"version_excerpt" varchar,
  	"version_content" varchar,
  	"version_category" "enum__articles_v_version_category" DEFAULT 'berita',
  	"version_author_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "page_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL,
  	"referrer" varchar,
  	"ua_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_persyaratan" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"isi" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"kategori" "enum_services_kategori" DEFAULT 'dalam-gedung' NOT NULL,
  	"deskripsi" varchar,
  	"urutan" numeric DEFAULT 0,
  	"aktif" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posyandu_jadwal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hari" "enum_posyandu_jadwal_hari" NOT NULL,
  	"keterangan" varchar
  );
  
  CREATE TABLE "posyandu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"alamat" varchar,
  	"penanggung_jawab" varchar,
  	"kontak" varchar,
  	"urutan" numeric DEFAULT 0,
  	"aktif" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posyandu_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "facilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama" varchar NOT NULL,
  	"kategori" "enum_facilities_kategori" DEFAULT 'ruang' NOT NULL,
  	"deskripsi" varchar,
  	"jumlah" numeric,
  	"foto_id" integer,
  	"urutan" numeric DEFAULT 0,
  	"aktif" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "complaints" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ringkasan" varchar NOT NULL,
  	"isi" varchar NOT NULL,
  	"nama" varchar,
  	"kontak" varchar,
  	"kategori" "enum_complaints_kategori" DEFAULT 'layanan',
  	"persetujuan_privasi" boolean DEFAULT false NOT NULL,
  	"status" "enum_complaints_status" DEFAULT 'baru' NOT NULL,
  	"tanggapan" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "org_chart" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"jabatan" varchar NOT NULL,
  	"nama" varchar,
  	"foto_id" integer,
  	"atasan_id" integer,
  	"urutan" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
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
  	"media_id" integer,
  	"doctors_id" integer,
  	"medical_staff_id" integer,
  	"vaccines_id" integer,
  	"certificates_id" integer,
  	"articles_id" integer,
  	"page_views_id" integer,
  	"services_id" integer,
  	"posyandu_id" integer,
  	"facilities_id" integer,
  	"complaints_id" integer,
  	"org_chart_id" integer
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
  
  CREATE TABLE "operational_hours_jadwal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hari" varchar NOT NULL,
  	"jam" varchar NOT NULL
  );
  
  CREATE TABLE "operational_hours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"catatan" varchar DEFAULT 'UGD & UGD Kebidanan melayani 24 jam, Senin–Minggu.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_sosial_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nama_instansi" varchar DEFAULT 'UPTD Puskesmas Batulicin',
  	"alamat" varchar,
  	"telepon" varchar,
  	"email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "profile_misi" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"isi" varchar NOT NULL
  );
  
  CREATE TABLE "profile_budaya_kerja_butir" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"isi" varchar NOT NULL
  );
  
  CREATE TABLE "profile_budaya_kerja" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"judul" varchar NOT NULL,
  	"keterangan" varchar
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visi" varchar,
  	"motto" varchar,
  	"maklumat_pelayanan" varchar,
  	"sejarah" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_jadwal_praktik" ADD CONSTRAINT "doctors_jadwal_praktik_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medical_staff" ADD CONSTRAINT "medical_staff_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_berkas_id_media_id_fk" FOREIGN KEY ("berkas_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_persyaratan" ADD CONSTRAINT "services_persyaratan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posyandu_jadwal" ADD CONSTRAINT "posyandu_jadwal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posyandu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posyandu_rels" ADD CONSTRAINT "posyandu_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posyandu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posyandu_rels" ADD CONSTRAINT "posyandu_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities" ADD CONSTRAINT "facilities_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "org_chart" ADD CONSTRAINT "org_chart_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "org_chart" ADD CONSTRAINT "org_chart_atasan_id_org_chart_id_fk" FOREIGN KEY ("atasan_id") REFERENCES "public"."org_chart"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medical_staff_fk" FOREIGN KEY ("medical_staff_id") REFERENCES "public"."medical_staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vaccines_fk" FOREIGN KEY ("vaccines_id") REFERENCES "public"."vaccines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posyandu_fk" FOREIGN KEY ("posyandu_id") REFERENCES "public"."posyandu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilities_fk" FOREIGN KEY ("facilities_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_complaints_fk" FOREIGN KEY ("complaints_id") REFERENCES "public"."complaints"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_org_chart_fk" FOREIGN KEY ("org_chart_id") REFERENCES "public"."org_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "operational_hours_jadwal" ADD CONSTRAINT "operational_hours_jadwal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."operational_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_sosial_media" ADD CONSTRAINT "site_settings_sosial_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_misi" ADD CONSTRAINT "profile_misi_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_budaya_kerja_butir" ADD CONSTRAINT "profile_budaya_kerja_butir_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile_budaya_kerja"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_budaya_kerja" ADD CONSTRAINT "profile_budaya_kerja_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_google_sub_idx" ON "users" USING btree ("google_sub");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "doctors_jadwal_praktik_order_idx" ON "doctors_jadwal_praktik" USING btree ("_order");
  CREATE INDEX "doctors_jadwal_praktik_parent_id_idx" ON "doctors_jadwal_praktik" USING btree ("_parent_id");
  CREATE INDEX "doctors_foto_idx" ON "doctors" USING btree ("foto_id");
  CREATE INDEX "doctors_updated_at_idx" ON "doctors" USING btree ("updated_at");
  CREATE INDEX "doctors_created_at_idx" ON "doctors" USING btree ("created_at");
  CREATE INDEX "medical_staff_foto_idx" ON "medical_staff" USING btree ("foto_id");
  CREATE INDEX "medical_staff_updated_at_idx" ON "medical_staff" USING btree ("updated_at");
  CREATE INDEX "medical_staff_created_at_idx" ON "medical_staff" USING btree ("created_at");
  CREATE INDEX "vaccines_updated_at_idx" ON "vaccines" USING btree ("updated_at");
  CREATE INDEX "vaccines_created_at_idx" ON "vaccines" USING btree ("created_at");
  CREATE INDEX "certificates_berkas_idx" ON "certificates" USING btree ("berkas_id");
  CREATE INDEX "certificates_updated_at_idx" ON "certificates" USING btree ("updated_at");
  CREATE INDEX "certificates_created_at_idx" ON "certificates" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "page_views_path_idx" ON "page_views" USING btree ("path");
  CREATE INDEX "page_views_ua_hash_idx" ON "page_views" USING btree ("ua_hash");
  CREATE INDEX "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  CREATE INDEX "services_persyaratan_order_idx" ON "services_persyaratan" USING btree ("_order");
  CREATE INDEX "services_persyaratan_parent_id_idx" ON "services_persyaratan" USING btree ("_parent_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "posyandu_jadwal_order_idx" ON "posyandu_jadwal" USING btree ("_order");
  CREATE INDEX "posyandu_jadwal_parent_id_idx" ON "posyandu_jadwal" USING btree ("_parent_id");
  CREATE INDEX "posyandu_updated_at_idx" ON "posyandu" USING btree ("updated_at");
  CREATE INDEX "posyandu_created_at_idx" ON "posyandu" USING btree ("created_at");
  CREATE INDEX "posyandu_rels_order_idx" ON "posyandu_rels" USING btree ("order");
  CREATE INDEX "posyandu_rels_parent_idx" ON "posyandu_rels" USING btree ("parent_id");
  CREATE INDEX "posyandu_rels_path_idx" ON "posyandu_rels" USING btree ("path");
  CREATE INDEX "posyandu_rels_services_id_idx" ON "posyandu_rels" USING btree ("services_id");
  CREATE INDEX "facilities_foto_idx" ON "facilities" USING btree ("foto_id");
  CREATE INDEX "facilities_updated_at_idx" ON "facilities" USING btree ("updated_at");
  CREATE INDEX "facilities_created_at_idx" ON "facilities" USING btree ("created_at");
  CREATE INDEX "complaints_updated_at_idx" ON "complaints" USING btree ("updated_at");
  CREATE INDEX "complaints_created_at_idx" ON "complaints" USING btree ("created_at");
  CREATE INDEX "org_chart_foto_idx" ON "org_chart" USING btree ("foto_id");
  CREATE INDEX "org_chart_atasan_idx" ON "org_chart" USING btree ("atasan_id");
  CREATE INDEX "org_chart_updated_at_idx" ON "org_chart" USING btree ("updated_at");
  CREATE INDEX "org_chart_created_at_idx" ON "org_chart" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_id_idx" ON "payload_locked_documents_rels" USING btree ("doctors_id");
  CREATE INDEX "payload_locked_documents_rels_medical_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("medical_staff_id");
  CREATE INDEX "payload_locked_documents_rels_vaccines_id_idx" ON "payload_locked_documents_rels" USING btree ("vaccines_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_posyandu_id_idx" ON "payload_locked_documents_rels" USING btree ("posyandu_id");
  CREATE INDEX "payload_locked_documents_rels_facilities_id_idx" ON "payload_locked_documents_rels" USING btree ("facilities_id");
  CREATE INDEX "payload_locked_documents_rels_complaints_id_idx" ON "payload_locked_documents_rels" USING btree ("complaints_id");
  CREATE INDEX "payload_locked_documents_rels_org_chart_id_idx" ON "payload_locked_documents_rels" USING btree ("org_chart_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "operational_hours_jadwal_order_idx" ON "operational_hours_jadwal" USING btree ("_order");
  CREATE INDEX "operational_hours_jadwal_parent_id_idx" ON "operational_hours_jadwal" USING btree ("_parent_id");
  CREATE INDEX "site_settings_sosial_media_order_idx" ON "site_settings_sosial_media" USING btree ("_order");
  CREATE INDEX "site_settings_sosial_media_parent_id_idx" ON "site_settings_sosial_media" USING btree ("_parent_id");
  CREATE INDEX "profile_misi_order_idx" ON "profile_misi" USING btree ("_order");
  CREATE INDEX "profile_misi_parent_id_idx" ON "profile_misi" USING btree ("_parent_id");
  CREATE INDEX "profile_budaya_kerja_butir_order_idx" ON "profile_budaya_kerja_butir" USING btree ("_order");
  CREATE INDEX "profile_budaya_kerja_butir_parent_id_idx" ON "profile_budaya_kerja_butir" USING btree ("_parent_id");
  CREATE INDEX "profile_budaya_kerja_order_idx" ON "profile_budaya_kerja" USING btree ("_order");
  CREATE INDEX "profile_budaya_kerja_parent_id_idx" ON "profile_budaya_kerja" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "doctors_jadwal_praktik" CASCADE;
  DROP TABLE "doctors" CASCADE;
  DROP TABLE "medical_staff" CASCADE;
  DROP TABLE "vaccines" CASCADE;
  DROP TABLE "certificates" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "page_views" CASCADE;
  DROP TABLE "services_persyaratan" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "posyandu_jadwal" CASCADE;
  DROP TABLE "posyandu" CASCADE;
  DROP TABLE "posyandu_rels" CASCADE;
  DROP TABLE "facilities" CASCADE;
  DROP TABLE "complaints" CASCADE;
  DROP TABLE "org_chart" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "operational_hours_jadwal" CASCADE;
  DROP TABLE "operational_hours" CASCADE;
  DROP TABLE "site_settings_sosial_media" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "profile_misi" CASCADE;
  DROP TABLE "profile_budaya_kerja_butir" CASCADE;
  DROP TABLE "profile_budaya_kerja" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_metode_login";
  DROP TYPE "public"."enum_doctors_jadwal_praktik_hari";
  DROP TYPE "public"."enum_doctors_poli";
  DROP TYPE "public"."enum_medical_staff_jabatan";
  DROP TYPE "public"."enum_medical_staff_poli";
  DROP TYPE "public"."enum_vaccines_poli";
  DROP TYPE "public"."enum_certificates_jenis";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_services_kategori";
  DROP TYPE "public"."enum_posyandu_jadwal_hari";
  DROP TYPE "public"."enum_facilities_kategori";
  DROP TYPE "public"."enum_complaints_kategori";
  DROP TYPE "public"."enum_complaints_status";`)
}
