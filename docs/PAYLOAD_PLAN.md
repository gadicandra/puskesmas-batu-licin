# Payload Backend & Dashboard — Rencana Kerja

Rencana bertahap untuk membangun backend Payload + dashboard admin + integrasi ke
public side web Puskesmas Batulicin. Dibuat agar pekerjaan bisa dilanjutkan lintas
sesi (mis. jika limit habis).

> **ATURAN WAJIB (untuk sesi mana pun yang mengerjakan file ini):**
> 1. Kerjakan per **Fase**, dari atas ke bawah. Jangan lompat kecuali diminta.
> 2. Setiap satu task selesai → **centang checkbox-nya** DAN **tambahkan baris log**
>    di bagian **Log** fase tersebut (format: `- [YYYY-MM-DD] <apa yang dikerjakan> — <file/commit>`).
> 3. Setiap **Fase** selesai → tambahkan ringkasan 1 baris ke **Progress Log** paling bawah.
> 4. Update tanggal dengan tanggal nyata (hari ini di dokumen: 2026-07-03).
> 5. Jangan hapus entri log lama — hanya tambah.

---

## Konteks & keputusan yang sudah diambil

- **Stack DB:** Postgres lokal via Docker untuk dev (`docker-compose.yml`, host port **5434**). Ganti hanya `DATABASE_URL`.
- **Migrasi:** sistem migrasi bawaan Payload (Drizzle), **bukan Prisma**. Dev = `push: true`
  (auto-sync). Prod = `push: false` + `payload migrate`. Prisma boleh coexist hanya untuk
  tabel non-Payload / read-only introspection.
- **Desain admin:** Opsi A (brand in-place) — Logo/Icon + `custom.scss` hijau + custom Dashboard (`beforeDashboard`).
- **Analitik pengunjung:** self-log ke `PageViews` + agregasi WITA (UTC+8). Terpasang.
- **Sumber fakta domain:** SK B/445.61/003/PKM.Btl-Adm/I/2023 (`public/SK JENIS PELAYANAN PKM BTL.pdf`); ringkas di `CLAUDE.md`.
- **Branch:** backend/artikel di `feat/artikel.adi`. Halaman `informasi-layanan-mutu` di `feat/informasi-layanan-mutu.adi` (pushed).

### Model data (terimplementasi)
- **Globals:** `OperationalHours`, `SiteSettings`
- **Collections:** `Users`(+role,+lokasi), `Doctors`, `MedicalStaff`, `Vaccines`, `Certificates`, `Articles`(drafts), `Media`, `PageViews`
- **Roles (REVISI):** `superadmin` (Puskesmas — akses penuh, kelola akun & tetapkan role) ·
  `admin` (unit/jejaring tersebar di beberapa lokasi, BUKAN poli internal — **hanya kelola artikel**,
  edit miliknya sendiri). Akun **pertama otomatis superadmin** (hook di Users). Field data collection
  pakai `poli` (kategorisasi), bukan unit-scoping. `lokasi` (text) = nama unit untuk akun admin.

---

## Fase 0 — Fondasi & Infra DB lokal  ✅

- [x] `docker-compose.yml` Postgres (`postgres:16-alpine`, host port **5434**)
- [x] Set `DATABASE_URL` lokal di `.env` (backup `.env.bak`)
- [x] Fix `payload.config.ts` registrasi `Users` — commit `590a914`
- [x] Script `payload` + `cross-env@10`
- [x] `/admin` HTTP 200, create-first-user render, tabel ter-push
- [ ] Buat 1 user superadmin — **MANUAL (user, via browser `http://localhost:3000/admin`)**

### Log Fase 0
- [2026-07-03] Container `puskesmas-db` up/healthy (port host 5432/5433 bentrok → 5434).
- [2026-07-03] `.env` sempat rusak (baris ke-tempel) → ditulis ulang bersih; koneksi DB OK, 9 tabel awal ter-push.

---

## Fase 1 — Auth & Roles (Access Control)  ✅

- [x] `role` (superadmin/admin_unit) + `unit` di `Users`, `saveToJWT`
- [x] Helper access `src/access/index.ts` (isSuperAdmin, superAdminOrSelf, unitScoped, publicReadUnitScoped, field access)
- [x] `enforceUnit` hook + `unitField` (admin unit terkunci ke unitnya)
- [x] Access `Users` (superadmin kelola user; user baca dirinya)

### Log Fase 1
- [2026-07-03] `src/access`, `src/lib/units.ts`, `src/fields/unit.ts`, `src/hooks/enforceUnit.ts`; Users diperbarui. Kolom `role`/`unit` (enum) ter-push. Commit `23e1ea7`.

---

## Fase 2 — Global: Jam Operasional & Site Settings  ✅ (public wiring ditunda)

- [x] Global `OperationalHours` (default sesuai SK)
- [x] Global `SiteSettings`
- [ ] Ganti `jadwal` hardcoded di `StandarPelayananContent.tsx` → baca `OperationalHours`
      **DITUNDA**: file ada di branch `feat/informasi-layanan-mutu.adi`. Kerjakan saat merge/di branch itu.

### Log Fase 2
- [2026-07-03] `src/globals/OperationalHours.ts` (jadwal array default SK) & `SiteSettings.ts` dibuat & didaftarkan. Commit `23e1ea7`.
- [2026-07-03] CATATAN: wiring publik jam operasional ditunda karena halaman-nya di branch lain.

---

## Fase 3 — Collection Konten Inti  ✅

- [x] `Doctors` (nama, spesialisasi, foto, jadwal, unit, aktif)
- [x] `MedicalStaff` (nama, jabatan, unit, foto, aktif)
- [x] `Vaccines` (nama, jenis, stok, satuan, unit)
- [x] `Certificates` (judul, penerbit, tanggal, berkas upload — Media izinkan PDF)
- [x] Access per role (unit-scoped) + render publik via Local API (dipakai di Fase 4/nanti)

### Log Fase 3
- [2026-07-03] 4 koleksi dibuat, unit-scoped + `enforceUnit`. `Media` mimeTypes +PDF, `staticDir` diperbaiki ke `<project>/media`. Tabel `doctors/medical_staff/vaccines/certificates` ter-push. Commit `23e1ea7`.

---

## Fase 4 — Artikel  ✅

- [x] `Articles` (title, slug auto, cover, excerpt, content Lexical, category, author, publishedDate, drafts)
- [x] Hook slug otomatis (`src/fields/slug.ts`)
- [x] Publik: `/artikel` (list) + `/artikel/[slug]` (detail, render Lexical)
- [x] Menu "Artikel" (desktop+mobile) → `/artikel`

### Log Fase 4
- [2026-07-03] `Articles` + `_articles_v` (drafts) ter-push. Halaman publik dibuat, `/artikel` HTTP 200 (empty state). Render via `@payloadcms/richtext-lexical/react`. Commit `da79c36`.

---

## Fase 5 — Analitik Pengunjung + Statistik Dashboard  ✅

- [x] `PageViews` (path, referrer, uaHash, timestamps)
- [x] `/api/track` (filter bot UA) + `PageViewTracker` beacon di frontend layout
- [x] Agregasi WITA: 7h/30h/1th, histogram harian, jam peak
- [x] `DashboardStats` via `beforeDashboard`

### Log Fase 5
- [2026-07-03] Pipeline TERVERIFIKASI end-to-end: POST browser-UA → row masuk `page_views`; UA bot (curl) di-skip. `DashboardStats` render di dashboard admin. Commit `23e1ea7`.

---

## Fase 6 — Branding Admin (Opsi A)  ✅

- [x] `graphics.Logo` & `graphics.Icon` (logo puskesmas)
- [x] `custom.scss` palet hijau (tombol primary, aksen; best-effort selector Payload)

### Log Fase 6
- [2026-07-03] Logo/Icon + custom.scss didaftarkan; importMap diregenerate. Commit `23e1ea7`.
- [2026-07-03] Atas permintaan user: **warna admin dikembalikan ke DEFAULT Payload** — branding warna
  (tombol/nav hijau) dihapus dari custom.scss; hanya sisakan isolasi latar/teks ke `--theme-bg/--theme-text`
  agar tidak kebocoran globals.css. Logo/Icon puskesmas tetap.

---

## Fase 7 — Migrasi & Persiapan Deploy  ◐ (scaffold; finalisasi saat deploy)

- [x] `Dockerfile` (multi-stage) + `.dockerignore`
- [ ] `pnpm payload migrate:create initial` + set `push: false` untuk prod — **saat deploy** (jangan jalankan migrasi ke DB dev yang pakai push)
- [ ] Service app di compose / env produksi + secret

### Log Fase 7
- [2026-07-03] `Dockerfile` (node:22-alpine, `payload migrate && start`) + `.dockerignore` dibuat. Belum di-build/di-test (deploy-time). Commit menyusul.

---

## Fase 8 — Pembersihan & Rencana Pensiun Payload Admin  ◐ (2026-08-31)

Keputusan baru: UI admin Payload (`/admin`) akan **diganti seluruhnya** oleh dashboard
custom di `/dashboard`. Payload tetap dipakai sebagai backend (schema, auth, access
control, versioning, upload, Local API). Spesifikasi lengkap: `docs/CUSTOM_DASHBOARD_PLAN.md`.

### Sudah dikerjakan (commit `8e44f45`, PR #8)
- [x] Hapus `src/app/(payload)/admin/importMap.ts` — sisa versi Payload lain (memetakan
      `CollectionCards` dari `@payloadcms/ui/rsc`), tidak diimpor siapa pun karena
      `layout.tsx` memakai `importMap.js`. **Inilah akar penyebab `pnpm build` gagal**
      selama ini di semua branch.
- [x] Satukan koleksi `media`: sebelumnya didefinisikan inline di `payload.config.ts`
      sementara `src/collections/Media.ts` ada tapi tidak pernah diimpor (kode mati).
      Definisi dipindah ke `Media.ts`, `staticDir` disesuaikan ke `'../../media'`.
      Skema tidak berubah → **tidak ada migrasi DB**.
- [x] Regenerasi `payload-types.ts` & importmap — hanya bertambah komentar dokumentasi.
- [x] `Users.auth`: `maxLoginAttempts: 5` + `lockTime` 10 menit (anti brute-force).
- [x] `PageViews.create` ditutup dari publik — penulisan hanya lewat `/api/track`.
- [x] `slugField` menjamin slug unik dengan sufiks angka (`judul-sama-2`).

### Tahap 2 — Penghapusan `/admin` ✅ SELESAI 2026-08-31 (commit `ec5c495`)
- [x] Halaman `/dashboard/setup` untuk membuat superadmin pertama — dibuat **sebelum**
      penghapusan. Dijaga di server (`payload.count({collection:'users'}) === 0`), bukan
      hanya di UI. Menggantikan layar "create first user" Payload yang ikut hilang.
- [x] Hapus `admin.components` dari `payload.config.ts`; ditambah `admin.disable: true`
- [x] Hapus `src/components/admin/*` (logika statistik diporting ke `src/lib/dashboard/statistik.ts`)
- [x] Hapus route group `(payload)/admin` + `importMap.js`
- [x] Hapus `src/app/(payload)/custom.scss` dan `(payload)/layout.tsx`
      → masalah `sass` yang tidak ter-resolve dari root ikut hilang, `sass` tidak perlu dipasang
- [x] **`(payload)/api` DIPERTAHANKAN** — REST melayani berkas media publik
- [x] Verifikasi `pnpm build` berhasil; `/admin` → 404; `/api/users` → 403 (REST hidup)
- [ ] Verifikasi `payload migrate` di produksi — saat deploy (M4)

### Yang tersisa dari Payload setelah penghapusan
Schema & migrasi (Drizzle) · auth (hash password, JWT, cookie `payload-token`) ·
access control `src/access` · Local API · drafts/versions `articles` · upload + sharp ·
REST `/api/*` · `payload-types.ts`. **Yang hilang hanya UI-nya.**

### Log Fase 8
- [2026-08-31] Pembersihan tahap pertama selesai (importMap basi, koleksi `media` disatukan).
- [2026-08-31] Field `content` pada `Articles` diubah dari `richText` (Lexical) ke `textarea`
  berisi HTML. **Database diperiksa dulu: 0 artikel**, jadi tanpa risiko dan tanpa script
  konversi. Konsekuensi: `@payloadcms/richtext-lexical` masih terpasang sebagai editor
  default di config, tapi tidak ada field yang memakainya lagi — bisa dilepas nanti.
- [2026-08-31] **Tahap 2 selesai: `/admin` dihapus** setelah dashboard custom di `/dashboard`
  bisa dipakai penuh dan halaman `/dashboard/setup` tersedia. Diverifikasi di server dev.

---

## Progress Log (ringkasan milestone)

- [2026-07-03] Rencana dibuat (`docs/PAYLOAD_PLAN.md`).
- [2026-07-03] **Fase 0 selesai** (kecuali buat superadmin di browser): Postgres lokal Docker :5434, `.env` lokal, `/admin` 200.
- [2026-07-03] **Fase 1 selesai**: roles + access control (`23e1ea7`).
- [2026-07-03] **Fase 2 selesai** (globals): OperationalHours + SiteSettings; wiring publik jam ditunda ke branch informasi.
- [2026-07-03] **Fase 3 selesai**: Doctors, MedicalStaff, Vaccines, Certificates (unit-scoped).
- [2026-07-03] **Fase 4 selesai**: Articles + halaman publik `/artikel` (`da79c36`).
- [2026-07-03] **Fase 5 selesai**: analitik PageViews + dashboard stats (pipeline terverifikasi).
- [2026-07-03] **Fase 6 selesai**: branding admin (logo + custom.scss hijau).
- [2026-07-03] **Fase 7 scaffold**: Dockerfile + .dockerignore; migrasi prod & finalisasi deploy = nanti.
- [2026-07-03] **Revisi role model** (permintaan user): `admin_unit`→`admin`; admin hanya kelola
  artikel; superadmin kelola akun+role; akun pertama otomatis superadmin; unit-scoping data diganti
  `poli`; `unit`→`lokasi` di Users. Schema dev di-reset (0 data) & push ulang. Commit `0ed4a3a`.
- [2026-07-03] Fix admin panel ramah light/dark mode via `custom.scss` (commit `56af320`).
- [2026-07-03] Warna admin dikembalikan ke DEFAULT Payload (hapus branding warna), commit `e62bdb7`.
- [2026-07-03] DashboardStats: warna ikut tema Payload + histogram **bulanan (12 bln)** & **mingguan
  (4 mgg)** selain harian; commit `a89d5e0`. Jam peak jadi interval 1 jam (`c868859`).
- [2026-07-03] **BUG FIX**: koleksi `media` tanpa `access` → default Payload butuh auth utk read →
  gambar publik ter-blokir. Ditambah `read: () => true`. (commit menyusul)
- [2026-07-03] SISA MANUAL: **restart dev server-mu** lalu buat akun pertama (otomatis superadmin);
  wiring publik jam operasional saat merge branch; hapus cache `.next` bila error ENOENT route.
- [2026-08-31] **Keputusan besar**: UI admin Payload diganti dashboard custom di `/dashboard`
  (spesifikasi: `docs/CUSTOM_DASHBOARD_PLAN.md`). Payload tetap jadi backend.
- [2026-08-31] **Fase 8 tahap 1 selesai**: importMap basi dihapus (akar penyebab build gagal),
  koleksi `media` disatukan ke `src/collections/Media.ts`, kunci login, slug unik, `page-views`
  ditutup dari publik. Commit `8e44f45`, PR #8.
- [2026-08-31] **Fase 8 tahap 2 selesai**: `/admin` dihapus total, digantikan dashboard custom
  di `/dashboard` (14 halaman). Pembuatan superadmin pertama pindah ke `/dashboard/setup`.
  Commit `ec5c495`. Rincian per fase ada di `docs/CUSTOM_DASHBOARD_PLAN.md`.

---

## Review Menyeluruh — Celah, Edge Case, & Peningkatan (2026-07-03)

Status: `[x]` sudah ditangani · `[ ]` rekomendasi (belum).

### Prioritas TINGGI
- [x] **Media read butuh auth** → gambar (cover artikel, foto dokter, sertifikat) tak tampil untuk
  pengunjung publik. Fix: `media.access.read = () => true`.
- [ ] **Analitik menghitung page-view, bukan PENGUNJUNG unik.** → dijadwalkan **M3** (PROJECT_PLAN) Requirement minta "jumlah orang".
      Rekomendasi: set cookie visitor-id (mis. per hari), dedup di `/api/track` → metrik "orang"
      terpisah dari "kunjungan". Saat ini angka = total view.
- [x] ~~**`/api/track` + `PageViews.create: () => true` tanpa rate limit**~~ — **SELESAI 2026-08-31**
      (rate limit 30/menit per IP, `create` publik ditutup, validasi path). Sisa: rate limit
      in-memory hanya cukup untuk satu instance; pindahkan ke Redis bila nanti multi-instance.
      Catatan asli: → siapa pun bisa membanjiri
      DB (DoS/analitik palsu), termasuk via REST `/api/page-views`. Rekomendasi: rate-limit per IP,
      tutup create REST publik (hanya lewat route + `overrideAccess`), atau token beacon.

### Prioritas SEDANG
- [x] ~~**Slug artikel bentrok**~~ — **SELESAI 2026-08-31**: sufiks angka otomatis (`judul-sama-2`).
      Catatan asli:: `unique:true` tapi auto-generate dari judul tanpa dedup → dua judul
      sama = error simpan. Fix: cek keunikan & tambah sufiks (`-2`) di hook slug.
- [x] ~~**Brute-force login**~~ — **SELESAI 2026-08-31**: `maxLoginAttempts: 5`, `lockTime` 10 menit.
- [ ] **Admin bisa self-publish artikel** (set `_status=published`). Bila perlu alur review, batasi
      publish ke superadmin via field access `_status`. (keputusan desain)
- [ ] **Upload lokal-disk tidak persist di produksi** → dijadwalkan **M4** (storage S3/R2, PROJECT_PLAN) (container ephemeral). Pakai storage adapter
      (S3/R2/UploadThing) untuk prod. (Fase 7)
- [ ] **PDF ke koleksi `media` ber-imageSizes** → sharp coba resize PDF, berpotensi error. Uji; bila
      perlu, pisahkan koleksi upload dokumen (tanpa imageSizes) untuk sertifikat.

### Prioritas RENDAH
- [x] ~~`PageViewTracker` tanpa debounce/dedup~~ — **SELESAI 2026-08-31**: jeda 800ms + penjagaan
      path yang sama tidak terkirim dua kali; `/dashboard` & `/api` juga tidak dilacak.
- [ ] Bot filter hanya regex UA → headless ber-UA palsu lolos.
- [x] ~~`/artikel` tanpa paginasi (limit 30)~~ — **SELESAI 2026-08-31**: paginasi 12 per halaman.
- [ ] `DashboardStats` fetch s/d 20k baris + 12 count → dijadwalkan **M3** (agregasi SQL saat porting ke dashboard) → berat bila traffic besar; pertimbangkan
      agregasi SQL (`date_trunc`) atau tabel ringkasan harian.
- [ ] CORS/CSRF Payload belum dikonfigurasi (`cors`, `csrf`) → dijadwalkan **M3** — perlu bila frontend beda domain.
- [x] ~~`path` di `/api/track` diterima apa adanya~~ — **SELESAI 2026-08-31**: hanya menerima path
      internal (diawali `/`, bukan `//`, tanpa `://`), dan path admin/dashboard/api ditolak.
- [ ] Artikel `author` bisa dangling bila user dihapus. → dijadwalkan **M3** (saat modul Pengguna)
- [ ] Reset password / verifikasi email auth belum diaktifkan (untuk prod). → dijadwalkan **M4/M5**
