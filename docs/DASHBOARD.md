# Dashboard `/dashboard` — Acuan & Sisa Pekerjaan

Dashboard custom yang menggantikan UI admin Payload (`/admin`, sudah dihapus).
Dokumen ini adalah **acuan yang masih hidup**: prinsip yang mengikat, ringkasan
tiap halaman, dan daftar pekerjaan yang belum selesai.

Riwayat pembangunannya ada di git (commit `dfdc124`, `6cd33b1`, `ec5c495`).
Arsitektur & konvensi kode: `CLAUDE.md`. Jadwal & tenggat: `docs/PROJECT_PLAN.md`.

---

## 1. Aturan yang tidak bisa ditawar

**Setiap mutasi lewat Server Action → Local API dengan `user` + `overrideAccess: false`.**
Guard di layout hanya menyembunyikan menu; penegak sebenarnya tetap `src/access/index.ts`.
Satu-satunya `overrideAccess: true` yang boleh ada: `/api/track` (beacon publik) dan
`/dashboard/setup` (belum ada user yang bisa jadi aktor).

**`/dashboard/setup` tidak boleh dihapus.** Halaman ini membuat Super Admin pertama dan
hanya hidup saat tabel users kosong. Tanpa `/admin`, database produksi yang baru tidak
punya jalan masuk lain.

**Superadmin terakhir tidak boleh bisa dihapus atau diturunkan rolenya.** Kalau sampai
kejadian, sistem terkunci permanen.

---

## 2. Prinsip desain — penggunanya orang awam non-IT

Staf Puskesmas yang memakai dashboard ini belum pernah mendengar istilah "slug" atau
"draft". Setiap halaman baru harus lulus tujuh prinsip ini.

1. **Tanpa jargon.** Bukan "slug/draft/publish/upload/field/record", tapi *alamat halaman*,
   *belum terbit*, *terbitkan*, *unggah gambar*, *isian*, *data*.
2. **Tidak ada yang perlu dihafal.** Isian yang tidak jelas diberi keterangan satu kalimat
   di bawahnya — bukan tooltip hover (tidak ada di ponsel).
3. **Sulit merusak, mudah membatalkan.** Dialog hapus menyebut **nama** datanya
   ("Hapus artikel *Jadwal Posyandu Agustus*?"), bukan "Anda yakin?".
4. **Status selalu terlihat.** Sudah tersimpan atau belum; sudah tampil di situs atau belum.
5. **Pesan error memberi tahu cara memperbaiki.** Bukan "Validation failed", tapi
   "Judul belum diisi. Isi judul artikel lalu simpan lagi."
6. **Target sentuh ≥44px, teks isian ≥16px** (juga mencegah zoom otomatis iOS).
   Kontras WCAG AA sesuai `PRODUCT.md`.
7. **Bisa dipakai penuh di ponsel.** Tabel jadi kartu di layar kecil, bukan tabel yang
   di-scroll menyamping.

---

## 3. Halaman yang sudah ada

| Halaman | Rute | Akses | Isi |
| --- | --- | --- | --- |
| Login | `/dashboard/login` | publik | Email + kata sandi, tombol lihat sandi. Gagal login tidak membocorkan mana yang salah; akun terkunci diberi pesan beserta lama tunggu |
| Pengaturan awal | `/dashboard/setup` | publik, **hanya saat users kosong** | Membuat Super Admin pertama |
| Beranda | `/dashboard` | semua | 4 kartu angka, histogram 7 hari, jam ramai WITA, artikel terakhir diubah, panel stok vaksin menipis (superadmin) |
| Artikel | `/dashboard/artikel` | semua (admin unit hanya miliknya) | Daftar + cari + filter kategori/status + paginasi; tabel di desktop, kartu di ponsel |
| Tulis/Ubah artikel | `/dashboard/artikel/baru`, `/[id]` | semua | Judul, pratinjau alamat halaman, ringkasan, editor WYSIWYG, sampul, kategori, tanggal. Bilah aksi menempel: Simpan · Terbitkan/Batalkan Terbit · Lihat di Situs · Hapus. Peringatan saat meninggalkan halaman dengan perubahan |
| Galeri Gambar | `/dashboard/media` | semua | Unggah (validasi 5MB & tipe di browser dan server), `alt` wajib, panel detail, salin tautan, hapus dengan cek relasi |
| Statistik | `/dashboard/statistik` | semua | 12 bulan, 7 hari, jam ramai, halaman terpopuler dengan nama yang bisa dibaca |
| Dokter · Tenaga Medis · Vaksin · Sertifikat | `/dashboard/{dokter,tenaga-medis,vaksin,sertifikat}` | superadmin | Tabel + form inline, digerakkan `KoleksiSederhana` |
| Pengaturan | `/dashboard/pengaturan` | superadmin | Jadwal jam pelayanan (+ tombol "Kembalikan ke Jadwal Resmi SK") dan informasi situs + media sosial |
| Pengguna | `/dashboard/pengguna` | superadmin | CRUD akun + ganti kata sandi + pengaman superadmin terakhir |
| Akun Saya | `/dashboard/akun` | semua | Ubah nama, ganti kata sandi (verifikasi sandi lama) |
| Tanpa Akses | `/dashboard/tanpa-akses` | — | Halaman 403 |

**Editor artikel** memakai Tiptap dengan toolbar sengaja dibatasi 9 tombol: Tebal, Miring,
Judul, Sub-judul, daftar berpoin, daftar bernomor, kutipan, tautan, gambar, undo/redo.
Sisip gambar membuka pemilih galeri, bukan isian URL. Konten disimpan sebagai HTML dan
**disanitasi dua kali** — saat simpan dan saat render di halaman publik.

**Menambah modul koleksi baru:** tulis skema zod di `validation.ts`, `actions.ts` yang
memanggil `buatAksiCrud`, dan satu halaman yang mengoper spesifikasi field ke
`KoleksiSederhana`. Salin `dashboard/(app)/vaksin/` sebagai template.

---

## 4. Sisa pekerjaan

Tenggat ada di `docs/PROJECT_PLAN.md`.

| # | Sisa | Kenapa penting |
| --- | --- | --- |
| D1 | **Wiring jam operasional ke Footer, `Hero.tsx`, `waktuPelayanan.tsx`** | Terpenting. Sekarang staf mengubah jam di dashboard, melihat "tersimpan", tapi situs tidak berubah — jebakan serius bagi pengguna awam |
| D2 | Modul Pengaduan di dashboard (butuh koleksi `complaints` dulu) | Halaman publik `/pengaduan` juga belum ada |
| D3 | Simpan otomatis draf artikel di browser | Perlindungan bagi penulis awam kalau browser tertutup tak sengaja |
| D4 | Ubah stok vaksin & toggle aktif langsung dari tabel | Pekerjaan harian, tidak seharusnya butuh buka form penuh |
| D5 | Ubah `alt` dari panel galeri | |
| D6 | Unggah drag & drop + bar progres | |
| D7 | Pemindahan artikel saat penggunanya dihapus | Sekarang baru diberi peringatan jumlahnya |
| D8 | Pengunjung unik (cookie visitor-id) + agregasi SQL | Angka sekarang menghitung view, bukan orang. Fetch ≤20k baris tidak akan bertahan saat traffic naik |
| D9 | CORS/CSRF, reset kata sandi, verifikasi email | Untuk produksi |
| D10 | Uji unggah (>5MB, PDF, nama unicode), uji XSS nyata, aksesibilitas di perangkat asli | Sanitasi & validasi sudah dipasang tapi belum dicoba dengan tangan |
| D11 | Panduan bergambar untuk staf | Dipakai saat pelatihan sebelum go-live |

---

## 5. Sengaja tidak dibangun di rilis pertama

Riwayat versi artikel · pratinjau langsung di editor · aksi massal · penjadwalan terbit ·
notifikasi email · log audit · i18n dashboard · pengurutan manual (drag) dokter/tenaga medis.

Kalau salah satu ternyata dibutuhkan, bahas dulu di rapat Jumat — jangan langsung dikerjakan.
