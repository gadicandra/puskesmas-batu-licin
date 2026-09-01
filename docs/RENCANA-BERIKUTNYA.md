# Rencana Sesi Berikutnya

Dokumen ini ditulis di akhir sesi 1 September 2026 supaya pekerjaan bisa
dilanjutkan tanpa mengulang penelusuran. Kerjakan berurutan — bagian A memblokir
yang lain.

**Cara memulai sesi berikutnya:** buka Claude Code di folder proyek, lalu minta
_"baca docs/RENCANA-BERIKUTNYA.md dan kerjakan bagian A"_.

---

## Keadaan saat ini

Branch: **`feat/lapisan-data.adi`** — 8 commit **belum ter-push**.

Yang sudah jalan dan terverifikasi:

- `docker compose up` menyalakan Postgres + aplikasi, migrasi otomatis, siap ±10 detik
- Lapisan kontrak `src/lib/konten/` — 18 fungsi baca ber-cache (lihat `docs/KONTRAK-DATA.md`)
- Seed idempoten: 93 layanan, 68 nakes, 6 dokter, 68 sarana, 32 jabatan, 24 angka pelayanan, profil, jam SK
- Login Google + login kata sandi
- Kerangka pemuatan (`loading.tsx`) di 13 halaman dashboard, kursor tombol diperbaiki
- Penyimpanan berkas: disk lokal atau Cloudflare R2, dipilih otomatis dari `.env`

Berkas yang belum di-commit (sengaja, menunggu keputusan): 4 berkas sumber di
`data/` berukuran ±4,7 MB (`Sertifikat/`, `StrukturOrganisasiMaster.png`,
`DataAngkaYangTerlayani .jpeg`, `SK JENIS PELAYANAN PKM BTL.pdf`).

---

## A. Verifikasi R2 dengan kredensial sungguhan

### A0. WAJIB LEBIH DULU — betulkan `R2_ENDPOINT` di `.env`

Nilai yang terisi sekarang **memuat nama bucket di belakangnya**, dan itu
membuat `pnpm build` gagal:

```
Error: R2_ENDPOINT tidak boleh memuat nama bucket.
Buang "/puskesmas-batu-licin" dari akhirnya.
```

Buang bagian `/puskesmas-batu-licin` dari ujung `R2_ENDPOINT` sehingga berhenti
di `.r2.cloudflarestorage.com`. Nama bucket tetap diisi terpisah di `R2_BUCKET`.

Ini kesalahan yang wajar: halaman bucket di Cloudflare memang menampilkan
alamat "S3 API" yang sudah memuat nama bucket. Kalau dipakai apa adanya, AWS SDK
menambahkan nama bucket sekali lagi dan semua unggahan gagal — karena itu
ditolak lebih awal, saat aplikasi menyala, bukan diam-diam saat staf mengunggah.

Sesudah dibetulkan, `rm -rf .next && pnpm build` harus lolos.

### A1. Uji unggah

1. Nyalakan DB: `docker compose up -d db`
2. Jalankan uji unggah:

   ```bash
   cat > src/seed/uji-unggah.ts <<'EOF'
   import { getPayload } from 'payload'
   import config from '@payload-config'
   import { ringkasanPenyimpanan } from '../lib/penyimpanan'
   import path from 'path'
   import fs from 'fs'

   const payload = await getPayload({ config })
   console.log('[uji] penyimpanan:', ringkasanPenyimpanan())

   const doc = await payload.create({
       collection: 'media',
       data: { alt: 'Uji unggah R2' },
       filePath: path.resolve('public/logo_puskesmas.webp'),
       overrideAccess: true,
   })
   console.log('[uji] url =', doc.url, '| filename =', doc.filename)
   console.log('[uji] ada di disk lokal?', fs.existsSync(path.resolve('media', doc.filename as string)))
   process.exit(0)
   EOF
   pnpm payload run src/seed/uji-unggah.ts
   rm src/seed/uji-unggah.ts
   ```

3. **Yang diharapkan:** mode terbaca `Cloudflare R2 (bucket: ...)`, tidak ada
   galat, `ada di disk lokal? false`, dan berkasnya muncul di bucket R2 di
   dashboard Cloudflare.
4. Buka `/dashboard/media`, unggah satu gambar lewat antarmuka, pastikan
   pratinjaunya tampil (membuktikan `/api/media/...` melayani berkas dari R2).
5. Kalau gagal: `endpointR2()` di `src/lib/penyimpanan.ts` sudah menolak endpoint
   yang memuat nama bucket dan menyebutkan bagian yang harus dibuang. Galat lain
   yang mungkin: kredensial salah ketik, atau token dibuat dengan izin
   *Admin Read & Write* alih-alih *Object Read & Write*.

**Setelah berhasil**, pindahkan 9 foto piagam di `data/Sertifikat/` ke Galeri
Gambar lewat `/dashboard/media`, lalu lanjut ke bagian C.

---

## B. Modul dashboard untuk 5 koleksi baru — paling memblokir

Koleksi, data, dan fungsi tarik-datanya sudah ada, **tapi staf belum bisa
menyuntingnya** karena belum ada formulir di dashboard. Ini yang paling mendesak.

Template: salin `src/app/dashboard/(app)/vaksin/` (pola `KoleksiSederhana`).
Langkahnya ada di `CLAUDE.md` bagian "Adding a simple collection module".

| # | Modul | Koleksi | Catatan |
| --- | --- | --- | --- |
| B1 | **Layanan** | `services` | Perlu penanganan `induk` (relasi ke dirinya sendiri) — `KoleksiSederhana` belum mendukung relasi, kemungkinan perlu form khusus |
| B2 | **Posyandu** | `posyandu` | Relasi banyak-ke-banyak ke `services` + array jadwal |
| B3 | **Fasilitas** | `facilities` | Paling sederhana, paling cocok dikerjakan lebih dulu sebagai pemanasan |
| B4 | **Struktur Organisasi** | `org-chart` | Relasi `atasan` ke dirinya sendiri |
| B5 | **Pengaduan** | `complaints` | **Bukan CRUD** — alurnya baca lalu tanggapi (ubah status + isi tanggapan). Butuh form tersendiri |

Setelah tiap modul jadi:

- Tambahkan `tagRevalidate: [TAG.x]` di `actions.ts`-nya, jika tidak halaman
  publik tidak akan ikut berubah saat admin menyimpan
- Menu **Pengaduan** sudah terlanjur ada di `components/dashboard/shell/menu.ts:36`
  dan sekarang menghasilkan 404 — aktif otomatis begitu B5 selesai
- Tambahkan menu untuk B1–B4 di berkas yang sama
- Buat `loading.tsx` (salin dari `dokter/loading.tsx`)

---

## C. Sertifikat & penghargaan

Teks 9 piagam sudah disalin ke `src/seed/data/sertifikat.ts` tapi **belum
di-seed**: field `berkas` wajib berisi unggahan.

1. Unggah 9 foto dari `data/Sertifikat/` lewat `/dashboard/media` (butuh A selesai)
2. Tulis bagian seed yang mencocokkan `berkasSumber` di
   `src/seed/data/sertifikat.ts` dengan `filename` di koleksi `media`, lalu
   membuat dokumen `certificates`
3. Alternatif yang lebih rapi: buat skrip sekali-jalan yang mengunggah sekaligus
   menautkan, supaya tidak perlu mencocokkan nama berkas secara manual

---

## D. Data yang masih perlu dikonfirmasi ke Puskesmas

Semuanya sudah masuk database apa adanya, dengan penanda di komentar kode.
Perbaiki lewat `/dashboard` setelah dipastikan.

| # | Temuan | Di mana |
| --- | --- | --- |
| D1 | **Alamat berbeda antara dua dokumen resmi.** Kop SK: "Jln. Pemerintahan No.19 RT.05 RW.01, Kode Pos 72200". `data/puskesmas.md`: "No.071 Rt.005 RW.001". Yang ter-seed versi puskesmas.md | `site-settings` |
| D2 | **Penomoran misi meloncat** (1, 2, 4, 7 di dokumen asli). 4 butir dimasukkan berurutan — perlu dipastikan tidak ada yang terlewat | `profile.misi` |
| D3 | **Nama ganda:** "Anggi Ernia Rahmanita, AM.Keb" tercatat 2× dengan jabatan berbeda. Diambil jenjang lebih tinggi (Bidan Ahli Madya) | `medical-staff` |
| D4 | **3 nama di bagan tidak ada di daftar nakes:** drg. Lukman Noor Hakim (Gigi & Mulut), Debora Silitonga S.Ak (Keuangan), Siti Nur Halizah A.Md.Kes (Rehab Medik). Daftar nakes justru memuat drg. Selvi Lesmawati | `org-chart` |
| D5 | **Data Posyandu belum ada** di berkas sumber mana pun — koleksi `posyandu` masih kosong | — |

---

## E. Pembersihan kode mati — menunggu pilihan Anda

Daftar lengkap sudah dibuat di sesi sebelumnya. Rekomendasi: **A, B, C, D, F1, F2**
aman semua; E (aset publik) sebaiknya ditunda sampai dipastikan tidak dipakai
desain yang sedang digarap.

| Grup | Isi |
| --- | --- |
| A | 3 berkas mati: `module/landingPage/statistik.tsx` (181 baris, digantikan `pengunjung.tsx`), `components/profil/MottoCard.tsx`, `components/common/index.ts` |
| B | 2 dependensi tak terpakai: `framer-motion` (0 import — semua pakai `motion/react`), `dotenv` (0 rujukan) |
| C | 2 export mati: `formatTanggalWaktu()` di `lib/dashboard/format.ts`, `type UnitValue` di `lib/units.ts` |
| D | 14 impor tak terpakai (peringatan lint) |
| E | 3 aset publik tak dirujuk: `backgroundFooter.webp` (164 KB), `layananPuskesmas.webp`, `posyandu.webp` |
| F1 | `package-lock.json` (456 KB) berdampingan dengan `pnpm-lock.yaml` — bisa membuat CI memilih manajer yang salah |
| F2 | ~~CLAUDE.md basi soal `tailwind.config.ts`~~ — sudah diperbaiki |

---

## F. Halaman publik — bagian teman Anda

Sudah ada kontraknya (`docs/KONTRAK-DATA.md`), tinggal dibangun. Yang perlu Anda
sampaikan kepadanya:

- Baca `docs/KONTRAK-DATA.md` **sebelum** menulis halaman pertama
- Jangan `getPayload` langsung, jangan `force-dynamic`, jangan fetch dari client
- Contoh acuan yang sudah jadi: `(frontend)/layout.tsx` → `Footer` (server
  component mengambil data, komponen klien menerima lewat props)

Halaman yang belum ada dan sudah ditautkan dari `Hero.tsx` (sekarang 404):
`/layanan`, `/posyandu`, `/jadwal`, `/kontak`. Empat tautan mati itu termasuk
tombol CTA utama di beranda.

Halaman publik yang masih hardcode dan perlu disambungkan ke kontrak:
`/profil-puskesmas`, `/struktur-organisasi`, `/informasi-layanan-mutu`,
`/lokasi-puskesmas`, dan beranda.

---

## G. Push & pull request

8 commit masih di lokal. Setelah A–C selesai (atau kapan pun Anda mau):

```bash
git push -u origin feat/lapisan-data.adi
```

**Catatan:** `gh` di komputer ini terpasang lewat **snap** dan tidak bisa
mengakses `/media`, sehingga `gh pr create` gagal dengan pesan menyesatkan
"not a git repository". Dua jalan keluar:

- Perbaiki sekali: `sudo snap connect gh:removable-media`
- Atau buat PR lewat browser: `https://github.com/gadicandra/puskesmas-batu-licin/compare/main...feat/lapisan-data.adi`

Token GitHub MCP juga tidak punya izin membuat PR (403).

---

## Jebakan yang sudah ditemukan — jangan diulang

Semuanya **gagal tanpa pesan galat**, jadi mudah terulang:

1. **Auto-push skema di container menggantung.** Tanpa TTY, prompt "kolom ini
   dibuat atau diganti nama?" tidak bisa dijawab dan push berhenti separuh jalan,
   meninggalkan skema basi. Container memakai migrasi (`PAYLOAD_DB_PUSH=false`).
2. **`payload run` keluar sebelum promise selesai.** Skrip seed HARUS memakai
   top-level await, bukan `seed().then()`. Gejalanya: exit code 0, database kosong.
3. **`findGlobal` mengembalikan `defaultValue`** walau barisnya belum ada, dan
   `db.findGlobal` mengembalikan `{}` yang tetap truthy. Penanda "sudah tersimpan"
   yang benar adalah `updatedAt`.
4. **Folder host vs container berebut.** Sudah dipisahkan lewat `NEXT_DIST_DIR`
   dan `MEDIA_DIR`; jangan mengisi keduanya di `.env`.
5. **Dua `pnpm build` beruntun saling merusak** karena berebut `.next`. Selalu
   `rm -rf .next` di antaranya, atau jalankan satu per satu.
6. **`docker compose down -v` menghapus volume `puskesmas_media`** beserta berkas
   unggahan lokal. Setelah R2 aktif ini tidak lagi berbahaya.

---

## Perintah yang sering dipakai

```bash
docker compose up                       # db + app
docker compose --profile seed up seed   # isi data awal (aman diulang)
pnpm payload migrate:create <nama>      # setelah mengubah koleksi
pnpm payload generate:types             # setelah mengubah koleksi
rm -rf .next && pnpm build              # verifikasi
```
