# Custom Admin Dashboard — Spesifikasi & Rencana Kerja

Mengganti seluruh UI admin Payload (`/admin`) dengan dashboard custom di `/dashboard`,
memakai Next.js + Tailwind + design system project. Payload tetap dipakai sebagai
backend (schema, auth, access control, versioning, upload, Local API).

Dokumen pendamping: `docs/PAYLOAD_PLAN.md` (backend — Fase 0–6 selesai).

> **ATURAN WAJIB (untuk sesi mana pun yang mengerjakan file ini):**
> 1. Kerjakan per **Fase** (§12), dari atas ke bawah. Jangan lompat kecuali diminta.
> 2. Setiap task selesai → **centang checkbox** DAN **tambah baris log** di Log fase itu
>    (format: `- [YYYY-MM-DD] <apa yang dikerjakan> — <file/commit>`).
> 3. Setiap Fase selesai → tambah 1 baris ke **Progress Log** paling bawah.
> 4. Tanggal dokumen saat ini: 2026-08-31.
> 5. Jangan hapus entri log lama — hanya tambah.
> 6. **§6 (Spesifikasi Fitur) adalah kontrak.** Kalau implementasi menyimpang dari spec,
>    update spec-nya dulu, jangan diam-diam beda.

---

## 1. Keputusan terkunci

Sudah dijawab user, tidak dibuka lagi kecuali diminta.

| # | Keputusan | Konsekuensi |
| --- | --- | --- |
| **K1** | Pengguna dashboard **orang awam non-IT** → editor artikel harus **WYSIWYG**, bukan markdown | Pakai **Tiptap**; konten disimpan sebagai HTML; konten Lexical lama dimigrasi; **seluruh dashboard** wajib ramah awam (§2) |
| **K2** | **`/admin` dihapus total** | Tidak ada jaring pengaman — dashboard harus 100% menutupi kemampuan admin sebelum dihapus. Muncul masalah baru: pembuatan user pertama (§10) |
| **K3** | Path `/dashboard`, login `/dashboard/login` | — |
| **K4** | Tambah dependency seperlunya | Daftar final di §11, ditahan seminimal mungkin |
| **K5** | Role `admin` boleh lihat statistik **dan** upload media | Sidebar `admin`: Beranda, Artikel, Media, Statistik, Akun saya |
| **K6** | Perbaikan analitik ikut dikerjakan | Pengunjung unik, rate limit `/api/track`, agregasi SQL — detail di §9 |

---

## 2. Prinsip desain — dashboard untuk orang awam

K1 mengungkap batasan yang mengikat **seluruh** dashboard, bukan cuma editor. Setiap
halaman di §6 harus lulus prinsip ini.

1. **Tanpa jargon.** Tidak ada kata "slug", "draft", "publish", "upload", "field",
   "collection", "record". Pakai: *alamat halaman*, *belum terbit*, *terbitkan*,
   *unggah gambar*, *isian*, *data*.
2. **Tidak ada yang perlu dihafal.** Setiap isian yang tidak jelas punya keterangan satu
   kalimat di bawahnya. Tidak mengandalkan tooltip hover (tidak ada di ponsel).
3. **Sulit merusak, mudah membatalkan.** Semua penghapusan pakai dialog konfirmasi yang
   menyebut **nama** datanya ("Hapus artikel *Jadwal Posyandu Agustus*?"), bukan "Anda yakin?".
   Artikel dihapus → masuk status terhapus dulu, tidak langsung lenyap (§6.4).
4. **Status selalu terlihat.** Setiap halaman menjawab tanpa diklik: ini sudah tersimpan
   atau belum, sudah tampil di web atau belum.
5. **Pesan error memberi tahu cara memperbaiki.** Bukan "Validation failed", tapi
   "Judul belum diisi. Isi judul artikel lalu simpan lagi."
6. **Target sentuh besar & teks cukup besar.** Minimum 44px, teks isian ≥16px (juga
   mencegah zoom otomatis iOS). Sesuai `PRODUCT.md`: kontras WCAG AA, ramah lansia.
7. **Bisa dipakai di ponsel sepenuhnya.** Staf sering di lapangan. Tabel jadi kartu di
   layar kecil, bukan tabel yang di-scroll horizontal.

---

## 3. Arsitektur target

### Yang diganti
UI admin Payload seluruhnya: dashboard, sidebar, tabel, form, login, media library.

### Yang tetap dipakai dari Payload (jangan ditulis ulang)
| Bagian | Alasan |
| --- | --- |
| Schema & migrasi (Drizzle) | `payload.config.ts` tetap satu-satunya sumber bentuk data |
| Auth: hash password, JWT, cookie `payload-token` | Sudah teruji; menulis ulang = risiko keamanan tanpa manfaat |
| Access control `src/access/index.ts` | Server action pakai `overrideAccess: false` → aturan role otomatis berlaku |
| Local API (`payload.find/create/update/delete/auth/login`) | Hook, validasi, versioning ikut jalan |
| Drafts/versions `articles` | UI custom tinggal mengekspos `_status` |
| Upload + resize (`media` + sharp) | `payload.create({ file })` tetap menghasilkan thumbnail/card |
| REST `/api/*` | **Tetap hidup** — file media publik dilayani dari sini |
| `src/payload-types.ts` | Tipe form diturunkan dari sini |

### Aturan keamanan — tidak bisa ditawar
- **Semua mutasi lewat Server Action → Local API dengan `user` + `overrideAccess: false`.**
  Guard di layout hanya untuk UX (menyembunyikan menu); penegak sebenarnya tetap
  `src/access/index.ts`.
- Tidak ada `overrideAccess: true` di mana pun kecuali `/api/track` (beacon publik) —
  dan itu satu-satunya pengecualian yang boleh ada.
- Server component ambil data lewat Local API langsung, **bukan** `fetch` ke REST sendiri.

### Isolasi
Route group `(dashboard)` terpisah dari `(frontend)` → tidak kena Navbar/Footer publik dan
tidak kena `PageViewTracker`. Tailwind berlaku penuh di sini (berbeda dengan `/admin` dulu
yang harus pakai inline style).

---

## 4. Peta rute & struktur folder

```
src/app/(dashboard)/
├─ login/page.tsx                    # publik, TIDAK kena guard
├─ setup/page.tsx                    # hanya hidup saat jumlah user = 0 (§10)
└─ dashboard/
   ├─ layout.tsx                     # guard requireUser() + shell
   ├─ page.tsx                        # Beranda
   ├─ artikel/
   │  ├─ page.tsx                     # daftar
   │  ├─ baru/page.tsx                # tulis baru
   │  └─ [id]/page.tsx                # ubah
   ├─ media/page.tsx                  # Galeri Gambar
   ├─ dokter/{page,baru,[id]}
   ├─ tenaga-medis/{page,baru,[id]}
   ├─ vaksin/{page,baru,[id]}
   ├─ sertifikat/{page,baru,[id]}
   ├─ statistik/page.tsx
   ├─ pengaturan/
   │  ├─ jam-operasional/page.tsx
   │  └─ situs/page.tsx
   ├─ pengguna/{page,baru,[id]}
   └─ akun/page.tsx

src/components/dashboard/
├─ shell/    Sidebar, Topbar, MobileNav, UserMenu, PageHeader
├─ ui/       Button, Input, Textarea, Select, Checkbox, Field, Card, DataTable,
│            Badge, Modal, ConfirmDialog, Toast, Pagination, EmptyState,
│            Skeleton, FileDrop, SaveBar
├─ editor/   ArticleEditor (Tiptap), Toolbar, LinkDialog, ImageDialog
├─ form/     FormRoot, SubmitButton, ImagePicker, ArrayField, DatePicker
└─ charts/   StatTile, BarChart, Sparkline   (SVG murni, tanpa library chart)

src/lib/dashboard/
├─ auth.ts        getCurrentUser, requireUser, requireSuperAdmin
├─ actions.ts     helper CRUD generik (zod + Local API + revalidate)
├─ validation.ts  skema zod per collection
├─ html.ts        sanitasi HTML artikel (simpan & render)
└─ format.ts      tanggal id-ID, WITA, ukuran file
```

---

## 5. Matriks akses

| Halaman | superadmin | admin (unit) |
| --- | --- | --- |
| Beranda | ✅ penuh | ✅ versi ringkas (tanpa widget stok & data) |
| Artikel | ✅ semua artikel | ✅ hanya miliknya |
| Media | ✅ | ✅ (K5) |
| Statistik | ✅ | ✅ read-only (K5) |
| Dokter · Tenaga Medis · Vaksin · Sertifikat | ✅ | ❌ tidak tampil di menu, URL langsung → 403 |
| Pengaturan (jam operasional, situs) | ✅ | ❌ |
| Pengguna | ✅ | ❌ |
| Akun saya | ✅ | ✅ |

Belum login → semua diarahkan ke `/dashboard/login`.

---

## 6. Spesifikasi fitur per halaman

> Inilah bagian yang perlu direview paling teliti — ini yang akan benar-benar dibangun
> dan tampil di layar.

### 6.1 Login — `/dashboard/login`

**Isi layar:** logo Puskesmas, judul "Masuk ke Dashboard", isian Email dan Kata Sandi
(dengan tombol mata untuk memperlihatkan), tombol "Masuk", link "Lupa kata sandi?".

**Perilaku:**
- Gagal login → pesan "Email atau kata sandi salah." (tidak membocorkan mana yang salah)
- Akun terkunci karena salah berkali-kali → "Akun terkunci sementara. Coba lagi dalam N menit."
- Sudah login lalu buka `/dashboard/login` → langsung diarahkan ke Beranda
- Setelah berhasil → ke halaman yang tadi dituju, atau Beranda

**Catatan teknis:** login lewat server action → `payload.login()` lalu set cookie
`payload-token`. **Nama helper cookie Payload 3 harus diverifikasi ke dokumentasi saat
implementasi** — jangan asumsi. Fallback aman: POST ke REST `/api/users/login` dan
teruskan `Set-Cookie`.

---

### 6.2 Kerangka dashboard (semua halaman)

**Sidebar kiri** (desktop, selalu terlihat) — menu terfilter role:
Beranda · Artikel · Galeri Gambar · Statistik · **—** · Dokter · Tenaga Medis · Vaksin ·
Sertifikat · **—** · Pengaturan · Pengguna · **—** · Akun Saya
Setiap menu punya ikon (lucide) + label Indonesia. Menu aktif ditandai jelas.

**Topbar:** judul halaman + breadcrumb, tombol "Lihat Situs" (buka `/` di tab baru),
nama user + badge role, menu Keluar.

**Ponsel:** sidebar jadi drawer (tombol hamburger), animasi framer-motion mengikuti pola
Navbar publik.

**Global:** Toast di kanan-bawah untuk hasil simpan/hapus; skeleton saat memuat;
halaman 403 ("Anda tidak punya akses ke halaman ini") dan 404 versi dashboard.

---

### 6.3 Beranda — `/dashboard`

Menggantikan `src/components/admin/DashboardStats.tsx` (logika agregasi dipakai ulang,
tampilannya ditulis ulang dengan Tailwind).

**Baris kartu angka (StatTile):**
- Pengunjung hari ini · 7 hari · 30 hari (angka + perbandingan vs periode sebelumnya,
  panah naik/turun)
- Setelah §9: dibedakan **"orang"** (unik) dan **"kunjungan"** (total view)
- Artikel terbit · Artikel belum terbit

**Grafik:** histogram kunjungan 12 bulan terakhir, dan histogram 7 hari terakhir
(SVG sendiri, warna dari palet `secondary`).

**Jam ramai:** ditampilkan sebagai interval 1 jam, mis. "09.00–10.00" (logika WITA UTC+8
yang sudah ada dipertahankan).

**Panel aktivitas terbaru:** 5 artikel terakhir diubah (judul, status, waktu, siapa) dengan
link langsung ke halaman ubah.

**Panel perhatian (superadmin):**
- Stok vaksin menipis (di bawah ambang) — link ke halaman Vaksin
- Artikel belum terbit yang menunggu (jumlah + link)

**Aksi cepat:** tombol besar "Tulis Artikel Baru" dan "Unggah Gambar".

**Untuk role `admin`:** hanya kartu pengunjung, grafik, aktivitas artikel miliknya, dan
aksi cepat. Panel perhatian tidak tampil.

**Keadaan kosong:** belum ada data kunjungan → "Belum ada data kunjungan. Grafik akan
muncul setelah situs mulai dikunjungi."

---

### 6.4 Artikel — modul terpenting

#### Daftar artikel — `/dashboard/artikel`

**Isi layar:** tombol "Tulis Artikel Baru" (menonjol, kanan atas), kotak pencarian judul,
filter Kategori (Berita/Pengumuman/Kegiatan/Tips Kesehatan) dan Status (Semua/Sudah
terbit/Belum terbit), lalu tabel.

**Kolom:** gambar sampul (kecil) · Judul · Kategori · Status (badge hijau "Sudah terbit" /
abu "Belum terbit") · Penulis · Tanggal · aksi (Ubah, Lihat di situs, Hapus).

**Di ponsel:** tiap artikel jadi kartu (sampul, judul, badge status, tanggal, tombol Ubah).

**Perilaku:**
- Role `admin` hanya melihat artikelnya sendiri (otomatis dari `superAdminOrAuthor`)
- Paginasi 20 per halaman, urut terbaru
- Klik baris = buka halaman ubah
- Hapus → dialog konfirmasi menyebut judul artikel

**Keadaan kosong:** "Belum ada artikel. Mulai dengan menulis artikel pertama." + tombol.

#### Tulis / Ubah artikel — `/dashboard/artikel/baru` dan `/[id]`

Satu halaman, dua kolom di desktop (kolom kanan menyempit jadi bagian bawah di ponsel).

**Kolom utama:**
- **Judul** — isian besar, placeholder "Contoh: Jadwal Posyandu Bulan September"
- **Alamat halaman** (bukan "slug") — terisi otomatis dari judul, ditampilkan sebagai
  pratinjau URL `puskesmas.../artikel/jadwal-posyandu-bulan-september`, dengan tombol kecil
  "Ubah" untuk yang mau menyesuaikan. Kalau bentrok, sistem menambah akhiran otomatis
  (`-2`) **dan memberi tahu**, bukan menolak menyimpan — ini sekaligus memperbaiki bug
  yang tercatat di review `PAYLOAD_PLAN.md`
- **Ringkasan singkat** — textarea 2–3 baris, keterangan "Ditampilkan di daftar artikel dan
  hasil pencarian. Kosongkan untuk mengambil kalimat pertama."
- **Isi artikel** — editor WYSIWYG (§8)

**Kolom samping:**
- **Gambar sampul** — pratinjau + tombol "Pilih Gambar" (buka pemilih galeri/unggah baru),
  tombol "Hapus gambar"
- **Kategori** — dropdown
- **Tanggal terbit** — pemilih tanggal, terisi hari ini
- **Penulis** — hanya tampil & bisa diubah oleh superadmin; untuk role `admin` terkunci ke
  dirinya sendiri (dipaksa hook, UI tidak mengirim field ini)

**Bilah aksi (SaveBar) — menempel di bawah layar:**
- Status saat ini: "Belum terbit" / "Sudah terbit" / "Ada perubahan belum tersimpan"
- Tombol **Simpan** (menyimpan tanpa menerbitkan)
- Tombol **Terbitkan** (hijau) — jika sudah terbit, berubah jadi **Batalkan Terbit**
- Tombol **Lihat di Situs** (hanya jika sudah terbit)
- Tombol **Hapus** (merah, paling kanan, dengan konfirmasi)

**Perlindungan data (penting untuk pengguna awam):**
- Peringatan saat mau meninggalkan halaman kalau ada perubahan belum tersimpan
- Simpan otomatis ke draf lokal (browser) setiap beberapa detik, dipulihkan kalau
  browser tertutup tak sengaja
- Setelah simpan sukses → toast "Artikel tersimpan." dan status diperbarui

**Validasi (pesan ramah):** judul wajib; isi artikel tidak boleh kosong saat menerbitkan;
gambar sampul opsional tapi diberi saran "Artikel dengan gambar lebih menarik dibaca."

---

### 6.5 Galeri Gambar — `/dashboard/media`

Nama menu sengaja "Galeri Gambar", bukan "Media".

**Isi layar:** area unggah (seret & lepas + tombol "Pilih dari Perangkat"), kotak pencarian,
grid thumbnail.

**Tiap item:** thumbnail, nama file, ukuran, tanggal; klik → panel detail berisi pratinjau
besar, teks alternatif, tombol "Salin Tautan", "Ganti Teks Alternatif", "Hapus".

**Teks alternatif** (`alt`, wajib di schema): diminta saat unggah dengan label
"Keterangan gambar" dan penjelasan "Dibaca oleh pembaca layar untuk pengunjung tunanetra."
Tidak bisa dilewati — tapi diberi saran otomatis dari nama file.

**Validasi sebelum kirim:** maksimal 5MB dan hanya gambar/PDF (batas Payload), dicek di
browser dulu supaya tidak menunggu unggah gagal. Pesan: "Ukuran gambar maksimal 5MB.
Gambar ini 8,2MB — coba perkecil dulu."

**Hapus:** cek dulu apakah gambar dipakai artikel/dokter/sertifikat. Kalau dipakai →
"Gambar ini dipakai di 2 artikel. Menghapusnya membuat gambar hilang dari halaman
tersebut." + daftar tautan, baru boleh lanjut.

**Progress unggah:** bar per file, bisa unggah banyak sekaligus.

**Catatan produksi:** upload disk lokal **tidak persist** di container (utang dari
`PAYLOAD_PLAN.md` Fase 7). Perlu storage adapter S3/R2 sebelum go-live — dicatat di §13.

**PDF:** koleksi `media` punya `imageSizes`; sharp bisa error saat me-resize PDF. Diuji di
Fase 5; kalau bermasalah → koleksi `documents` terpisah tanpa `imageSizes` untuk sertifikat.

---

### 6.6 Dokter — `/dashboard/dokter` (superadmin)

**Daftar:** foto, nama, spesialisasi, jadwal praktik, poli, status Aktif/Nonaktif (toggle
langsung dari tabel), aksi Ubah/Hapus. Pencarian nama, filter poli & status.

**Form:** Nama (wajib) · Spesialisasi (wajib) · Foto (ImagePicker) · Jadwal praktik
(teks bebas, contoh diberikan: "Senin–Jumat, 08.00–11.00") · Poli (dropdown dari
`unitOptions`) · Aktif (checkbox, keterangan "Hanya yang aktif ditampilkan di situs").

---

### 6.7 Tenaga Medis — `/dashboard/tenaga-medis` (superadmin)

Sama polanya. **Form:** Nama · Jabatan (dropdown sesuai schema) · Foto · Aktif.

---

### 6.8 Vaksin — `/dashboard/vaksin` (superadmin)

**Daftar:** nama, jenis, **stok** (dengan penanda warna: merah bila di bawah ambang),
satuan, aksi. Urut stok menipis dulu.

**Form:** Nama (wajib) · Jenis (contoh: "Campak, Polio, DPT-HB-Hib") · Stok (angka) ·
Satuan (default "dosis") · Keterangan.

**Tambahan:** ubah stok cepat langsung dari tabel (tombol +/− atau isian angka inline) —
ini pekerjaan harian, tidak boleh butuh buka form penuh.

---

### 6.9 Sertifikat — `/dashboard/sertifikat` (superadmin)

**Daftar:** judul, penerbit, tanggal, tautan berkas, aksi.

**Form:** Judul (wajib) · Penerbit · Tanggal · Berkas PDF (unggah) · Keterangan.

---

### 6.10 Statistik — `/dashboard/statistik`

Versi mendalam dari Beranda; role `admin` boleh melihat (K5), read-only untuk semua.

**Isi:** pemilih rentang waktu (7/30/90 hari, atau tanggal khusus) · grafik garis kunjungan
harian · **halaman terpopuler** (top 10 path + jumlah, dengan judul halaman yang bisa
dibaca, bukan path mentah) · sebaran jam ramai (histogram 24 jam) · sebaran hari dalam
minggu · **sumber rujukan** (referrer, dikelompokkan per domain) · perbandingan
"orang unik" vs "total kunjungan" (§9).

**Penjelasan angka:** satu kalimat di bawah setiap grafik menerangkan artinya, mis.
"Satu orang yang membuka 5 halaman dihitung 1 orang dan 5 kunjungan."

**Keadaan kosong:** pesan ramah, bukan grafik kosong.

---

### 6.11 Pengaturan → Jam Operasional — `/dashboard/pengaturan/jam-operasional` (superadmin)

Mengelola global `operational-hours`.

**Isi:** daftar baris jadwal yang bisa ditambah/dihapus/diurut (drag atau tombol naik-turun).
Tiap baris: Hari (mis. "Senin – Kamis") dan Jam (mis. "08.00 – 11.00"). Ditambah isian
Catatan (default: "UGD & UGD Kebidanan melayani 24 jam, Senin–Minggu.").

**Pengaman:** tombol "Kembalikan ke jadwal resmi SK" yang memulihkan nilai default sesuai
SK B/445.61/003/PKM.Btl-Adm/I/2023, dengan konfirmasi. Peringatan di atas halaman:
"Jam ini tampil di halaman depan situs. Pastikan sesuai SK yang berlaku."

**Pekerjaan menyertai (utang `PAYLOAD_PLAN.md` Fase 2):** Footer,
`module/landingPage/waktuPelayanan.tsx`, dan `Hero.tsx` masih **hardcode** jam dari SK.
Harus disambungkan ke global ini — kalau tidak, mengubah jam di dashboard tidak berpengaruh
apa pun di situs, dan itu jebakan serius bagi pengguna awam.

---

### 6.12 Pengaturan → Situs — `/dashboard/pengaturan/situs` (superadmin)

Mengelola global `site-settings`: Nama instansi · Alamat · Telepon · Email · Sosial media
(daftar platform + URL, bisa tambah/hapus). Tiap isian diberi keterangan di mana ia tampil
di situs ("Ditampilkan di footer setiap halaman").

---

### 6.13 Pengguna — `/dashboard/pengguna` (superadmin)

**Daftar:** nama, email, role (badge), lokasi/unit, tanggal dibuat, aksi.

**Form tambah/ubah:** Nama · Email · Kata sandi (hanya saat membuat; saat mengubah ada
tombol terpisah "Atur Ulang Kata Sandi") · Role (dropdown: Super Admin (Puskesmas) /
Admin (Unit/Jejaring), dengan penjelasan singkat tiap pilihan) · Lokasi/unit (hanya muncul
bila role = Admin).

**Pengaman wajib:** superadmin **tidak bisa** menghapus atau menurunkan role dirinya
sendiri bila ia satu-satunya superadmin — kalau tidak, sistem terkunci permanen dan
(karena `/admin` dihapus) tidak ada jalan masuk lain.

**Hapus pengguna:** peringatkan bahwa artikel miliknya akan kehilangan penulis; tawarkan
memindahkan artikel ke pengguna lain (mencegah `author` dangling — utang dari review).

---

### 6.14 Akun Saya — `/dashboard/akun`

Ubah nama · lihat email dan role (read-only) · ganti kata sandi (kata sandi lama + baru +
konfirmasi, dengan indikator kekuatan sederhana) · tombol Keluar.

---

## 7. Design system dashboard

Dibangun di Fase 2, dipakai semua halaman di §6.

- **Token:** pakai ulang `--color-primary/secondary/tertiary` dari `globals.css`
  (tambahkan token surface/border/danger di sana kalau perlu — **jangan** di
  `tailwind.config.ts`, file itu tidak aktif di Tailwind v4 project ini)
- `Button` — primary / secondary / ghost / danger; ukuran; state loading & disabled
- `Field` (label + keterangan + pesan error) membungkus `Input`, `Textarea`, `Select`,
  `Checkbox`, `DatePicker`
- `Card`, `Badge` (status terbit, aktif/nonaktif, stok)
- `DataTable` — sortable, baris klik, kolom aksi, **otomatis jadi kartu di ponsel**,
  state kosong & loading
- `Pagination` tersinkron ke query string
- `Modal` + `ConfirmDialog` (wajib menyebut nama data yang dihapus)
- `Toast` provider
- `EmptyState`, `Skeleton`, `FileDrop`, `SaveBar`
- **Aksesibilitas:** focus ring terlihat, focus trap di modal, label form benar,
  target ≥44px, kontras AA, hormati `prefers-reduced-motion`

---

## 8. Editor artikel (Tiptap) & migrasi konten

### Editor yang dibangun
Toolbar sederhana, ikon besar berlabel, hanya yang benar-benar dibutuhkan:
**Tebal · Miring · Judul (H2/H3) · Daftar berpoin · Daftar bernomor · Tautan · Gambar ·
Kutipan · Batalkan/Ulangi**. Tidak ada tabel, tidak ada blok kode, tidak ada warna teks —
setiap tombol tambahan adalah beban bagi pengguna awam.

- **Sisip gambar** membuka pemilih galeri yang sama dengan `ImagePicker` (§6.5) — bukan
  isian URL
- **Tautan** lewat dialog kecil (teks + alamat), bukan mengetik markdown
- Tempel dari Word/Google Docs dibersihkan otomatis (paste as plain + format dasar) —
  ini sumber HTML kotor nomor satu di lingkungan kantor
- Editor tampil dengan tipografi yang mirip hasil akhirnya di situs

### Penyimpanan & keamanan
- Field `content` diubah dari `richText` (Lexical) → penyimpanan **HTML**
- **Sanitasi dua kali**: saat menyimpan (server action) dan saat merender di halaman publik.
  HTML dari editor tetap tidak boleh dipercaya
- Whitelist tag/atribut ketat: heading, p, strong, em, ul/ol/li, a (href aman), img
  (src internal), blockquote, br

### Migrasi konten lama
- Konversi dokumen Lexical yang ada → HTML lewat utilitas konversi
  `@payloadcms/richtext-lexical`. **Nama export harus diverifikasi ke dokumentasi saat
  implementasi**, jangan asumsi
- Script sekali jalan, **backup DB dulu**, jalankan di dev, verifikasi manual tiap artikel
  (jumlahnya masih sedikit — inilah alasan migrasi dilakukan sekarang, bukan nanti)
- Halaman publik `/artikel/[slug]` disesuaikan untuk merender HTML tersanitasi

---

## 9. Perbaikan analitik (K6)

- **Pengunjung unik:** cookie `visitor-id` (acak, berumur harian, tanpa data pribadi) di
  `/api/track`; dedup per hari → metrik **"orang"** terpisah dari **"kunjungan"**.
  Memenuhi requirement asli yang meminta "jumlah orang"
- **Rate limit** `/api/track` per IP + tutup `create` REST publik untuk `page-views`
  (hanya boleh lewat route dengan `overrideAccess`) — sekarang siapa pun bisa membanjiri DB
- **Agregasi SQL** (`date_trunc`) menggantikan pola fetch ≤20 ribu baris milik
  `DashboardStats` — sudah berat sekarang, tidak akan bertahan saat traffic naik
- **Debounce/dedup** di `PageViewTracker` (over-count saat navigasi cepat)
- Skip `/dashboard` **dan** `/api` di tracker (sekarang hanya skip `/admin`)
- Validasi `path` yang masuk (sekarang diterima apa adanya, hanya dipotong 512 karakter)

---

## 10. Menghapus `/admin` (K2) — konsekuensi yang harus ditangani

Penghapusan dilakukan **paling akhir** (Fase 10), setelah QA lulus. Tidak ada jaring
pengaman setelah ini.

- [ ] **Masalah user pertama.** Layar "create first user" Payload ikut hilang. Solusi:
      halaman `/setup` yang **hanya berfungsi saat `payload.count({collection:'users'})
      === 0`**, membuat superadmin pertama, lalu mati sendiri. Wajib ada sebelum `/admin`
      dihapus — kalau tidak, deploy ke database kosong tidak bisa dimasuki sama sekali
- [ ] Hapus `admin.components` (`beforeDashboard`, `graphics.Logo/Icon`) dari `payload.config.ts`
- [ ] Hapus `src/components/admin/*` (setelah logikanya diporting ke Beranda)
- [ ] Hapus route group `(payload)/admin` + `importMap`
- [ ] Hapus `src/app/(payload)/custom.scss` dan import-nya — **konsekuensi bagus:** masalah
      `sass` yang belum terpasang (`require.resolve('sass')` gagal dari root) hilang dengan
      sendirinya, jadi `sass` tidak perlu ditambahkan sama sekali
- [ ] **JANGAN hapus** `(payload)/api` — REST melayani file media publik dan dipakai situs
- [ ] Verifikasi `pnpm build` dan `payload migrate` masih jalan setelah pembersihan

---

## 11. Dependency final (K4)

**Ditambah:**
| Paket | Untuk |
| --- | --- |
| `zod` | Validasi server action |
| `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` | Editor WYSIWYG |
| `@tiptap/extension-link`, `@tiptap/extension-image` | Tautan & gambar di editor |
| `isomorphic-dompurify` (atau `sanitize-html`) | Sanitasi HTML artikel |

**Tidak ditambah:** `sass` (tidak perlu setelah §10) · `date-fns` (`Intl` bawaan cukup) ·
library chart (grafik ditulis dengan SVG) · library form (`useActionState` React 19 cukup).

**Dipakai ulang:** `tailwind-merge`, `clsx`, `lucide-react`, `framer-motion`, `sharp`.

---

## 12. Fase kerja

### Fase 1 — Fondasi auth & shell ✅
- [x] `src/lib/dashboard/auth.ts` (`getCurrentUser`, `requireUser`, `requireSuperAdmin`, `isSuperAdmin`)
- [x] `src/app/dashboard/(app)/layout.tsx` — guard + shell
- [x] Halaman login `/dashboard/login` + server action + penanganan error (§6.1)
- [x] Server action logout
- [x] Sidebar terfilter role + Topbar + drawer ponsel (§6.2)
- [x] Halaman 403 (`/dashboard/tanpa-akses`)
- [x] `PageViewTracker` skip `/dashboard` (sudah dikerjakan di baseline M0)

**Log Fase 1:**
- [2026-08-31] Struktur rute: `src/app/dashboard/login/` (publik) + `src/app/dashboard/(app)/`
  (dijaga guard). Route group `(app)` dipakai supaya layout ber-guard tidak ikut membungkus
  halaman login. Root layout `src/app/layout.tsx` sudah menyediakan html/body + Tailwind,
  jadi tidak perlu layout baru.
- [2026-08-31] Login memakai `payload.login()` lalu memasang cookie sesi dengan
  `generatePayloadCookie` dari `payload/shared` (**diverifikasi ke tipe paket terpasang**,
  bukan asumsi: `{ collectionAuthConfig, cookiePrefix, token, returnCookieAsObject }`).
  Logout memakai `generateExpiredPayloadCookie`. Dengan begitu cookie-nya sama persis
  dengan yang dibaca `payload.auth()`.
- [2026-08-31] Pesan error login tidak membedakan email vs kata sandi salah; akun terkunci
  diberi pesan khusus beserta lama tunggu.
- [2026-08-31] **BELUM diuji manual di peramban** — baru lolos `pnpm build`.

### Fase 2 — Design system (§7) ◐
- [x] Button (4 varian, state loading) · Field · Input/Textarea/Select
- [x] Card · Badge · EmptyState · PageHeader · StatTile · BarChart · ConfirmSubmit
- [ ] DataTable (+ mode kartu ponsel) · Pagination — dibuat saat modul Artikel
- [ ] Modal · Toast · Skeleton · FileDrop · SaveBar — dibuat saat dibutuhkan modulnya
- [x] Target sentuh ≥44px, focus ring, `text-base` di isian (mencegah zoom iOS)

**Log Fase 2:**
- [2026-08-31] Primitif dasar dibuat di `src/components/dashboard/ui/`. Memakai token warna
  yang sudah ada di `globals.css` (primary/secondary/tertiary/base) — tidak menambah token baru.
- [2026-08-31] Sisa komponen sengaja dibuat belakangan saat modul yang memakainya dikerjakan,
  supaya tidak membangun komponen yang ternyata tidak terpakai.

### Fase 3 — Pola CRUD generik ✅
- [x] `src/lib/dashboard/validation.ts` (zod, pesan Bahasa Indonesia)
- [x] `src/lib/dashboard/crud.ts` — pabrik server action create/update/delete
- [x] `src/lib/dashboard/errors.ts` — pemetaan error Payload → pesan yang bisa ditindaklanjuti
- [x] Filter/paginasi ditangani di tiap halaman daftar
- [x] `revalidatePath` termasuk path publik (`/artikel`, `/`)

**Log Fase 3:**
- [2026-08-31] `buatAksiCrud()` memangkas pengulangan untuk 4 koleksi sederhana. Helper ini
  **tidak** menggantikan access control — setiap operasi tetap `overrideAccess: false` + `user`.
- [2026-08-31] Checkbox HTML tidak terkirim saat tidak dicentang; ditangani lewat penanda
  `_checkbox_aktif` supaya nilai `false` benar-benar tersimpan, bukan diabaikan.

### Fase 4 — Artikel + editor (§6.4, §8) ✅
- [x] Field `content` → `textarea` berisi HTML + sanitasi (`src/lib/dashboard/html.ts`)
- [x] Migrasi Lexical → HTML **tidak diperlukan**: database diperiksa, 0 artikel
- [x] `ArticleEditor` Tiptap + toolbar 9 tombol + dialog tautan + pemilih gambar
- [x] Halaman daftar (search, filter kategori & status, paginasi, tabel/kartu)
- [x] Halaman tulis/ubah + bilah aksi menempel + peringatan keluar halaman
- [x] Dedup slug sudah dikerjakan di baseline M0; pratinjau alamat halaman ada di form
- [x] `/artikel/[slug]` merender HTML tersanitasi + waktu baca
- [ ] Simpan otomatis ke draf lokal (browser) — **belum**, lihat sisa pekerjaan §15

**Log Fase 4:**
- [2026-08-31] **Cek database sebelum migrasi: 0 artikel.** Perubahan tipe field jadi tanpa
  risiko dan tanpa script konversi. Inilah alasan memindahkannya sekarang, bukan nanti.
- [2026-08-31] Sanitasi dilakukan DUA KALI (simpan + render). Whitelist ketat, skema hanya
  http/https/mailto/tel sehingga `javascript:` dan `data:` diblokir; tautan keluar otomatis
  `rel="noopener noreferrer"`.
- [2026-08-31] Tipografi `.prose-artikel` / `.prose-dashboard` di `globals.css` dipakai
  halaman publik **dan** di dalam editor, supaya tampilan saat menulis mirip hasil akhir.

### Fase 5 — Galeri Gambar (§6.5) ◐
- [x] Grid galeri + pencarian + paginasi
- [x] Unggah + validasi ukuran/tipe di browser **dan** server + `alt` wajib
- [x] Panel detail (salin tautan, hapus)
- [x] Cek relasi sebelum hapus (artikel, dokter, tenaga medis, sertifikat)
- [x] `MediaPicker` dipakai editor artikel, sampul artikel, dan modul data
- [ ] Ubah `alt` dari panel detail — **belum**
- [ ] Unggah drag & drop dan bar progres per berkas — **belum** (sekarang pilih berkas biasa)
- [ ] Uji PDF vs `imageSizes` — **belum diuji**

**Log Fase 5:**
- [2026-08-31] Validasi ukuran dijalankan dua kali: di browser supaya pengguna tidak menunggu
  unggahan yang pasti gagal, dan di server sebagai pengaman sebenarnya.

### Fase 6 — Dokter · Tenaga Medis · Vaksin · Sertifikat (§6.6–6.9) ◐
- [x] Dokter · [x] Tenaga Medis · [x] Vaksin · [x] Sertifikat
- [ ] Ubah stok vaksin cepat dari tabel — **belum** (masih lewat form)
- [ ] Toggle aktif langsung dari tabel — **belum** (masih lewat form)
- [ ] Modul **Pengaduan** — belum dibangun (koleksi `complaints` belum ada, lihat PROJECT_PLAN M1)

**Log Fase 6:**
- [2026-08-31] Keempatnya memakai satu komponen generik `KoleksiSederhana` yang digerakkan
  spesifikasi field, sehingga menambah koleksi baru cukup menulis daftar field + satu file action.

### Fase 7 — Pengaturan & Pengguna (§6.11–6.14) ◐
- [x] Jam Operasional (editor baris + tombol "Kembalikan ke Jadwal Resmi SK")
- [ ] **Wiring jam operasional ke Footer, `waktuPelayanan.tsx`, `Hero.tsx` — BELUM.**
      Nilainya sudah benar (dikoreksi di baseline M0) tapi masih hardcode. Selama belum
      disambungkan, mengubah jam di dashboard **tidak berpengaruh di situs** — ini jebakan
      untuk pengguna awam dan harus diselesaikan sebelum staf dilatih.
- [x] Pengaturan Situs (kontak + media sosial)
- [x] Pengguna (CRUD + ganti kata sandi + pengaman superadmin terakhir)
- [ ] Pemindahan artikel saat pengguna dihapus — **belum** (baru diberi peringatan jumlahnya)
- [x] Akun Saya (ubah nama + ganti kata sandi dengan verifikasi sandi lama)

**Log Fase 7:**
- [2026-08-31] Dua pengaman anti-terkunci di modul Pengguna: superadmin terakhir tidak bisa
  dihapus maupun diturunkan rolenya, dan tidak ada yang bisa menghapus akunnya sendiri.
  Tanpa `/admin`, kehilangan superadmin terakhir berarti sistem terkunci permanen.

### Fase 8 — Beranda & analitik (§6.3, §6.10, §9) ◐
- [x] Porting `DashboardStats` → Beranda Tailwind (`src/lib/dashboard/statistik.ts`)
- [ ] StatTile + BarChart + Sparkline (SVG)
- [ ] Halaman Statistik mendalam
- [ ] Pengunjung unik + rate limit + agregasi SQL + debounce tracker

**Log Fase 8:**
- [2026-08-31] Beranda dashboard selesai lebih awal (bersamaan Fase 1) karena logika agregasinya
  tinggal diporting dari `DashboardStats`. Isi: 4 kartu angka, histogram 7 hari, jam ramai WITA,
  artikel terakhir diubah, panel stok vaksin menipis (superadmin saja). Admin unit hanya melihat
  artikel miliknya sendiri.
- [2026-08-31] Sisa Fase 8 (halaman Statistik mendalam, pengunjung unik, rate limit, agregasi SQL)
  belum dikerjakan.

### Fase 9 — Hardening & QA ◐
- [x] `auth: { maxLoginAttempts, lockTime }` di `Users` (baseline M0)
- [ ] Konfigurasi `cors` & `csrf` — **belum**
- [x] Audit `overrideAccess: true` — hanya di `/api/track` (beacon publik) dan
      `/dashboard/setup` (belum ada user yang bisa jadi aktor). Keduanya disengaja.
- [x] Uji lintas role: admin unit dialihkan ke `/dashboard/tanpa-akses` di 5 halaman
      khusus superadmin, dan ditolak Payload saat mencoba membuat data dokter
- [ ] Uji upload (>5MB, mimetype terlarang, PDF, nama file unicode) — **belum**
- [ ] Uji XSS nyata di peramban — **belum** (whitelist sanitasi sudah dipasang)
- [ ] Aksesibilitas & responsif diuji di perangkat asli — **belum**
- [ ] Reset password & verifikasi email untuk produksi — **belum**

**Log Fase 9:**
- [2026-08-31] Verifikasi runtime dijalankan di server dev, bukan hanya `pnpm build`:
  12 halaman dashboard HTTP 200 sebagai superadmin; 5 halaman ditolak untuk admin unit;
  `/admin` 404; `/api/users` 403 (REST hidup, access control jalan).

### Fase 10 — Hapus `/admin` & dokumentasi (§10) ◐
- [x] Halaman `/dashboard/setup` dibuat **sebelum** penghapusan
- [x] `src/app/(payload)/admin`, `custom.scss`, `layout.tsx` dihapus
- [x] `src/components/admin/*` dihapus
- [x] `payload.config.ts`: `admin.components` dibuang, `admin.disable: true`
- [x] `(payload)/api` dipertahankan (melayani berkas media publik)
- [x] `sass` tidak diperlukan lagi — masalahnya hilang bersama `custom.scss`
- [x] Update `CLAUDE.md`
- [ ] Panduan bergambar untuk staf Puskesmas — **belum**
- [ ] Verifikasi `payload migrate` di produksi — **belum** (saat deploy, M4)

**Log Fase 10:**
- [2026-08-31] `/setup` dijaga di **server** (`payload.count` = 0), bukan hanya di UI.
  Diverifikasi: dengan 1 akun di database, `/dashboard/setup` dialihkan ke halaman login.
- [2026-08-31] `/admin` kini 404, `/api/*` tetap hidup.

---

## 13. Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| **Migrasi Lexical → HTML merusak konten** | Artikel lama rusak/hilang format | Backup DB, jalankan di dev, verifikasi manual per artikel selagi jumlahnya sedikit |
| **XSS lewat konten editor** | Serius — situs publik instansi | Sanitasi saat simpan **dan** saat render, whitelist ketat, uji di Fase 9 |
| **`/admin` dihapus tanpa `/setup`** | Database baru tidak bisa dimasuki sama sekali | `/setup` wajib ada sebelum penghapusan (§10) |
| **Lupa `overrideAccess: false`** | Bocor data / eskalasi hak akses | Helper generik jadi satu-satunya jalan mutasi + audit manual Fase 9 |
| **Superadmin terakhir menghapus dirinya** | Sistem terkunci permanen | Pengaman di §6.13 |
| **Jam operasional tidak tersambung ke situs** | Pengguna awam mengira sudah berubah padahal tidak | Wiring wajib di Fase 7 |
| **Upload tidak persist di produksi** | Gambar hilang tiap redeploy | Storage adapter S3/R2 sebelum go-live |
| **Ruang lingkup lebih besar dari perkiraan** | Dashboard setengah jadi, tanpa jalan mundur | Jangan hapus `/admin` sebelum Fase 9 lulus |

---

## 14. Yang sengaja TIDAK dibangun (v1)

Perlu persetujuan user — kalau salah satu ternyata penting, estimasi berubah.

- Riwayat versi & pemulihan versi lama (cukup terbit ↔ belum terbit)
- Pratinjau langsung artikel di dalam editor (cukup tombol "Lihat di Situs")
- Aksi massal (hapus/terbitkan banyak sekaligus)
- Penjadwalan terbit otomatis di masa depan
- Notifikasi email
- Log audit "siapa mengubah apa"
- Dua bahasa / i18n dashboard
- Pengurutan manual (drag) untuk dokter/tenaga medis — v1 urut nama

---

## 15. Sisa pekerjaan dashboard (belum selesai)

Dicatat eksplisit supaya sesi berikutnya bisa langsung melanjutkan.

| Sisa | Fase | Catatan |
| --- | --- | --- |
| **Wiring jam operasional ke Footer/Hero/waktuPelayanan** | 7 | Paling penting. Sekarang mengubah jam di dashboard tidak berpengaruh di situs |
| Modul Pengaduan + koleksi `complaints` | 6 | Halaman publik `/pengaduan` juga belum ada |
| Simpan otomatis draf artikel di browser | 4 | Perlindungan bagi penulis awam |
| Ubah `alt` dari panel galeri | 5 | |
| Unggah drag & drop + bar progres | 5 | |
| Ubah stok vaksin & toggle aktif langsung dari tabel | 6 | Pekerjaan harian, sebaiknya tidak lewat form penuh |
| Pemindahan artikel saat pengguna dihapus | 7 | Sekarang baru diberi peringatan |
| Pengunjung unik + agregasi SQL | 8 | K6, belum dikerjakan |
| CORS/CSRF, reset password, verifikasi email | 9 | Untuk produksi |
| Uji upload, XSS nyata, aksesibilitas di perangkat asli | 9 | |
| Panduan bergambar untuk staf | 10 | |

---

## Progress Log
- [2026-08-31] Rencana awal dibuat, menunggu keputusan K1–K6.
- [2026-08-31] K1–K6 dijawab; dokumen ditulis ulang jadi spesifikasi fitur per halaman.
  Keputusan: editor WYSIWYG Tiptap (pengguna awam), `/admin` dihapus total, analitik ikut diperbaiki.
- [2026-08-31] **Fase 1–2 selesai**: auth, shell, design system, beranda. Commit `dfdc124`.
- [2026-08-31] **Fase 3–4 selesai**: pola CRUD, editor Tiptap, modul Artikel. Commit `6cd33b1`.
- [2026-08-31] **Fase 5–10 selesai sebagian**: Galeri, 4 modul data, Pengaturan, Pengguna,
  Akun, Statistik, `/dashboard/setup`, dan **`/admin` dihapus**. Commit `ec5c495`.
  Dashboard sudah bisa dipakai penuh; sisa pekerjaan didaftar di §15.
