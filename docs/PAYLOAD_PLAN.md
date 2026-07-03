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
- [2026-07-03] SISA MANUAL: **restart dev server-mu** lalu buat akun pertama (otomatis superadmin);
  wiring publik jam operasional saat merge branch.
