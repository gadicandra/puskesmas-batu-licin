# Rencana Sesi Berikutnya

Dokumen ini ditulis di akhir sesi 1 September 2026 dan diperbarui 2 September
2026, supaya pekerjaan bisa dilanjutkan tanpa mengulang penelusuran.

Bagian **A, B, dan C sudah selesai** — riwayatnya ditinggalkan di bawah karena
memuat hasil verifikasi yang tidak perlu diulang. Yang tersisa: **D** (data yang
perlu dikonfirmasi ke Puskesmas), **E** (pembersihan kode mati, menunggu
keputusan Anda), **F** (halaman publik, bagian teman Anda), **G** (push & PR).

**Cara memulai sesi berikutnya:** buka Claude Code di folder proyek, lalu minta
_"baca docs/RENCANA-BERIKUTNYA.md dan kerjakan bagian E"_.

---

## Keadaan saat ini

Diperbarui **2 September 2026**. Branch: **`feat/lapisan-data.adi`** — commit lama
belum ter-push, ditambah pekerjaan sesi ini yang belum di-commit.

Yang sudah jalan dan terverifikasi:

- `docker compose up` menyalakan Postgres + aplikasi, migrasi otomatis, siap ±10 detik
- Lapisan kontrak `src/lib/konten/` — 18 fungsi baca ber-cache (lihat `docs/KONTRAK-DATA.md`)
- Seed idempoten: 93 layanan, 68 nakes, 6 dokter, 68 sarana, 32 jabatan, 24 angka
  pelayanan, **9 sertifikat beserta fotonya**, profil, jam SK
- Login Google + login kata sandi
- Kerangka pemuatan (`loading.tsx`) di 18 halaman dashboard + **`PemuatLayar`**,
  kotak berputar di tengah layar saat pindah halaman dan saat menyimpan
  (`docs/DASHBOARD.md` §7)
- **Penyimpanan Cloudflare R2 terverifikasi dengan kredensial sungguhan** —
  unggahan masuk ke bucket, tidak tersentuh disk lokal
- **Modul dashboard lengkap** untuk Layanan, Posyandu, Fasilitas, Struktur
  Organisasi, dan Pengaduan

Berkas yang belum di-commit (sengaja, menunggu keputusan): 4 berkas sumber di
`data/` berukuran ±4,7 MB (`Sertifikat/`, `StrukturOrganisasiMaster.png`,
`DataAngkaYangTerlayani .jpeg`, `SK JENIS PELAYANAN PKM BTL.pdf`).

---

## A–C — sudah selesai (2 September 2026)

Rincian langkah-langkahnya sengaja tidak disimpan di sini: yang perlu dibaca
lagi sudah pindah ke tempat yang tepat, dan menyimpan dua salinan hanya membuat
salah satunya basi tanpa ketahuan.

| Bagian | Hasil | Rujukan |
| --- | --- | --- |
| A. Verifikasi R2 | `R2_ENDPOINT` dibetulkan, `pnpm build` lolos, uji unggah masuk bucket dan tidak menyentuh disk lokal. Berkas ujinya sudah dihapus lagi. **Belum diuji lewat antarmuka `/dashboard/media`.** | README bagian "Penyimpanan berkas", `src/lib/penyimpanan.ts` |
| B. 5 modul dashboard | Layanan, Posyandu, Fasilitas, Struktur Organisasi, Pengaduan — semuanya bisa disunting staf dan sudah ada di menu | `docs/DASHBOARD.md` §3 dan §10 |
| C. Sertifikat | Bagian 11 seed mengunggah 9 foto piagam sekaligus menautkannya; idempoten dan melewat dengan tenang bila folder sumbernya tidak ada | `src/seed/index.ts` |

**Sisa dari B yang belum dikerjakan:** aksi simpan/hapus tiap modul sudah diuji
QA (lihat `.gstack/qa-reports/`), tapi peran *admin unit* belum dicoba dengan
tangan pada alur tulis artikel.

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
| ~~F1~~ | ~~`package-lock.json` berdampingan dengan `pnpm-lock.yaml`~~ — **sudah dihapus** (2 September 2026) |
| F2 | ~~CLAUDE.md basi soal `tailwind.config.ts`~~ — sudah diperbaiki |

---

## F. Halaman publik — bagian teman Anda

Sudah ada kontraknya (`docs/KONTRAK-DATA.md`), tinggal dibangun. Yang perlu Anda
sampaikan kepadanya:

- Baca `docs/KONTRAK-DATA.md` **sebelum** menulis halaman pertama
- Kontrak REST lengkap ada di `public/openapi.yaml`, bisa dibuka sebagai Swagger
  UI di `http://localhost:3000/api-docs.html` selagi `pnpm dev` jalan. Itu untuk
  aplikasi lain dan untuk formulir yang benar-benar mengirim dari browser —
  **bukan** untuk halaman biasa, yang tetap membaca lewat `src/lib/konten/`
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
