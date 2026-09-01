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
| Login | `/dashboard/login` | publik | Tombol **Masuk dengan Google** (muncul hanya bila server dikonfigurasi) + email & kata sandi dengan tombol lihat sandi. Gagal login tidak membocorkan mana yang salah; akun terkunci diberi pesan beserta lama tunggu |
| Alur Google | `/dashboard/login/google`, `/dashboard/login/google/callback` | publik | Dua route handler OAuth. Lihat §6 |
| Pengaturan awal | `/dashboard/setup` | publik, **hanya saat users kosong** | Membuat Super Admin pertama |
| Beranda | `/dashboard` | semua | 4 kartu angka, histogram 7 hari, jam ramai WITA, artikel terakhir diubah, panel stok vaksin menipis (superadmin) |
| Artikel | `/dashboard/artikel` | semua (admin unit hanya miliknya) | Daftar + cari + filter kategori/status + paginasi; tabel di desktop, kartu di ponsel |
| Tulis/Ubah artikel | `/dashboard/artikel/baru`, `/[id]` | semua | Judul, pratinjau alamat halaman, ringkasan, editor WYSIWYG, sampul, kategori, tanggal. Bilah aksi menempel: Simpan · Terbitkan/Batalkan Terbit · Lihat di Situs · Hapus. Peringatan saat meninggalkan halaman dengan perubahan |
| Galeri Gambar | `/dashboard/media` | semua | Unggah (validasi 5MB & tipe di browser dan server), `alt` wajib, panel detail, salin tautan, hapus dengan cek relasi |
| Statistik | `/dashboard/statistik` | semua | 12 bulan, 7 hari, jam ramai, halaman terpopuler dengan nama yang bisa dibaca |
| Dokter · Tenaga Medis · Vaksin · Sertifikat | `/dashboard/{dokter,tenaga-medis,vaksin,sertifikat}` | superadmin | Tabel + form inline, digerakkan `KoleksiSederhana` |
| Pengaturan | `/dashboard/pengaturan` | superadmin | Jadwal jam pelayanan (+ tombol "Kembalikan ke Jadwal Resmi SK") dan informasi situs + media sosial |
| Pengguna | `/dashboard/pengguna` | superadmin | CRUD akun + ganti kata sandi + **atur cara masuk (kata sandi / Google / keduanya)** + putus tautan Google + pengaman superadmin terakhir |
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
| D12 | Batasi login Google ke domain Workspace tertentu (`hd`) bila Puskesmas punya | Sekarang penyaringan sepenuhnya lewat daftar pengguna |
| D10 | Uji unggah (>5MB, PDF, nama unicode), uji XSS nyata, aksesibilitas di perangkat asli | Sanitasi & validasi sudah dipasang tapi belum dicoba dengan tangan |
| D11 | Panduan bergambar untuk staf | Dipakai saat pelatihan sebelum go-live |

---

## 5. Sengaja tidak dibangun di rilis pertama

Riwayat versi artikel · pratinjau langsung di editor · aksi massal · penjadwalan terbit ·
notifikasi email · log audit · i18n dashboard · pengurutan manual (drag) dokter/tenaga medis.

Kalau salah satu ternyata dibutuhkan, bahas dulu di rapat Jumat — jangan langsung dikerjakan.

---

## 6. Masuk dengan Google

### Aturan izin

**Koleksi `users` adalah daftar izinnya.** Tidak ada koleksi allowlist terpisah dan
tidak ada pembuatan akun otomatis: sebuah akun Google baru bisa masuk kalau
Super Admin sudah mendaftarkan alamat emailnya di `/dashboard/pengguna`. Di luar
itu pengguna dikembalikan ke halaman login dengan pesan agar menghubungi Tata
Usaha. Konsekuensinya hak akses (`role`) dan izin masuk mustahil desinkron.

Dua field pendukung di `users`:

| Field | Guna |
| --- | --- |
| `metodeLogin` | `sandi` \| `google` \| `keduanya`. Hanya superadmin yang boleh mengubahnya (field access). Akun `google` tidak bisa masuk lewat form kata sandi, dan sebaliknya |
| `googleSub` | Penanda tetap akun Google, terisi otomatis saat login pertama. Tidak bisa ditulis lewat form mana pun; hanya alur OAuth (`overrideAccess`) dan tombol "Putus tautan" yang menyentuhnya |

Ikatan `googleSub` penting: Google bisa melepas sebuah alamat email dan
memberikannya ke orang lain. Tanpa ikatan itu, pemilik baru alamat tersebut akan
mewarisi akses. Kalau staf berganti akun Google, superadmin menekan **Putus
tautan** di `/dashboard/pengguna` supaya akun Google baru bisa ditautkan.

### Alur teknis

`dashboard/login/google/route.ts` → Google → `dashboard/login/google/callback/route.ts`.
Authorization code + PKCE (S256), `state` dan `code_verifier` disimpan di cookie
httpOnly berumur 10 menit yang path-nya dibatasi ke `/dashboard/login`. Ditulis
langsung di `src/lib/dashboard/google.ts` tanpa pustaka pihak ketiga.

Tanda tangan `id_token` tidak diverifikasi ulang, dan itu memang aman: token
diambil sendiri dari endpoint token Google lewat HTTPS memakai client secret,
bukan diterima dari browser. Klaim `iss`, `aud`, `exp`, dan `email_verified`
tetap diperiksa.

### Sesi

`src/lib/dashboard/sesi.ts` adalah satu-satunya tempat cookie sesi dibuat, dipakai
login kata sandi maupun Google. `terbitkanSesi()` mencetak sesi Payload **asli**
memakai helper resmi yang diekspor Payload — `addSessionToUser` (`payload/shared`),
`getFieldsToSign` dan `jwtSign` (`payload`) — persis urutan yang dipakai
`payload.login()`.

⚠️ Jangan menandatangani JWT sendiri. Sejak Payload 3, `auth.useSessions` aktif
secara default: setiap sesi punya baris di tabel `users_sessions` dan token yang
`sid`-nya tidak terdaftar akan ditolak `payload.auth()`.

### Konfigurasi

Tiga variabel di `.env`, semuanya opsional:

```bash
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
APP_URL=https://domain-produksi        # boleh kosong saat dev
```

Kalau `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` kosong, tombol Google
disembunyikan, pilihan "cara masuk" di form pengguna dikunci ke kata sandi, dan
login email tetap berjalan seperti biasa — jadi tidak ada yang rusak di
lingkungan yang belum dikonfigurasi.

Redirect URI yang harus didaftarkan di Google Cloud Console:
`<APP_URL>/dashboard/login/google/callback` — daftarkan alamat dev dan produksi.
`APP_URL` wajib diisi di produksi di balik proxy/kontainer; saat kosong, alamat
diambil dari origin request.

**Akun pertama (`/dashboard/setup`) selalu berbasis kata sandi**, karena pada saat
itu belum ada siapa pun yang bisa mendaftarkan akun Google.
