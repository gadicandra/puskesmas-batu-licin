# Website UPTD Puskesmas Batulicin

Situs publik + dashboard pengelolaan isi. Next.js 15 (App Router) + React 19,
dengan Payload CMS 3 di atas Postgres sebagai backend (skema, auth, access
control, upload, Local API). Admin UI bawaan Payload sudah diganti dashboard
buatan sendiri di `/dashboard`.

---

## Mulai cepat (Docker — disarankan)

Tidak perlu memasang Node, pnpm, atau Postgres.

```bash
git clone <url-repo>
cd puskesmas-batu-licin
docker compose up         # .env opsional — lihat catatan di bawah
```

Tunggu sampai muncul `✓ Ready`, lalu buka **http://localhost:3000**.

Database kosong? Isi data awalnya (jam pelayanan SK, identitas Puskesmas,
katalog 22 layanan) dan buat akun admin pertama:

```bash
docker compose --profile seed up seed
```

Akun awal: `admin@puskesmas.local` / `puskesmas123`
(ubah lewat `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` di `.env`).

Masuk lewat **http://localhost:3000/dashboard**. Kalau belum ada akun sama
sekali, `/dashboard/setup` akan memandu membuat Super Admin pertama.

Port 3000 sudah dipakai? `APP_PORT=3100 docker compose up`.

Semua variabel lingkungan sudah punya default yang aman untuk pengembangan, jadi
`docker compose up` jalan tanpa `.env`. Ingin mengubah salah satunya (mis.
mengaktifkan login Google)? `cp docs/env-contoh.txt .env` lalu sunting.

### Perintah Docker sehari-hari

```bash
docker compose up                       # nyalakan db + app
docker compose down                     # matikan (data tetap tersimpan)
docker compose logs -f app              # lihat log aplikasi
docker compose --profile seed up seed   # isi data awal (aman diulang)
docker compose down -v                  # HAPUS database beserta isinya
```

---

## Mulai cepat (tanpa Docker)

Butuh Node 22+, pnpm 10.24, dan Postgres 16.

```bash
docker compose up -d db     # atau pakai Postgres yang sudah ada
cp docs/env-contoh.txt .env # sesuaikan DATABASE_URL
pnpm install
pnpm payload migrate
pnpm seed
pnpm dev
```

---

## Perintah

```bash
pnpm dev                     # server pengembangan
pnpm build                   # build produksi
pnpm start                   # jalankan hasil build
pnpm lint                    # ESLint
pnpm seed                    # isi data awal (idempoten)
pnpm payload migrate         # terapkan migrasi database
pnpm payload migrate:create  # buat migrasi setelah mengubah koleksi
pnpm payload generate:types  # regenerasi src/payload-types.ts
```

**Setelah mengubah berkas di `src/collections/` atau `src/globals/`**, jalankan
`pnpm payload migrate:create <nama>` lalu `pnpm payload generate:types`.
`src/payload-types.ts` dan `src/migrations/` ikut ter-commit; jangan disunting
manual.

---

## Skema database: migrasi vs auto-push

Payload bisa mencocokkan tabel dengan definisi koleksi secara otomatis
(`push`). Enak untuk iterasi, tapi saat perubahannya ambigu ia **bertanya lewat
prompt interaktif**. Tanpa TTY — di dalam container, di CI, di produksi — prompt
itu menggantung dan push berhenti separuh jalan tanpa pesan galat, meninggalkan
skema yang basi diam-diam.

Karena itu:

| Lingkungan | Perilaku |
| --- | --- |
| `pnpm dev` langsung di komputer | `push` aktif (ada TTY untuk menjawab) |
| Docker & produksi | `push` mati, memakai `pnpm payload migrate` |

Dikendalikan lewat `PAYLOAD_DB_PUSH` di `.env`.

---

## Penyimpanan berkas (gambar & PDF)

Berkas yang diunggah staf lewat Galeri Gambar bisa disimpan di dua tempat.
Pilihannya otomatis dari isi `.env` — tidak ada saklar di kode.

| Kondisi | Tempat simpan |
| --- | --- |
| Variabel `R2_*` kosong | Disk lokal `<project>/media` |
| Keempat `R2_*` terisi | Cloudflare R2 |

URL publiknya **sama di kedua mode** (`/api/media/<berkas>`), jadi berpindah
penyimpanan tidak merusak tautan gambar yang sudah tersimpan di artikel.

### Kapan wajib memakai R2

**Deploy di VPS / server Dinas Kesehatan → disk lokal sudah cukup dan gratis.**
`docker-compose.yml` sudah memasang volume `puskesmas_media`, jadi berkas
selamat saat container dibuat ulang. Yang perlu ditambahkan hanya backup rutin.

**Deploy di Vercel atau sejenisnya → R2 wajib.** Disk di sana bersifat sementara:
berkas yang diunggah staf hilang pada deploy berikutnya, **tanpa pesan galat**.
Gejalanya baru terlihat berminggu-minggu kemudian saat gambar artikel lama
mendadak kosong.

### Kenapa R2, bukan S3

Gratis 10 GB, dan **biaya keluar (egress) nol**. Situs publik menyajikan gambar
yang sama berulang kali ke ribuan pengunjung; penyedia lain menagih per GB
keluar, dan itu komponen biaya yang paling mudah membengkak tanpa disadari.
Kebutuhan situs ini realistis di bawah 1 GB, jadi 10 GB tidak akan tersentuh
batasnya. R2 juga S3-compatible sehingga memakai adapter resmi Payload.

### Cara menyiapkan (± 10 menit)

1. Buat akun di [dash.cloudflare.com](https://dash.cloudflare.com) — tier gratis
   R2 tidak meminta kartu kredit.
2. Menu **R2 Object Storage** → **Create bucket**. Nama bebas, mis.
   `puskesmas-batulicin`. Lokasi: **Asia-Pacific (APAC)**.
3. Di halaman R2, catat **Account ID** (ada di kanan). Endpoint-nya berbentuk:
   `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
4. **Manage R2 API Tokens** → **Create API token**:
   - Permission: **Object Read & Write**
   - Specify bucket: pilih bucket yang tadi dibuat — jangan beri akses ke
     seluruh akun
   - Salin **Access Key ID** dan **Secret Access Key**. Secret hanya
     ditampilkan sekali.
5. Isi `.env` — bentuknya seperti ini (nilai di bawah hanya contoh):

   ```bash
   R2_BUCKET=puskesmas-batulicin
   R2_ENDPOINT=https://8f3c1d0e5a7b492c1a6d4e2f9b0c3a15.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d
   R2_SECRET_ACCESS_KEY=9f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c5b4a39281706f5e4d3c2b1a0
   ```

   | Variabel | Bentuk | Dari mana |
   | --- | --- | --- |
   | `R2_BUCKET` | Nama bucket apa adanya | Yang Anda ketik di langkah 2 |
   | `R2_ENDPOINT` | `https://` + Account ID (32 karakter) + `.r2.cloudflarestorage.com` | Account ID di kanan halaman R2 |
   | `R2_ACCESS_KEY_ID` | 32 huruf/angka | Muncul saat token dibuat |
   | `R2_SECRET_ACCESS_KEY` | 64 huruf/angka | Muncul **sekali** saat token dibuat |

   ⚠️ **`R2_ENDPOINT` tidak boleh memuat nama bucket.** Halaman bucket
   Cloudflare menampilkan alamat "S3 API" berbentuk
   `https://<ACCOUNT_ID>.r2.cloudflarestorage.com/puskesmas-batulicin` — kalau
   itu yang disalin, AWS SDK menambahkan nama bucket sekali lagi dan semua
   unggahan gagal. Aplikasi menolaknya saat menyala dan menyebutkan bagian mana
   yang harus dibuang, jadi kesalahan ini tidak akan lolos diam-diam.

6. Jalankan ulang aplikasi, lalu unggah satu gambar lewat `/dashboard/media`.
   Berkasnya harus muncul di bucket R2 dan **tidak** muncul di folder `media/`.

**Bucket tidak perlu dibuat publik.** Berkas dilayani lewat route Payload
`/api/media/...`, jadi kredensial R2 tidak pernah sampai ke browser.

### Memindahkan berkas lama ke R2

Berkas yang terlanjur ada di `media/` tidak ikut pindah sendiri. Salin sekali
dengan `rclone` atau AWS CLI sebelum mengaktifkan R2, atau unggah ulang lewat
dashboard bila jumlahnya sedikit.

---

## Variabel lingkungan

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | ya | Koneksi Postgres. Di dalam Docker memakai host `db`, bukan `localhost` |
| `PAYLOAD_SECRET` | ya | Kunci penandatanganan sesi. **Ganti dengan nilai acak di produksi** |
| `APP_URL` | produksi | Alamat publik, dipakai menyusun redirect URI Google |
| `GOOGLE_CLIENT_ID` | tidak | Login Google. Kosong = tombolnya disembunyikan |
| `GOOGLE_CLIENT_SECRET` | tidak | Pasangan `GOOGLE_CLIENT_ID` |
| `PAYLOAD_DB_PUSH` | tidak | `false` untuk memaksa memakai migrasi |
| `R2_BUCKET` / `R2_ENDPOINT` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | produksi serverless | Cloudflare R2. Kosong = disk lokal. Keempatnya harus terisi |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | tidak | Akun pertama yang dibuat seed |
| `APP_PORT` / `DB_PORT` | tidak | Ganti port bila bentrok |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | tidak | Hanya dibaca `docker-compose.yml`. Kalau diubah, `DATABASE_URL` harus ikut disesuaikan |

`MEDIA_DIR` dan `NEXT_DIST_DIR` diatur sendiri oleh `docker-compose.yml` supaya
folder milik container tidak bertabrakan dengan milik komputer — jangan diisi di
`.env`.

---

## Dokumentasi

| Berkas | Isi |
| --- | --- |
| **`docs/KONTRAK-DATA.md`** | **Cara mengambil data untuk halaman publik — baca ini sebelum membuat halaman** |
| `docs/DASHBOARD.md` | Acuan dashboard: aturan binding, prinsip UI, daftar halaman, login Google |
| `docs/PROJECT_PLAN.md` | Rencana tim, jadwal mingguan, daftar utang teknis |
| `PRODUCT.md` | Brief produk & desain |
| `CLAUDE.md` | Panduan arsitektur untuk asisten AI |

Seluruh teks antarmuka, label field, dan komentar kode ditulis dalam bahasa
Indonesia. Mohon dipertahankan.
