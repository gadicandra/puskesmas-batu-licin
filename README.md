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

## Variabel lingkungan

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | ya | Koneksi Postgres. Di dalam Docker memakai host `db`, bukan `localhost` |
| `PAYLOAD_SECRET` | ya | Kunci penandatanganan sesi. **Ganti dengan nilai acak di produksi** |
| `APP_URL` | produksi | Alamat publik, dipakai menyusun redirect URI Google |
| `GOOGLE_CLIENT_ID` | tidak | Login Google. Kosong = tombolnya disembunyikan |
| `GOOGLE_CLIENT_SECRET` | tidak | Pasangan `GOOGLE_CLIENT_ID` |
| `PAYLOAD_DB_PUSH` | tidak | `false` untuk memaksa memakai migrasi |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | tidak | Akun pertama yang dibuat seed |
| `APP_PORT` / `DB_PORT` | tidak | Ganti port bila bentrok |

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
