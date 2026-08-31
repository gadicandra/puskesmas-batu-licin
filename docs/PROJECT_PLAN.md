# Website Puskesmas Batulicin — Rencana Proyek

Rencana kerja penyelesaian website UPTD Puskesmas Batulicin: 8 halaman/modul,
tim 4 orang, **go-live Jumat 2 Oktober 2026**.

Aturan jadwal: **satu section = satu minggu.** Bila satu section ternyata besar,
sisanya diselesaikan minggu berikutnya — bukan ditinggalkan. Tim bekerja dengan
bantuan AI, sehingga kecepatan per section jauh di atas estimasi manual biasa.

Dokumen pendamping:
- `docs/CUSTOM_DASHBOARD_PLAN.md` — spesifikasi lengkap dashboard custom (§6 = kontrak fitur)
- `docs/PAYLOAD_PLAN.md` — backend Payload (Fase 0–6 selesai)
- `CLAUDE.md` — arsitektur & konvensi kode
- `PRODUCT.md` — brief produk, audiens, prinsip desain

> **Aturan dokumen:** status di §3 dan checklist mingguan di §5 wajib diperbarui setiap
> Jumat. Tanggal dokumen: 2026-08-31 (Senin).

---

## 1. Ringkasan

| Item | Nilai |
| --- | --- |
| Baseline bersih | **PR #8 dibuka 31 Agustus 2026** — menunggu review & merge |
| Minggu kerja fitur | 31 Ags – 18 Sep (3 minggu) |
| **Deploy + testing dimulai** | **Senin, 21 September 2026** |
| UAT bersama staf Puskesmas | 21 – 25 September |
| Perbaikan & finalisasi | 28 Sep – 2 Oktober |
| **Go-live** | **Jumat, 2 Oktober 2026** |
| Tim | 4 orang (3 teknis, 1 penghubung stakeholder) |

**Jalur kritis:** Dashboard custom. Semua yang lain berjalan paralel dan tidak
menghambat. Bila dashboard meleset, rencana cadangan ada di §7.

**Risiko nomor satu tetap konten**, bukan kode: foto, data dokter, sertifikat
akreditasi, SOP pengaduan. Semua di luar kendali tim teknis → tanggung jawab P4 (§4).

---

## 2. Tim

| Kode | Nama | Peran | Beban |
| --- | --- | --- | --- |
| **P1** | Adi (_isi_) | Tech Lead — backend, dashboard, review PR, deploy | Penuh |
| **P2** | _isi_ | Frontend — halaman publik | Penuh |
| **P3** | _isi_ | Frontend + QA — halaman publik, pengujian | Penuh |
| **P4** | _isi_ | **Penghubung stakeholder** — konten & persetujuan | **Ringan (±3 jam/minggu)** |

**P4 tidak menulis kode dan tidak ikut rapat harian.** Tugasnya hanya tiga:
mengumpulkan konten dari pihak Puskesmas (§4), meminta persetujuan Kepala Puskesmas,
dan mendampingi staf saat UAT. Semua permintaan kepadanya dikirim sebagai daftar
tertulis yang konkret, tanpa istilah teknis, satu pesan satu tenggat.

**Ritme:** sinkronisasi tertulis harian (P1–P3); demo + planning tiap Jumat sore
45 menit (P4 hadir di sesi ini saja).

**Git:** branch `feat/<fitur>.<inisial>` dari `main`, PR wajib direview P1, tidak ada
commit langsung ke `main`, sertakan tangkapan layar desktop + ponsel untuk perubahan UI.

---

## 3. Status 8 halaman/modul

✅ selesai · 🟡 sebagian · ⬜ belum

| # | Halaman/Modul | Status | Owner | Minggu |
| --- | --- | --- | --- | --- |
| 1 | Tentang Kami (Profil, Struktur, Lokasi) | ✅ | — | verifikasi konten M2 |
| 2 | Home (Beranda) | 🟡 | P2 | M2 |
| 3 | Akreditasi & Penghargaan | ⬜ | P2 | M2 |
| 4 | Pengaduan, Kritik & Feedback | ⬜ | P3 + P1 | M1 |
| 5 | Layanan Kesehatan | ⬜ | P2 | M1 |
| 6 | Artikel (publik) | 🟡 | P3 | M2 |
| 7 | Informasi Layanan & Mutu | ✅ **sudah di-merge** | — | — |
| 8 | Dashboard custom | ⬜ | P1 | M1–M3 |

---

## 4. Konten yang harus disiapkan P4

Tanpa ini, halaman jadi tapi kosong. Setiap item punya rencana cadangan supaya
pekerjaan teknis tidak berhenti menunggu.

| # | Konten | Untuk | Tenggat | Cadangan bila terlambat |
| --- | --- | --- | --- | --- |
| C1 | Deskripsi singkat 14 jenis layanan + syarat pendaftaran | Layanan Kesehatan | **M1** (4 Sep) | Pakai nama layanan dari SK tanpa deskripsi |
| C2 | SOP penanganan pengaduan (alur, lama proses, penanggung jawab) | Pengaduan | **M1** (4 Sep) | Alur generik 3 langkah |
| C3 | Persetujuan penyimpanan data pengadu (privasi) | Pengaduan | **M1** (4 Sep) | **Tidak ada cadangan — wajib** |
| C4 | Sertifikat akreditasi (PDF), status, masa berlaku | Akreditasi | **M2** (11 Sep) | Halaman tampil dengan keadaan kosong |
| C5 | Daftar penghargaan (tahun, nama, pemberi) | Akreditasi | **M2** (11 Sep) | Bagian disembunyikan |
| C6 | Data & foto dokter (nama, spesialisasi, jadwal) | Layanan, Dashboard | **M2** (11 Sep) | Foto placeholder |
| C7 | Verifikasi nama & foto pejabat struktur organisasi | Tentang Kami | **M2** (11 Sep) | Data sekarang dipertahankan |
| C8 | Foto kegiatan & fasilitas (min. 15, resolusi baik) | Home, Artikel | **M2** (11 Sep) | Foto stok internal |
| C9 | Akun media sosial resmi | Footer | **M2** (11 Sep) | Ikon sosmed disembunyikan |
| C10 | 3–5 artikel/berita perdana | Artikel | **M3** (18 Sep) | Situs rilis tanpa artikel |
| C11 | 2–3 staf untuk UAT + jadwal pelatihan | UAT | **M3** (18 Sep) | **Tidak ada cadangan — wajib** |
| C12 | Persetujuan akhir Kepala Puskesmas | Go-live | **29 Sep** | **Tidak ada cadangan — wajib** |

Data yang **sudah** terverifikasi dan dipakai (sumber `data/puskesmas.md`): alamat resmi,
telepon/WhatsApp `0811 4881 2882`, email, nomor darurat PSC 119 `0852 4931 2786`,
nama Kepala Puskesmas, dan jam pelayanan sesuai SK B/445.61/003/PKM.Btl-Adm/I/2023.

---

## 5. Jadwal mingguan

### M0 — Baseline bersih · 31 Agustus ✅ SELESAI
Semua orang mulai dari titik yang sama. Rincian perbaikan di §6.
- [x] Merge halaman Informasi Layanan & Mutu ke baseline
- [x] Perbaiki seluruh tautan mati di navbar & footer
- [x] Perbaiki data yang salah di situs (alamat, telepon, jam pelayanan)
- [x] `pnpm lint` bersih dari error, `pnpm build` **berhasil** (sebelumnya gagal)
- [x] Bersih-bersih Payload: importMap basi dihapus, koleksi `media` disatukan ke `src/collections/`
- [x] PR **#8** dibuka ke `main`
- [ ] **Review & merge PR #8** — sebelum ini, jangan ada yang membuat branch fitur baru

---

### M1 — 31 Agustus – 4 September

| Owner | Section | Keluaran |
| --- | --- | --- |
| **P1** | **Dashboard bagian 1** — fondasi | Login `/dashboard/login`, guard auth, shell (sidebar+topbar+drawer ponsel), design system dashboard (Button, Field, Table, Modal, Toast, dll). `CUSTOM_DASHBOARD_PLAN.md` Fase 1–2 |
| **P2** | **Layanan Kesehatan** | `/layanan-kesehatan`: 14 layanan dalam gedung, detail Laboratorium, layanan luar gedung, UGD 24 jam, jadwal dokter dari koleksi `doctors`, alur pendaftaran |
| **P3** | **Pengaduan** | Koleksi `complaints` (bersama P1), route `POST /api/pengaduan` + rate limit + honeypot, halaman `/pengaduan` dengan form ramah awam, nomor tiket, kanal alternatif (telepon/WA) |
| **P4** | — | Kejar C1, C2, C3 |

---

### M2 — 7 – 11 September

| Owner | Section | Keluaran |
| --- | --- | --- |
| **P1** | **Dashboard bagian 2** — konten | Pola CRUD generik + validasi zod, modul Artikel lengkap, **editor WYSIWYG Tiptap**, migrasi konten Lexical→HTML, Galeri Gambar. Fase 3–5 |
| **P2** | **Akreditasi & Penghargaan**, lalu **Home** | `/akreditasi` dari koleksi `certificates`; Home: sambungkan jam & berita ke CMS, blok darurat, blok kontak, SEO + Open Graph |
| **P3** | **Artikel publik** + QA | Filter kategori & pencarian, perbaikan halaman detail (penulis, waktu baca, bagikan WhatsApp, artikel terkait), penyesuaian render HTML; QA hasil M1 |
| **P4** | — | Kejar C4–C9 |

---

### M3 — 14 – 18 September

| Owner | Section | Keluaran |
| --- | --- | --- |
| **P1** | **Dashboard bagian 3** — selesai | Modul Dokter, Tenaga Medis, Vaksin, Sertifikat, Pengaduan; Pengaturan (jam operasional, situs) + Pengguna + Akun; Beranda & Statistik; perbaikan analitik (pengunjung unik, agregasi SQL); halaman `/setup`; **hapus `/admin`**. Fase 6–10 |
| **P2** | **Home selesai** + rapikan lintas halaman | Optimasi gambar & performa, konsistensi visual, aksesibilitas |
| **P3** | **QA menyeluruh** | Uji lintas peramban & perangkat, aksesibilitas, keamanan (XSS, akses lintas role, banjir form), keadaan kosong; catat & verifikasi bug |
| **P4** | — | Kejar C10, C11 |

**Gerbang mutu akhir M3:** semua halaman berfungsi, dashboard bisa dipakai, tidak ada
error di `pnpm lint` dan `pnpm build`. Bila belum lulus → lihat §7.

---

### M4 — 21 – 25 September · **DEPLOY & TESTING**

| Owner | Keluaran |
| --- | --- |
| **P1** | Deploy ke staging: hosting, database produksi, **storage S3/R2** (wajib — unggahan disk lokal tidak persist), `push: false` + `payload migrate`, variabel lingkungan, backup otomatis, pemantauan |
| **P2** | Perbaikan dari hasil pengujian |
| **P3** | Uji asap di staging, uji beban ringan, Lighthouse, verifikasi seluruh alur di lingkungan nyata |
| **P4** | **Dampingi UAT**: 2–3 staf mencoba dashboard sungguhan — menulis artikel, unggah foto, ubah jam operasional. Catat setiap kebingungan mereka |

**UAT adalah pengujian sesungguhnya.** Kalau staf non-IT bingung, itu bug desain,
bukan kesalahan mereka.

---

### M5 — 28 September – 2 Oktober · **FINALISASI & GO-LIVE**

- Senin–Rabu: perbaikan dari UAT (prioritas: apa pun yang membuat staf gagal menyelesaikan tugas)
- Rabu: konten final masuk, persetujuan Kepala Puskesmas (C12)
- Kamis: pembekuan kode, uji asap terakhir, rencana rollback disiapkan
- **Jumat 2 Oktober: GO-LIVE** + pemantauan intensif
- Dua minggu setelahnya: siaga harian untuk error & pertanyaan staf

**Checklist rilis:**
- [ ] `push: false`, migrasi jalan di produksi
- [ ] `PAYLOAD_SECRET` produksi baru & kuat
- [ ] `/setup` diuji di database kosong, superadmin pertama dibuat, lalu terkunci
- [ ] Akun staf dibuat, kata sandi kuat
- [ ] Backup terjadwal & **sudah diuji pulih**
- [ ] `robots.txt`, `sitemap.xml`, favicon, metadata sosial
- [ ] Halaman 404 & 500 ramah
- [ ] Rencana rollback tertulis

---

## 6. Yang sudah diperbaiki di baseline M0

Audit codebase 31 Agustus 2026, seluruhnya sudah diperbaiki dan masuk PR ke `main`.

**Tautan mati (pengunjung kena 404):**
- Navbar desktop: menu Fasilitas, Dokter, dan Pengaduan menunjuk `/article/telescope`
  yang tidak ada → menu dihapus sampai halamannya benar-benar dibangun
- Navbar ponsel: `/about/us`, `/about/struktur`, `/about/lokasi` → diperbaiki ke
  `/profil-puskesmas`, `/struktur-organisasi`, `/lokasi-puskesmas` (ponsel dan desktop
  sebelumnya memakai path berbeda)
- Tombol Emergency Call: `/apply` & `/emergency` → sekarang `tel:085249312786` (PSC 119)
- Footer: `/layanan`, `/dokter`, `/berita`, `/pengaduan` → diganti rute yang benar-benar ada

**Data salah yang tampil ke publik:**
- Footer memuat alamat karangan "Jl. Raya Batulicin No. 123" → alamat resmi dari `data/puskesmas.md`
- Footer memuat telepon karangan "(0518) 123-456" → `0811 4881 2882`, bisa diklik, plus nomor darurat PSC 119
- Footer memuat jam "Senin–Sabtu 08.00–16.00" → jam sesuai SK + keterangan UGD 24 jam
- Beranda menampilkan status **Buka/Tutup memakai jam yang salah** (07.30–14.00) →
  dihitung ulang dari jadwal SK; ini yang paling serius, karena memberi tahu warga
  puskesmas buka padahal sudah tutup
- Hero menampilkan "08.00 - 16.00" → 08.00–11.00
- Kartu Laboratorium "07:00 - 13:00" → mengikuti jam dalam gedung sesuai SK

**Kualitas kode:**
- `pnpm build` **sebelumnya gagal** (`Cannot find module '@payloadcms/ui/rsc'`) →
  `@payloadcms/ui` dijadikan dependency eksplisit; build sekarang berhasil
- `pnpm lint`: 6 error → **0 error** (impure function di DashboardStats, setState di
  dalam effect pada Navbar & berita, `any` di Section, apostrof di halaman 404)
- Duplikat `src/components/berita/` (identik dengan `src/module/landingPage/berita.tsx`,
  tidak dipakai) dihapus
- Halaman percobaan `/demo` dihapus
- `tailwind.config.ts` dihapus — tidak aktif di Tailwind v4 dan menyesatkan
- Form berlangganan email di footer yang tidak terhubung ke mana pun dihapus
- Teks halaman 404 diterjemahkan ke Bahasa Indonesia

**Keamanan & data:**
- Slug artikel kini dijamin unik (`judul-sama-2`) — sebelumnya dua judul mirip = gagal simpan
- `/api/track`: rate limit 30/menit per IP, validasi path, tolak path internal
- `page-views` tidak lagi bisa ditulis lewat REST publik — hanya lewat route resmi
- Pelacak kunjungan: tidak melacak `/dashboard` & `/api`, ada jeda + anti-hitung-ganda
- Login dibatasi 5 percobaan, kunci 10 menit (anti brute-force)
- `/artikel` diberi paginasi (sebelumnya `limit: 30` tanpa paginasi)

**Bersih-bersih Payload:**
- `src/app/(payload)/admin/importMap.ts` dihapus — sisa versi Payload lain yang tidak diimpor
  siapa pun (layout memakai `importMap.js`). **Inilah akar penyebab build gagal**, sehingga
  dependency `@payloadcms/ui` yang sempat ditambahkan untuk menambalnya dilepas kembali
- Koleksi `media` dipindah dari definisi inline di `payload.config.ts` ke
  `src/collections/Media.ts` — file itu sudah ada tapi tidak pernah diimpor (kode mati).
  Skema tidak berubah, tidak ada migrasi DB
- `payload-types.ts` & importmap diregenerasi

**Sisa utang yang dijadwalkan, bukan diabaikan:**
| Utang | Kapan |
| --- | --- |
| Jam operasional masih hardcode (belum ambil dari CMS) — nilainya sudah benar | M2 (Home), M3 (dashboard) |
| Unggahan disk lokal tidak persist di produksi | M4 (storage S3/R2) |
| Analitik menghitung view, bukan orang unik | M3 |
| `author` artikel bisa dangling bila user dihapus | M3 |
| Ikon media sosial footer masih `href="#"` | menunggu C9 |
| Peringatan lint sisa (`<img>` vs `next/image`, exhaustive-deps) | M3, saat optimasi |
| `/admin` Payload belum dihapus (dashboard belum ada) + halaman `/setup` belum dibuat | M3 |
| CORS/CSRF Payload belum dikonfigurasi | M3 |
| Reset password & verifikasi email untuk produksi | M4/M5 |

---

## 7. Risiko & rencana cadangan

| Risiko | Mitigasi |
| --- | --- |
| **Dashboard tidak selesai dalam 3 minggu** | Ini yang paling mungkin. Cadangan: **tunda penghapusan `/admin`** sampai setelah go-live. Situs publik tetap rilis tepat waktu, staf sementara memakai `/admin`. Urutan kerja sudah disusun supaya modul Artikel (yang paling dibutuhkan staf) selesai lebih dulu di M2 |
| **Konten dari Puskesmas terlambat** | Setiap item C1–C12 punya cadangan di §4. Halaman tetap dibangun dengan keadaan kosong yang rapi |
| **Migrasi konten artikel merusak data** | Backup database dulu, jalankan di dev, verifikasi manual — jumlah artikel masih sedikit |
| **`/admin` dihapus tanpa `/setup`** | `/setup` wajib selesai & diuji sebelum penghapusan. Bila tidak sempat, `/admin` tidak dihapus |
| **Form pengaduan dibanjiri spam** | Rate limit + honeypot sejak hari pertama, bukan setelah kejadian |
| **Staf non-IT bingung memakai dashboard** | Prinsip desain ramah awam (`CUSTOM_DASHBOARD_PLAN.md` §2), UAT nyata di M4, panduan bergambar |
| **P1 jadi hambatan tunggal** | Semua backend + dashboard + review ada di P1. Bila tersendat, P3 mengambil alih task backend ringan dan review PR frontend |

---

## 8. Tidak dikerjakan di rilis pertama

Pendaftaran/antrean online · telemedicine · integrasi SIMPUS/BPJS/Satu Sehat · akun
pasien · multi-bahasa · aplikasi mobile · notifikasi email (pengaduan cukup badge di
dashboard) · riwayat versi artikel, penjadwalan terbit, aksi massal
(lihat `CUSTOM_DASHBOARD_PLAN.md` §14).

Permintaan baru di tengah jalan masuk daftar ini dulu, dibahas Jumat, baru diputuskan.

---

## 9. Log keputusan

| Tanggal | Keputusan | Alasan |
| --- | --- | --- |
| 2026-08-31 | Editor artikel WYSIWYG (Tiptap), bukan markdown | Pengguna dashboard orang awam non-IT |
| 2026-08-31 | `/admin` Payload dihapus total | Fokus satu dashboard; konsekuensi: `/setup` wajib dibuat |
| 2026-08-31 | Perbaikan analitik masuk ruang lingkup | Requirement asli meminta "jumlah orang", bukan jumlah view |
| 2026-08-31 | Notifikasi pengaduan v1 = badge dashboard, bukan email | Menghindari ketergantungan SMTP di rilis pertama |
| 2026-08-31 | Satu section = satu minggu, go-live 2 Oktober 2026 | Tim bekerja dengan bantuan AI; deploy & testing mulai 21 September |
| 2026-08-31 | Menu Fasilitas & Dokter dihapus dari navbar | Halamannya tidak ada dan tidak masuk ruang lingkup 8 halaman |

---

## Progress Log
- [2026-08-31] Baseline bersih selesai: Informasi Layanan & Mutu di-merge, 13 tautan mati
  diperbaiki, 6 data salah dikoreksi, build yang tadinya gagal kini berhasil, lint 0 error.
- [2026-08-31] Bersih-bersih Payload: importMap basi dihapus (akar penyebab build gagal),
  koleksi `media` disatukan ke `src/collections/Media.ts`. Detail di `PAYLOAD_PLAN.md` Fase 8.
- [2026-08-31] **PR #8** dibuka ke `main`
  (https://github.com/gadicandra/puskesmas-batu-licin/pull/8) — 58 file, +3825/-819.
  **Langkah berikutnya: review & merge, lalu semua orang membuat branch baru dari `main`.**
