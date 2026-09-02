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

**Peran tiap rute ditulis SEKALI, di `src/lib/dashboard/akses.ts`.** Menu sidebar dan
penjaga rute di `dashboard/(app)/layout.tsx` sama-sama membacanya. Dulu keduanya terpisah,
dan itu pengaman semu: menunya disembunyikan, alamatnya tetap bisa diketik sendiri. Rute
yang belum terdaftar diperlakukan paling ketat (`superadmin`) — halaman baru yang lupa
didaftarkan gagal dengan cara yang kelihatan, bukan diam-diam terbuka.

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
| Layanan · Posyandu · Fasilitas | `/dashboard/{layanan,posyandu,fasilitas}` | superadmin | `KoleksiSederhana` juga, memakai tipe field baru: `relasi` (layanan induk), `relasiBanyak` (layanan di satu posyandu), `daftar` (syarat & jadwal berulang) |
| Struktur Organisasi | `/dashboard/struktur-organisasi` | superadmin | `KoleksiSederhana` dengan relasi `atasan` ke koleksi yang sama. Tabelnya diurutkan mengikuti bagan (atasan lalu bawahannya), bukan abjad, dan **bisa dipersempit ke satu klaster** — lihat §10 |
| Pengaduan | `/dashboard/pengaduan` | superadmin | **Bukan CRUD.** Daftar aduan yang bisa dibuka satu per satu; yang boleh diubah hanya status dan tanggapan — isi aduan dari warga tidak bisa disunting |
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
| ~~D2~~ | ~~Modul Pengaduan di dashboard~~ — **selesai** (`/dashboard/pengaduan`) | Halaman publik `/pengaduan` untuk mengirim aduan masih belum ada — digarap di branch halaman publik |
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

### Setup di Google Cloud Console

Sekali kerja, sekitar 10 menit. Butuh akun Google mana pun (tidak harus akun
Puskesmas, tapi sebaiknya akun instansi supaya tidak menempel ke pribadi orang).

**1. Buat project**
`https://console.cloud.google.com/` → pemilih project di kiri atas → **New
project** → nama mis. `puskesmas-batulicin` → **Create**. Kalau sudah punya
project, lewati.

**2. Isi OAuth consent screen** (wajib sebelum bisa membuat credential)
Menu → **APIs & Services** → **OAuth consent screen**.
- User type: **External** → Create.
  (**Internal** hanya muncul kalau instansi punya Google Workspace. Kalau ada,
  pilih itu: lebih aman, otomatis terbatas ke domain instansi, dan tidak perlu
  langkah test user di bawah.)
- App name: `Dashboard Puskesmas Batulicin` · User support email: email petugas
  · Developer contact: email yang sama → Save and continue.
- Scopes: **lewati**, tekan Save and continue. Scope `openid email profile`
  sudah termasuk yang non-sensitive dan tidak perlu didaftarkan.
- Test users: tambahkan email staf yang akan dipakai masuk → Save.

**3. Buat OAuth client ID**
**APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
- Application type: **Web application**
- Name: `Dashboard Puskesmas`
- **Authorized redirect URIs** → Add URI, daftarkan **semua** alamat yang dipakai:

  ```
  http://localhost:3000/dashboard/login/google/callback
  https://<domain-produksi>/dashboard/login/google/callback
  ```

  Harus **sama persis** — beda `http`/`https`, ada/tidaknya `www`, atau garis
  miring di ujung akan ditolak Google dengan `redirect_uri_mismatch`.
  *Authorized JavaScript origins* dikosongkan saja; alur ini tidak memakainya.
- **Create** → salin **Client ID** dan **Client secret**.

**4. Isi `.env`**

```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
APP_URL=                    # kosongkan saat dev
```

`APP_URL` **wajib diisi di produksi** (mis. `https://puskesmasbatulicin.go.id`).
Saat kosong, redirect URI disusun dari origin request — benar di localhost, tapi
bisa salah di balik proxy/kontainer. Restart dev server setelah mengubah `.env`.

**5. Daftarkan akun Google-nya di dashboard**
Masuk dengan Super Admin yang ada → `/dashboard/pengguna` → **Tambah Akun**
(atau **Ubah** akun yang sudah ada):
- Email: **alamat Gmail/Workspace-nya**, harus sama persis dengan yang dipakai masuk
- Cara masuk: **Akun Google** (tanpa kata sandi) atau **Email + kata sandi, atau
  akun Google** (boleh dua-duanya)
- Hak akses: Super Admin atau Admin → **Simpan**

**6. Coba masuk**
Buka `/dashboard/login` di jendela penyamaran → **Masuk dengan Google** → pilih
akunnya. Berhasil = langsung ke `/dashboard`. Kolom "Cara masuk" di
`/dashboard/pengguna` akan menampilkan *"Sudah tertaut ke akun Google"*.

**7. Sebelum go-live**
Consent screen masih berstatus **Testing**: hanya email di daftar test users yang
bisa masuk, dan izinnya kedaluwarsa tiap 7 hari. Kalau staf yang masuk lewat
Google hanya beberapa orang, biarkan saja di Testing dan cukup tambahkan mereka
sebagai test user — tidak perlu verifikasi Google. Menekan **Publish app** hanya
diperlukan bila daftarnya akan panjang; untuk scope `openid email profile`
publikasi tidak memicu proses review.

### Kalau gagal

| Yang terlihat | Sebabnya |
| --- | --- |
| Tombol Google tidak muncul | `GOOGLE_CLIENT_ID`/`SECRET` kosong, atau server belum di-restart |
| Google: `redirect_uri_mismatch` | URI di Credentials tidak sama persis dengan yang dikirim. Cocokkan dengan `<APP_URL>/dashboard/login/google/callback` |
| Google: `access_blocked` / app belum diverifikasi | Emailnya belum masuk daftar **test users** di consent screen |
| "Akun Google ini belum didaftarkan…" | Emailnya belum ada di `/dashboard/pengguna` — ini memang perilaku yang diinginkan |
| "Akun ini disetel untuk masuk memakai email dan kata sandi" | Ubah **Cara masuk** akun itu ke Akun Google atau keduanya |
| "sudah tertaut ke akun Google yang berbeda" | Staf berganti akun Google. Tekan **Putus tautan** di `/dashboard/pengguna` |
| Kembali ke login dengan `galat=state` | Halaman izin didiamkan >10 menit, atau cookie diblokir. Ulangi |

### Konfigurasi (ringkas)

Tiga variabel `.env`, semuanya opsional:

```bash
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
APP_URL=https://domain-produksi        # boleh kosong saat dev
```

Kalau `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` kosong, tombol Google
disembunyikan, pilihan "cara masuk" di form pengguna dikunci ke kata sandi, dan
login email tetap berjalan seperti biasa — jadi tidak ada yang rusak di
lingkungan yang belum dikonfigurasi.

**Akun pertama (`/dashboard/setup`) selalu berbasis kata sandi**, karena pada saat
itu belum ada siapa pun yang bisa mendaftarkan akun Google.

---

## 7. Keadaan memuat (loading)

Setiap folder halaman di `dashboard/(app)/` punya `loading.tsx`. Karena Shell
(sidebar + bilah atas) milik layout, yang berganti hanya area isi — menu tetap
terlihat dan terasa responsif.

**Aturannya: kerangka harus MENYERUPAI isi yang akan menggantikannya.** Kotak
seukuran tabel di tempat tabel, kartu seukuran kartu. Kerangka asal-asalan
membuat halaman "melompat" saat isinya datang, dan itu lebih mengganggu daripada
layar kosong.

Komponennya di `components/dashboard/ui/`:

| Komponen | Untuk |
| --- | --- |
| `KerangkaHalaman` | Pembungkus wajib — satu-satunya yang bicara ke pembaca layar |
| `Skeleton`, `SkeletonTeks` | Blok dan paragraf |
| `SkeletonJudul` | Seukuran `PageHeader` |
| `SkeletonTabel` | Modul Artikel, Dokter, Vaksin, Sertifikat, Pengguna |
| `SkeletonKartuAngka`, `SkeletonGrafik` | Beranda & Statistik |
| `SkeletonGaleri` | Galeri Gambar |
| `SkeletonForm` | Pengaturan & Akun Saya |

Seluruh kotak skeleton `aria-hidden`; pengumumannya diringkas jadi satu kalimat
di `KerangkaHalaman` (`role="status"`), supaya pembaca layar tidak membacakan
puluhan kotak kosong.

**`PemuatLayar` — popup besar di tengah layar.** Skeleton saja ternyata kurang:
kotak abu terbaca sebagai "memang begitu bentuk halamannya", bukan sebagai
sesuatu yang sedang berjalan, sehingga staf tidak tahu harus menunggu atau
mengklik lagi. Dua pesan yang berbeda, keduanya perlu — skeleton menerangkan
*bentuk* isi yang akan datang, `PemuatLayar` menerangkan bahwa prosesnya *sedang
berjalan* dan di mana matanya harus menunggu.

Bentuknya sengaja besar dan menutup layar (kartu putih ±380px, spinner 48px,
latar digelapkan + blur): ikon 18px berputar di baris menu — bentuk pertama yang
dicoba — terlalu mudah terlewat oleh staf yang matanya sedang tertuju ke area
isi, dan itu justru keluhan yang memicu perubahan ini.

Muncul di tiga saat, sehingga dari klik sampai halaman siap tidak ada jeda tanpa
penanda:

| Saat | Dipasang di | Kenapa perlu terpisah |
| --- | --- | --- |
| Menu diklik, kode halaman masih diambil | `PenandaPindah` di `shell/Shell.tsx`, memakai `useLinkStatus` (Next 15.3+) | `loading.tsx` baru muncul SETELAH navigasi dimulai; jeda sebelum itu terasa seperti klik tidak terbaca. `useLinkStatus` harus dipanggil dari komponen di dalam `<Link>` |
| Halaman berpindah, datanya sedang diambil | `KerangkaHalaman` → semua `loading.tsx` | Label popupnya memakai `label` milik kerangka itu, mis. "Memuat data dokter" |
| Form sedang menyimpan atau menghapus | `KoleksiSederhana`, artikel, pengaturan, jam pelayanan, pengguna, akun, pengaduan | Menyimpan memicu revalidate, jadi tabel baru berubah beberapa saat setelah tombol ditekan; tanpa penanda jeda itu terbaca "tombolnya tidak jalan" dan tombolnya ditekan berulang kali |

Muncul **tertunda 150 ms** lewat animasi CSS `.pemuat-layar` di `globals.css`,
bukan lewat `setTimeout`: perpindahan yang selesai seketika tidak sempat
memunculkannya, jadi navigasi ringan tidak berkedip. Angka ini pernah 350 ms dan
ternyata terlalu panjang — pada database lokal hampir semua halaman selesai
sebelum popupnya sempat terlihat sama sekali.

Pengumuman ke pembaca layar (`umumkan`) hanya aktif di form. Untuk perpindahan
halaman, `KerangkaHalaman` sudah mengumumkannya satu kali lewat `sr-only`.

**Penyimpanan berkas:** Galeri Gambar menyimpan ke disk lokal atau Cloudflare
R2, dipilih otomatis dari variabel `R2_*` di `.env` (lihat README bagian
"Penyimpanan berkas"). URL-nya tetap `/api/media/<berkas>` di kedua mode, jadi
gambar yang sudah tertanam di artikel tidak rusak saat berpindah penyimpanan.

**Kursor tombol:** preflight Tailwind v4 menghapus `cursor: pointer` pada
`<button>` yang dulu ada di v3, sehingga tombol memakai kursor panah dan terasa
tidak bisa diklik. Diperbaiki sekali di `globals.css` (`@layer base`), bukan
dengan menempelkan `cursor-pointer` di tiap komponen — kalau ditempel satu per
satu, tombol berikutnya pasti terlewat lagi.

---

## 8. Penjaga rute & alur masuk

Tiga lapis, dari yang paling luar:

| Lapis | Berkas | Tugas |
| --- | --- | --- |
| Middleware | `src/middleware.ts` | Belum ada cookie sesi → pantulkan ke `/dashboard/login` **sebelum** halaman dirender. Menitipkan alamat yang diminta lewat header `x-rute` |
| Penjaga layout | `dashboard/(app)/layout.tsx` → `requireAkses()` | Sesi diverifikasi ke database; peran dicocokkan dengan `akses.ts`. Peran kurang → `/dashboard/tanpa-akses` |
| Access control Payload | `src/access/index.ts` | Penegak sebenarnya, di setiap Server Action lewat `overrideAccess: false` |

Middleware **hanya memeriksa ada-tidaknya cookie**, bukan keabsahannya: ia berjalan di
edge dan tidak boleh menyentuh database. Cookie palsu atau kedaluwarsa lolos dari sana
lalu ditolak `payload.auth()` di layout. Jadi middleware adalah kenyamanan (pengalihan
seketika), bukan pengaman.

Nama cookie `payload-token` ditulis apa adanya di middleware karena `cookiePrefix` di
`payload.config.ts` dibiarkan bawaan. Kalau suatu saat diubah, ubah juga di sana —
middleware tidak boleh mengimpor konfigurasi Payload.

**Kembali ke halaman yang tadi diminta.** Pengalihan membawa `?lanjut=<alamat>`; sesudah
masuk, staf mendarat di tempat yang ia klik, bukan selalu di beranda. Berlaku untuk kedua
jalur masuk — login kata sandi (isian tersembunyi di form) dan login Google (cookie
`pkm_google_lanjut` berumur 10 menit, karena alur OAuth berpindah domain dan kembali lewat
`redirect_uri` yang tetap).

`tujuanAman()` menjaganya: tujuan hanya boleh alamat `/dashboard` di situs ini, dan
`//situs-lain` ditolak karena browser membacanya sebagai alamat mutlak. Tanpa itu halaman
login kita bisa dipakai memantulkan korban ke situs mana pun — tautan phishing yang
terlihat berasal dari domain Puskesmas. Diperiksa **dua kali**: saat dirender dan saat
dipakai, karena isian tersembunyi maupun cookie ada di sisi pengguna.

---

## 9. Paginasi

Bawaan **5 baris**, pilihan 5 / 10 / 20 / 50 / Semua, dipasang di semua daftar data.
Angka kecil disengaja: tabel pendek lebih mudah dibaca staf, dan yang butuh melihat banyak
sekaligus tinggal menaikkannya sendiri — pilihannya ada tepat di sebelah tabel.

Dua ragam, keduanya di `components/dashboard/ui/Paginasi.tsx`:

| Ragam | Dipakai | Cara kerja |
| --- | --- | --- |
| `usePaginasi(data)` | `KoleksiSederhana` (8 modul), Pengaduan, Pengguna | Datanya sudah ada seluruhnya di browser; dipotong di sisi klien, ganti halaman terasa seketika dan tidak menambah permintaan ke server |
| `<PaginasiUrl>` | Artikel, Galeri Gambar | Dipotong di server (`payload.find({ page, limit })`); keadaannya di alamat (`?page=`, `?per=`) sehingga tautan yang di-bookmark dan tombol "kembali" tetap menampilkan daftar yang sama |

Konstanta dan `bacaJumlah()` **tidak** tinggal di `Paginasi.tsx` melainkan di
`src/lib/dashboard/paginasi.ts`. Sebabnya konkret: `Paginasi.tsx` adalah `'use client'`,
dan memanggil fungsi biasa dari modul klien di dalam Server Component gagal *saat halaman
dibuka* — `pnpm build` tidak menangkapnya. Modul klien juga tidak boleh mengekspor ulang
nilai dari lib itu: manifest React Server Components jadi rusak dengan gejala serupa.

"Semua" pada daftar yang dipotong di server tetap dibatasi `BATAS_SEMUA` (500 baris).
Kalau suatu saat data di daftar sisi-klien menembus ribuan baris, itulah yang pertama
harus dipindah ke paginasi server.

---

## 10. Menjelajah bagan per klaster

Seluruh struktur sekaligus berarti 32 baris dengan lima tingkat indentasi: benar,
tapi melelahkan dibaca. **Menekan nama klaster di kolom Jabatan menyisakan klaster
itu beserta isinya saja.**

- `src/lib/dashboard/bagan.ts` — perhitungannya (urutan bagan, jalur ke puncak,
  jumlah keturunan, label berindentasi). Semuanya fungsi murni tanpa impor apa pun,
  jadi bisa dipanggil dari Server Component maupun komponen klien; itu yang membuat
  penjelajahannya berjalan seketika di browser tanpa memuat ulang halaman.
- `components/dashboard/struktur/PenjelajahBagan.tsx` — remah roti (Seluruh bagan ›
  Kepala Puskesmas › Klaster X), keterangan "menampilkan X dan N jabatan di
  bawahnya", tombol naik satu tingkat, lalu `KoleksiSederhana` untuk tabelnya.
- `KoleksiSederhana` menerima prop opsional **`bukaBaris`** yang membuat kolom
  pertama bisa ditekan. Tidak diisi = tabel biasa seperti modul lain; kolom
  pertama selalu kolom identitas di semua modul, jadi di situlah tombolnya
  ditempelkan.

Remah rotinya **selalu tampil**, juga saat di puncak. Kalau baru muncul setelah
diklik, tidak ada yang tahu bahwa tabelnya memang bisa dipersempit.

Keadaan fokusnya di state React, bukan di alamat halaman — datanya sudah ada
seluruhnya di browser. Kalau suatu saat perlu bisa di-bookmark, pindahkan ke
`?klaster=` mengikuti pola `PaginasiUrl`.

Dua keadaan data buruk sudah ditangani, keduanya bergejala "halaman menggantung"
atau "tabel kosong tanpa penjelasan": atasan yang menunjuk melingkar (dijaga
`sudahDipakai` dan batas panjang jalur) dan fokus ke baris yang baru saja dihapus
(dikembalikan ke seluruh bagan).
