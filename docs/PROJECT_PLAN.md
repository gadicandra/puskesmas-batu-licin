# Website Puskesmas Batulicin — Rencana Proyek

Dokumen manajemen proyek tunggal. **Setiap task punya tenggat satu minggu**, jatuh pada
hari Jumat. Deploy & testing mulai **21 September**, go-live **2 Oktober 2026**.

Dokumen pendamping:
- `docs/DASHBOARD.md` — acuan dashboard + sisa pekerjaan (D1–D11)
- `CLAUDE.md` — arsitektur & konvensi kode
- `PRODUCT.md` — brief produk, audiens, prinsip desain

> **Aturan dokumen:** setiap Jumat sore, centang task yang selesai di §4 dan perbarui
> status di §3. Task yang tidak selesai **digeser ke minggu berikutnya, bukan dihapus**.
> Tanggal dokumen: 2026-08-31 (Senin).

---

## 1. Ringkasan

| Item | Tanggal |
| --- | --- |
| Baseline bersih + dashboard custom | ✅ **31 Agustus** (PR #8) |
| Minggu 1 | 31 Ags – **4 Sep** |
| Minggu 2 | 7 – **11 Sep** |
| Minggu 3 | 14 – **18 Sep** |
| **Deploy + testing + UAT** | 21 – **25 Sep** |
| Finalisasi & **GO-LIVE** | 28 Sep – **2 Oktober** |

**Jalur kritis sekarang: halaman publik + konten**, bukan lagi dashboard. Dashboard
selesai lebih cepat dari rencana, jadi P1 punya kapasitas untuk membantu modul publik.

**Risiko nomor satu: konten dari Puskesmas** (foto, data dokter, sertifikat, SOP
pengaduan). Di luar kendali tim teknis → tanggung jawab P4, §5.

---

## 2. Tim

| Kode | Nama | Peran | Beban |
| --- | --- | --- | --- |
| **P1** | Adi (_isi_) | Tech Lead — backend, dashboard, review PR, deploy | Penuh |
| **P2** | _isi_ | Frontend — halaman publik | Penuh |
| **P3** | _isi_ | Frontend + QA — halaman publik, pengujian | Penuh |
| **P4** | _isi_ | **Penghubung stakeholder** — konten & persetujuan | **Ringan (±3 jam/minggu)** |

**P4 tidak menulis kode dan tidak ikut rapat harian.** Tugasnya tiga: mengumpulkan konten
(§5), meminta persetujuan Kepala Puskesmas, dan mendampingi staf saat UAT. Kirim permintaan
sebagai daftar konkret tanpa istilah teknis — satu pesan, satu tenggat.

**Ritme:** sinkronisasi tertulis harian (P1–P3); demo + planning **Jumat sore 45 menit**
(P4 hadir di sesi ini saja). Setiap Jumat = batas tenggat semua task minggu itu.

**Git:** branch `feat/<fitur>.<inisial>` dari `main`, PR wajib direview P1, tidak ada
commit langsung ke `main`, sertakan tangkapan layar desktop + ponsel untuk perubahan UI.

**Definition of Done** (berlaku untuk semua task): berfungsi di Chrome & Safari, desktop
dan ponsel · responsif 360–1920px tanpa scroll horizontal · kontras AA & navigasi keyboard ·
teks Bahasa Indonesia tanpa lorem ipsum · keadaan kosong dan error ditangani ·
`pnpm lint` 0 error dan `pnpm build` berhasil · direview & di-merge P1.

---

## 3. Status 8 halaman/modul

✅ selesai · 🟡 sebagian · ⬜ belum

| # | Halaman/Modul | Status | Owner | Tenggat |
| --- | --- | --- | --- | --- |
| 1 | Tentang Kami (Profil, Struktur, Lokasi) | ✅ | — | verifikasi konten 11 Sep |
| 2 | Home (Beranda) | 🟡 | P2 | 18 Sep |
| 3 | Akreditasi & Penghargaan | ⬜ | P2 | 11 Sep |
| 4 | Pengaduan, Kritik & Feedback | ⬜ | P3 + P1 | 4 Sep |
| 5 | Layanan Kesehatan | ⬜ | P2 | 4 Sep |
| 6 | Artikel (publik) | 🟡 | P3 | 11 Sep |
| 7 | Informasi Layanan & Mutu | ✅ | — | — |
| 8 | Dashboard custom | ✅ `/admin` dihapus | P1 | sisa D1–D11 tersebar di §4 |

---

## 4. Task per minggu

Setiap baris adalah satu task dengan satu tenggat. Belum selesai pada hari Jumat →
geser ke minggu berikutnya dan catat alasannya.

### Minggu 1 — tenggat **Jumat 4 September**

| # | Task | Owner | Keluaran |
| --- | --- | --- | --- |
| T1.1 | **Merge PR #8 ke `main`** | P1 | Wajib hari Senin. Sebelum ini, jangan ada yang membuat branch fitur baru |
| T1.2 | **Wiring jam operasional ke situs** (D1) | P1 | Footer, `Hero.tsx`, `waktuPelayanan.tsx` baca global `operational-hours`. Uji: ubah jam di dashboard → situs ikut berubah |
| T1.3 | **Koleksi `complaints` + route `POST /api/pengaduan`** | P1 | Field lengkap, access `create` publik lewat route saja, rate limit + honeypot **sejak hari pertama** |
| T1.4 | **Halaman Layanan Kesehatan** `/layanan-kesehatan` | P2 | 14 layanan dalam gedung, detail Laboratorium, layanan luar gedung, UGD 24 jam, jadwal dokter dari koleksi `doctors`, alur pendaftaran. Jam dari CMS, bukan hardcode |
| T1.5 | **Halaman Pengaduan** `/pengaduan` | P3 | Form ramah awam: kategori sebagai kartu berikon, unit terkait, isi pesan, nama & kontak opsional ("boleh dikosongkan bila ingin anonim"), nomor tiket, kanal alternatif telepon/WA, alur penanganan 3 langkah |
| T1.6 | Kejar konten **C1, C2, C3** | P4 | Lihat §5 |

### Minggu 2 — tenggat **Jumat 11 September**

| # | Task | Owner | Keluaran |
| --- | --- | --- | --- |
| T2.1 | **Modul Pengaduan di dashboard** (D2) | P1 | Daftar, filter status, detail, ubah status, catatan internal, badge jumlah baru di sidebar & beranda |
| T2.2 | **Simpan otomatis draf artikel** (D3) + **ubah stok vaksin cepat** (D4) | P1 | Dua perlindungan/kemudahan yang paling terasa bagi staf |
| T2.3 | **Halaman Akreditasi & Penghargaan** `/akreditasi` | P2 | Status akreditasi, grid sertifikat dari koleksi `certificates`, daftar penghargaan, keadaan kosong yang rapi |
| T2.4 | **Artikel publik disempurnakan** | P3 | Filter kategori + pencarian, halaman detail (penulis, waktu baca, bagikan WhatsApp, artikel terkait), SEO per artikel + Open Graph |
| T2.5 | **QA hasil Minggu 1** | P3 | Jalankan checklist §6 untuk Layanan Kesehatan & Pengaduan; catat & verifikasi bug |
| T2.6 | Kejar konten **C4–C9** | P4 | Lihat §5 |

### Minggu 3 — tenggat **Jumat 18 September**

| # | Task | Owner | Keluaran |
| --- | --- | --- | --- |
| T3.1 | **Pengunjung unik + agregasi SQL** (D8) | P1 | Cookie visitor-id harian, dedup di `/api/track`, metrik "orang" vs "kunjungan", `date_trunc` menggantikan fetch 20k baris |
| T3.2 | **Pengerasan produksi** (D9) | P1 | CORS/CSRF Payload, reset kata sandi, verifikasi email, pemindahan artikel saat pengguna dihapus (D7) |
| T3.3 | **Home selesai** | P2 | Berita dari CMS, blok darurat menonjol, blok kontak & lokasi, ringkasan akreditasi & layanan, SEO + `JSON-LD MedicalClinic`, optimasi gambar hero (LCP < 2,5 detik di 4G) |
| T3.4 | **QA menyeluruh + uji keamanan** (D10) | P3 | Lintas peramban & perangkat, aksesibilitas, XSS di konten artikel, akses lintas role, banjir form pengaduan, unggah >5MB/PDF/nama unicode, semua keadaan kosong |
| T3.5 | Kejar konten **C10, C11** | P4 | Lihat §5 |

**Gerbang mutu akhir Minggu 3:** seluruh halaman berfungsi, dashboard bisa dipakai, tidak
ada error `pnpm lint` / `pnpm build`, bug dari QA sudah ditutup. Belum lulus → §7.

### Minggu 4 — **DEPLOY & TESTING** · tenggat **Jumat 25 September**

| # | Task | Owner | Keluaran |
| --- | --- | --- | --- |
| T4.1 | **Deploy ke staging** | P1 | Hosting, database produksi, `push: false` + `payload migrate`, variabel lingkungan, backup otomatis + **uji pulih**, pemantauan uptime & error |
| T4.2 | **Storage S3/R2** | P1 | **Wajib.** Unggahan disk lokal tidak persist di container — tanpa ini semua gambar hilang tiap redeploy |
| T4.3 | **Uji `/setup` di database kosong** | P1 | Bukti bahwa deploy baru bisa dimasuki. Setelah akun dibuat, halaman harus mati sendiri |
| T4.4 | Perbaikan dari hasil pengujian | P2 | |
| T4.5 | **Uji asap di staging + Lighthouse** | P3 | Seluruh alur di lingkungan nyata; target Performance ≥85, Accessibility ≥95 |
| T4.6 | **Dampingi UAT + panduan staf** (D11) | P4 + P1 | 2–3 staf mencoba sungguhan: menulis artikel, unggah foto, ubah jam. **Catat setiap kebingungan** — kalau staf non-IT bingung, itu bug desain, bukan kesalahan mereka |

### Minggu 5 — **GO-LIVE** · tenggat **Jumat 2 Oktober**

| Hari | Kegiatan |
| --- | --- |
| Senin–Selasa | Perbaikan dari UAT. Prioritas: apa pun yang membuat staf gagal menyelesaikan tugas |
| Rabu | Konten final masuk; persetujuan Kepala Puskesmas (**C12**) |
| Kamis | Pembekuan kode, uji asap terakhir, rencana rollback tertulis |
| **Jumat 2 Okt** | **GO-LIVE** + pemantauan intensif |
| 2 minggu setelahnya | Siaga harian untuk error & pertanyaan staf |

**Checklist rilis:**
- [ ] `push: false`, migrasi jalan di produksi
- [ ] `PAYLOAD_SECRET` produksi baru & kuat
- [ ] `/setup` diuji di database kosong, superadmin pertama dibuat, lalu terkunci
- [ ] Akun staf dibuat dengan kata sandi kuat
- [ ] Backup terjadwal & **sudah diuji pulih**
- [ ] `robots.txt`, `sitemap.xml`, favicon, metadata sosial
- [ ] Halaman 404 & 500 ramah
- [ ] Rencana rollback tertulis

---

## 5. Konten yang harus disiapkan P4

Tanpa ini halaman jadi tapi kosong. Setiap item punya cadangan supaya pekerjaan teknis
tidak berhenti menunggu.

| # | Konten | Untuk | Tenggat | Cadangan bila terlambat |
| --- | --- | --- | --- | --- |
| C1 | Deskripsi 14 jenis layanan + syarat pendaftaran | Layanan Kesehatan | **4 Sep** | **Sudah terpasang:** keterangan umum sementara di `src/seed/data/layanan-informasi.ts` (bukan isi SK). Teks resmi dari Puskesmas menimpanya lewat /dashboard/layanan; seed tidak menyentuh yang sudah disunting |
| C2 | SOP penanganan pengaduan (alur, lama proses, penanggung jawab) | Pengaduan | **4 Sep** | Alur generik 3 langkah |
| C3 | Persetujuan penyimpanan data pengadu (privasi) | Pengaduan | **4 Sep** | **Tidak ada — wajib** |
| C4 | Sertifikat akreditasi (PDF), status, masa berlaku | Akreditasi | **11 Sep** | Halaman tampil dengan keadaan kosong |
| C5 | Daftar penghargaan (tahun, nama, pemberi) | Akreditasi | **11 Sep** | Bagian disembunyikan |
| C6 | Data & foto dokter (nama, spesialisasi, jadwal) | Layanan, Dashboard | **11 Sep** | Foto placeholder |
| C7 | Verifikasi nama & foto pejabat struktur organisasi | Tentang Kami | **11 Sep** | Data sekarang dipertahankan |
| C8 | Foto kegiatan & fasilitas (min. 15, resolusi baik) | Home, Artikel | **11 Sep** | Foto stok internal |
| C9 | Akun media sosial resmi | Footer | **11 Sep** | Ikon sosmed disembunyikan |
| C10 | 3–5 artikel/berita perdana | Artikel | **18 Sep** | Situs rilis tanpa artikel |
| C11 | 2–3 staf untuk UAT + jadwal pelatihan | UAT | **18 Sep** | **Tidak ada — wajib** |
| C12 | Persetujuan akhir Kepala Puskesmas | Go-live | **30 Sep** | **Tidak ada — wajib** |

Data yang **sudah** terverifikasi dan dipakai (`data/puskesmas.md`): alamat resmi,
telepon/WhatsApp `0811 4881 2882`, email, darurat PSC 119 `0852 4931 2786`, nama Kepala
Puskesmas, dan jam pelayanan sesuai SK B/445.61/003/PKM.Btl-Adm/I/2023.

### Percanggahan data yang sudah ter-seed — perlu dikonfirmasi P4

Berbeda dari C1–C12 di atas: datanya **sudah masuk database apa adanya**, dengan
penanda di komentar kode. Yang dibutuhkan bukan konten baru, melainkan
kepastian mana yang benar. Perbaiki lewat `/dashboard` setelah dipastikan.

| # | Temuan | Di mana |
| --- | --- | --- |
| D1 | **Alamat berbeda antara dua dokumen resmi.** Kop SK: "Jln. Pemerintahan No.19 RT.05 RW.01, Kode Pos 72200". `data/puskesmas.md`: "No.071 Rt.005 RW.001". Yang ter-seed versi `puskesmas.md` | `site-settings` |
| D2 | **Penomoran misi meloncat** (1, 2, 4, 7 di dokumen asli). Empat butir dimasukkan berurutan — perlu dipastikan tidak ada yang terlewat | `profile.misi` |
| D3 | **Nama ganda:** "Anggi Ernia Rahmanita, AM.Keb" tercatat 2× dengan jabatan berbeda. Diambil jenjang lebih tinggi (Bidan Ahli Madya) | `medical-staff` |
| D4 | **Tiga nama di bagan tidak ada di daftar nakes:** drg. Lukman Noor Hakim (Gigi & Mulut), Debora Silitonga S.Ak (Keuangan), Siti Nur Halizah A.Md.Kes (Rehab Medik). Daftar nakes justru memuat drg. Selvi Lesmawati | `org-chart` |
| D5 | **Data Posyandu belum ada** di berkas sumber mana pun — koleksi `posyandu` masih kosong | — |

**Domain `.go.id`** perlu diurus P4 mulai **sekarang** — birokrasinya bisa lama dan
dibutuhkan di Minggu 4.

---

## 6. Checklist QA (dijalankan P3 tiap akhir minggu)

**Fungsional** — coba manual setiap alur utama, termasuk: ubah jam operasional di dashboard
lalu **verifikasi berubah di situs publik**; kirim pengaduan; tulis & terbitkan artikel;
unggah gambar.

**Peramban & perangkat** — Chrome Android (prioritas utama, mayoritas pengguna), Safari iOS,
Chrome desktop, Firefox desktop. Lebar 360px, 768px, 1440px.

**Aksesibilitas** — navigasi keyboard penuh, kontras AA, label form, `alt` semua gambar
informatif, heading runtut, uji cepat dengan TalkBack.

**Performa** — Lighthouse Performance ≥85, Accessibility ≥95; LCP < 2,5 detik di 4G.

**Keamanan** — XSS di konten artikel (tempel `<script>`, atribut `onerror`); akses lintas
role lewat URL langsung & action yang di-craft; banjir form pengaduan dan `/api/track`;
unggah >5MB, mimetype terlarang, PDF, nama file unicode; audit tidak ada
`overrideAccess: true` selain dua pengecualian yang disebut di `docs/DASHBOARD.md` §1.

**Konten** — tidak ada lorem ipsum, tidak ada tautan mati, jam & jenis layanan cocok SK.

---

## 7. Risiko & rencana cadangan

| Risiko | Mitigasi |
| --- | --- |
| **Konten dari Puskesmas terlambat** | Risiko terbesar sekarang. Setiap item C1–C12 punya cadangan di §5; halaman tetap dibangun dengan keadaan kosong yang rapi |
| **Halaman publik tidak selesai Minggu 3** | Potong ruang lingkup, bukan mutu: Akreditasi bisa rilis tanpa bagian Penghargaan; Home bisa rilis tanpa blok ringkasan layanan |
| **Unggahan hilang setelah redeploy** | T4.2 (storage S3/R2) wajib selesai sebelum go-live |
| **Form pengaduan dibanjiri spam** | Rate limit + honeypot sejak T1.3, bukan setelah kejadian |
| **Staf non-IT bingung memakai dashboard** | Prinsip desain di `docs/DASHBOARD.md` §2, UAT nyata di T4.6, panduan bergambar |
| **P1 jadi hambatan tunggal** | Semua backend + review ada di P1. Bila tersendat, P3 mengambil task backend ringan dan review PR frontend |
| **Domain `.go.id` belum terbit** | Rilis sementara di subdomain/URL hosting, domain resmi menyusul |

---

## 8. Tidak dikerjakan di rilis pertama

Pendaftaran/antrean online · telemedicine · integrasi SIMPUS/BPJS/Satu Sehat · akun pasien ·
multi-bahasa · aplikasi mobile · notifikasi email (pengaduan cukup badge dashboard) ·
riwayat versi artikel, penjadwalan terbit, aksi massal (lihat `docs/DASHBOARD.md` §5).

Permintaan baru di tengah jalan masuk daftar ini dulu, dibahas Jumat, baru diputuskan.

---

## 9. Log keputusan

| Tanggal | Keputusan | Alasan |
| --- | --- | --- |
| 2026-08-31 | Editor artikel WYSIWYG (Tiptap), bukan markdown | Pengguna dashboard orang awam non-IT |
| 2026-08-31 | `/admin` Payload dihapus total | Fokus satu dashboard; konsekuensi: `/dashboard/setup` wajib ada |
| 2026-08-31 | Perbaikan analitik masuk ruang lingkup | Requirement asli meminta "jumlah orang", bukan jumlah view |
| 2026-08-31 | Notifikasi pengaduan v1 = badge dashboard, bukan email | Menghindari ketergantungan SMTP di rilis pertama |
| 2026-08-31 | Menu Fasilitas & Dokter dihapus dari navbar | Halamannya tidak ada dan di luar ruang lingkup 8 halaman |
| 2026-08-31 | `docs/PAYLOAD_PLAN.md` dihapus, `CUSTOM_DASHBOARD_PLAN.md` diringkas jadi `DASHBOARD.md` | Fase backend & pembangunan dashboard sudah selesai; riwayatnya ada di git. Menyisakan dua dokumen hidup saja |
| 2026-09-02 | `docs/RENCANA-BERIKUTNYA.md` dipensiunkan; isinya yang masih berlaku pindah ke §5 (D1–D5), §10 (utang teknis) dan §11 (jebakan) | Dokumen serah-terima sesi jadi basi begitu pekerjaannya selesai — bagian F-nya masih menyebut `/layanan` sebagai tautan mati. Temuannya justru berumur panjang, jadi dipindah ke dokumen hidup |
| 2026-08-31 | Setiap task diberi tenggat satu minggu (Jumat) | Permintaan user: selesai secepatnya, deploy 3 minggu lagi |

---

## 10. Utang teknis

Diverifikasi ulang **2 September 2026** — daftar sebelumnya sempat memuat satu
klaim yang sudah tidak berlaku, jadi angka di bawah hasil pemeriksaan, bukan
salinan.

| Grup | Isi | Status |
| --- | --- | --- |
| A | 3 berkas mati: `module/landingPage/statistik.tsx` (181 baris, digantikan `pengunjung.tsx`), `components/profil/MottoCard.tsx`, `components/common/index.ts` | 0 pemakai — aman dihapus |
| B | 2 dependensi tak terpakai: `framer-motion` (0 impor — semuanya memakai `motion/react`), `dotenv` (0 rujukan) | aman |
| C | `type UnitValue` di `lib/units.ts` | 0 pemakai — aman |
| D | 14 impor tak terpakai (peringatan lint) | aman |
| E | **8 aset publik yatim** (±348 KB): `backgroundFooter.webp`, `layananPuskesmas.webp`, `posyandu.webp`, dan lima `*_2x.webp` (imunisasi, laboratorium, polianak, poligigi, poliumum) | lima yang terakhir menjadi yatim setelah `DEFAULT_ITEMS` dibuang dari `landingPage/layanan.tsx`; footer memakai `/11.webp`, bukan `backgroundFooter.webp` |
| ~~C lama~~ | ~~`formatTanggalWaktu()` di `lib/dashboard/format.ts`~~ | **tidak berlaku** — dipakai `dashboard/(app)/pengaduan/page.tsx` |

Belum dieksekusi karena menunggu kepastian bahwa aset di grup E tidak dipakai
desain yang sedang digarap.

Utang lain yang sudah tercatat di tempatnya masing-masing: `statistik.ts` masih
menghitung **page view, bukan pengunjung unik**, dan memuat sampai 20 ribu baris
sekaligus; jam pelayanan di Footer, `waktuPelayanan.tsx`, dan `Hero.tsx` masih
hardcode dan belum tersambung ke global `operational-hours` (butir D1 di
`docs/DASHBOARD.md` §4).

---

## 11. Jebakan yang gagal tanpa pesan galat

Semuanya pernah terjadi di proyek ini dan **tidak satu pun memunculkan error**,
jadi mudah terulang oleh orang berikutnya.

1. **Auto-push skema di container menggantung.** Tanpa TTY, pertanyaan "kolom ini
   dibuat atau diganti nama?" tidak bisa dijawab dan push berhenti separuh jalan,
   meninggalkan skema basi. Container memakai migrasi (`PAYLOAD_DB_PUSH=false`).
   Hal yang sama terjadi pada `pnpm payload migrate` di komputer yang skemanya
   pernah di-push: perintahnya menunggu konfirmasi "data loss will occur".
2. **`payload run` keluar sebelum promise selesai.** Skrip seed HARUS memakai
   top-level await, bukan `seed().then()`. Gejalanya: exit code 0, database kosong.
3. **`findGlobal` mengembalikan `defaultValue`** walau barisnya belum pernah ada,
   dan `db.findGlobal` mengembalikan `{}` yang tetap truthy. Penanda "sudah
   tersimpan" yang benar adalah `updatedAt`.
4. **Folder host vs container berebut.** Sudah dipisahkan lewat `NEXT_DIST_DIR`
   dan `MEDIA_DIR`; jangan mengisi keduanya di `.env`.
5. **Dua `pnpm build` beruntun saling merusak** karena berebut `.next`. Selalu
   `rm -rf .next` di antaranya, atau jalankan satu per satu.
6. **`docker compose down -v` menghapus volume `puskesmas_media`** beserta berkas
   unggahan lokal. Setelah R2 aktif ini tidak lagi berbahaya.
7. **`text-base` di proyek ini adalah warna, bukan 16px** — lihat
   `docs/DASHBOARD.md`. Teks yang memakainya menjadi putih di atas putih.
8. **`gh` terpasang lewat snap tidak bisa membaca `/media`**, sehingga
   `gh pr create` gagal dengan pesan menyesatkan "not a git repository".
   Perbaiki sekali dengan `sudo snap connect gh:removable-media`, atau buat PR
   lewat browser. Token GitHub MCP juga tidak punya izin membuat PR (403).

---

## Progress Log
- [2026-08-31] Baseline bersih: Informasi Layanan & Mutu di-merge, 13 tautan mati diperbaiki,
  6 data salah dikoreksi (alamat, telepon, jam pelayanan), build yang tadinya gagal kini
  berhasil, lint 0 error.
- [2026-08-31] **Dashboard custom selesai & `/admin` dihapus.** 14 halaman, editor WYSIWYG,
  `/dashboard/setup`. Diverifikasi di server dev, bukan hanya build.
- [2026-08-31] Dokumentasi dirapikan jadi dua: `PROJECT_PLAN.md` (jadwal & tenggat) dan
  `DASHBOARD.md` (acuan + sisa pekerjaan).
- [2026-08-31] **PR #8** terbuka ke `main` — 28 commit, 119 file.
  **Langkah berikutnya: merge (T1.1), lalu semua orang membuat branch baru dari `main`.**
- [2026-09-02] **Halaman publik Layanan selesai** — `/layanan` (statis) dan
  `/layanan/[slug]` (SSG, 19 halaman): hero berfoto, daftar centang "Layanan yang
  Tersedia", dan karusel Tim Dokter dengan jadwal praktik mingguan. Relasi baru
  `doctors.layanan` + field `services.gambar` (migrasi
  `20260902_084016_layanan_gambar_dan_relasi_dokter`).
- [2026-09-02] **19 layanan bergambar & unggahan otomatis jadi WebP.**
  `keWebp()` (`src/lib/gambar.ts`) mengubah gambar sebelum diserahkan ke Payload —
  bukan lewat `upload.formatOptions`, karena koleksi `media` dipakai bersama
  pindaian sertifikat yang harus tetap format aslinya. Kontrak konten kini
  mengekspos `srcKartu`/`srcMini`, memangkas `/layanan` dari 3.478 KB jadi 863 KB
  dan beranda dari ±1,6 MB jadi 70 KB.
- [2026-09-02] Berkas sumber di `data/` (41 MB: gambar layanan + `Sertifikat/`)
  dihapus setelah keberadaannya di R2 diverifikasi satu per satu; seed sudah bisa
  menariknya dari bucket. `docs/env-contoh.txt` menjadi `.env.example`.
