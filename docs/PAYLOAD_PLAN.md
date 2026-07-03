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

- **Stack DB:** Postgres lokal via Docker untuk dev (bukan Supabase). Ganti hanya `DATABASE_URL`.
- **Migrasi:** pakai sistem migrasi bawaan Payload (Drizzle), **bukan Prisma**. Dev = `push: true`
  (auto-sync). Prod = `push: false` + `payload migrate`. Prisma boleh coexist hanya untuk
  tabel non-Payload atau read-only introspection — tidak boleh memigrasi tabel Payload.
- **Desain admin:** Opsi A (brand admin Payload di tempat) — logo + `custom.scss` hijau +
  custom Dashboard view untuk statistik. `src/app/(payload)/custom.scss` sudah ter-wire (masih kosong).
- **Analitik pengunjung:** Payload tidak punya analytics bawaan. Keputusan: **self-log** ke
  collection `PageViews` lalu agregasi (lihat Fase 5). Timezone acuan **WITA (UTC+8)**.
- **Sumber fakta domain** (jam layanan, jenis pelayanan): SK No. B/445.61/003/PKM.Btl-Adm/I/2023
  di `public/SK JENIS PELAYANAN PKM BTL.pdf` — ringkasannya ada di `CLAUDE.md`.
- **Branch:** pekerjaan Payload/artikel di `feat/artikel.adi`. Halaman `informasi-layanan-mutu`
  ada di branch `feat/informasi-layanan-mutu.adi` (sudah di-push, page-only).

### Bug/temuan yang sudah diperbaiki
- `payload.config.ts`: `Users` belum terdaftar di array `collections` → `admin.user` invalid.
  Sudah ditambahkan `Users` ke `collections`. (Perlu commit.)
- Koneksi DB gagal saat `/admin` (Supabase project paused / ref salah) — **belum tuntas**,
  akan digantikan Postgres lokal di Fase 0.

---

## Model data (target akhir)

- **Globals:** `OperationalHours`, `SiteSettings`
- **Collections:** `Users` (+`role`, +`unit`), `Doctors`, `MedicalStaff`, `Vaccines`,
  `Certificates`, `Articles` (drafts/versions), `Media` (sudah ada), `PageViews`
- **Roles:** `superadmin` (Puskesmas, akses penuh) · `admin_unit` (unit, akses terbatas ke unit-nya)

---

## Fase 0 — Fondasi & Infra DB lokal

**Tujuan:** `/admin` bisa dibuka, buat first user, DB lokal jalan.

- [ ] Buat `docker-compose.yml` Postgres lokal (mis. `postgres:16`, volume, port 5432)
- [ ] Set `DATABASE_URL` di `.env` ke DB lokal
- [ ] Commit fix `payload.config.ts` (registrasi `Users`)
- [ ] Tambah script `"payload": "cross-env NODE_OPTIONS=--no-deprecation payload"` di `package.json`
      (butuh `cross-env` — cek/instal)
- [ ] `pnpm dev` → buka `/admin` → verifikasi layar "Create first user"
- [ ] Buat 1 user superadmin manual

### Log Fase 0
-

---

## Fase 1 — Auth & Roles (Access Control)

**Tujuan:** fondasi role sebelum bikin collection lain, supaya access control langsung dipasang.

- [ ] Tambah field `role` di `Users` (`select`: `superadmin` | `admin_unit`, default `admin_unit`)
- [ ] Tambah field `unit` di `Users` (untuk scoping admin unit — `select`/relationship)
- [ ] Buat helper access control (mis. `isSuperAdmin`, `isSuperAdminOrSelfUnit`) di `src/access/`
- [ ] Pasang access di `Users` (hanya superadmin boleh kelola user)
- [ ] Uji: login admin_unit tidak bisa akses hal di luar unitnya

### Log Fase 1
-

---

## Fase 2 — Global: Jam Operasional & Site Settings

**Tujuan:** admin bisa ubah jam operasional (poin 3); public baca dari DB, bukan hardcode.

- [ ] Buat global `OperationalHours` (Sen–Kam, Jum, Sab + catatan UGD 24 jam)
- [ ] Isi nilai awal sesuai SK (Sen–Kam 08.00–11.00, Jum 07.30–10.30, Sab 08.00–11.00)
- [ ] Ganti array `jadwal` hardcoded di
      `src/components/informasi-layanan/content/StandarPelayananContent.tsx`
      agar baca `OperationalHours` via Local API
      **(catatan: file ini ada di branch `feat/informasi-layanan-mutu.adi` — koordinasikan merge)**
- [ ] (Opsional) Global `SiteSettings` (alamat, kontak, sosmed)

### Log Fase 2
-

---

## Fase 3 — Collection Konten Inti

**Tujuan:** poin 2, 5, 6, 7 — dokter, sertifikat, vaksin, tenaga medis.

- [ ] `Doctors` (nama, spesialisasi, foto→Media, jadwal, unit, aktif)
- [ ] `MedicalStaff` (nama, jabatan, unit, foto) — putuskan merge dengan Doctors atau pisah
- [ ] `Vaccines` (nama, jenis, `stock:number`, satuan, updatedAt)
- [ ] `Certificates` (judul, file→upload, tanggal, penerbit)
- [ ] Pasang access control per role di tiap collection
- [ ] Render ke public side (halaman terkait) via Local API

### Log Fase 3
-

---

## Fase 4 — Artikel

**Tujuan:** poin 8 — CMS artikel + tampil di web.

- [ ] `Articles` (title, slug, cover→Media, excerpt, content→Lexical, author→Users,
      category, `versions.drafts: true` untuk publish workflow)
- [ ] Hook auto-generate `slug` dari title
- [ ] Halaman publik: list artikel + detail (`/artikel`, `/artikel/[slug]`)
- [ ] Arahkan menu "Artikel" di Navbar ke halaman ini
- [ ] Access: admin_unit boleh tulis draft, publish diatur sesuai kebijakan

### Log Fase 4
-

---

## Fase 5 — Analitik Pengunjung + Statistik Dashboard

**Tujuan:** poin 1 — kunjungan mingguan/bulanan/tahunan, histogram harian, jam peak.

- [ ] `PageViews` (timestamp, path, userAgent/hash, referrer) — tulis-only dari publik
- [ ] Mekanisme logging kunjungan (route handler / middleware) + filter bot dasar
- [ ] Query agregasi (raw SQL via `payload.db.drizzle`, timezone WITA):
      - [ ] akumulasi 7 hari (per hari), 30 hari, 12 bulan
      - [ ] histogram per hari
      - [ ] jam peak (GROUP BY jam)
- [ ] Custom dashboard: `admin.components.beforeDashboard` atau
      `admin.components.views.dashboard.Component` — kartu stat + histogram
- [ ] (Pertimbangkan alternatif Umami/Plausible bila traffic besar)

### Log Fase 5
-

---

## Fase 6 — Branding Admin (Opsi A)

**Tujuan:** admin terlihat ber-brand Puskesmas, palet hijau.

- [ ] `graphics.Logo` & `graphics.Icon` (logo puskesmas)
- [ ] `src/app/(payload)/custom.scss`: override CSS var tema → palet hijau
      (`--color-base/primary/secondary`, elevation, dsb)
- [ ] Polish login page & nav

### Log Fase 6
-

---

## Fase 7 — Migrasi & Persiapan Deploy

**Tujuan:** siap produksi.

- [ ] Set `push: false` untuk produksi, buat migrasi: `pnpm payload migrate:create`
- [ ] Script CI: `payload migrate && pnpm build`
- [ ] Dockerfile untuk app (Docker "di akhir" sesuai rencana)
- [ ] Env produksi + secret

### Log Fase 7
-

---

## Progress Log (ringkasan per fase / milestone besar)

- [2026-07-03] Rencana ini dibuat (`docs/PAYLOAD_PLAN.md`).
- [2026-07-03] (Pra-plan) Fix `payload.config.ts` registrasi `Users` — belum commit.
- [2026-07-03] (Pra-plan) 404: Navbar+Footer ditambahkan & background putih
  (`src/app/not-found.tsx`, `src/components/page/404-page.tsx`) — belum commit.
