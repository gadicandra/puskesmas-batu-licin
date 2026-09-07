# Kontrak Data — cara mengambil data untuk halaman publik

Dokumen ini untuk siapa pun yang membangun halaman di `src/app/(frontend)/`.
Baca sekali sebelum menulis halaman pertama; setelah itu cukup lihat tabel di §2.

---

## 1. Aturannya cuma tiga

**1. Ambil data lewat `src/lib/konten/`, jangan lewat Payload langsung.**

```tsx
// ✅ begini
import { ambilDokter } from '@/lib/konten/dokter'
const dokter = await ambilDokter()

// ❌ jangan begini
import { getPayload } from 'payload'
const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'doctors' })
```

**2. Jangan tulis `export const dynamic = "force-dynamic"`.**
Itu memaksa query database di setiap kunjungan. Fungsi di `konten/` sudah
di-cache; halaman tetap ikut berubah begitu admin menyimpan.

**3. Jangan ambil data dari komponen klien (`useEffect` + `fetch`).**
Halaman Puskesmas harus terindeks Google. Ambil di server component, lalu oper
ke komponen klien lewat props — contohnya `(frontend)/layout.tsx` yang mengambil
jam pelayanan dan mengopernya ke `Footer` (komponen klien).

### Kenapa begitu

Data situs ini jarang berubah tapi sering dibaca. Pola yang dipakai:

| | |
| --- | --- |
| **Baca** | `unstable_cache` + tag. Kunjungan ke-2 dan seterusnya tidak menyentuh Postgres |
| **Tulis** | Server Action di `/dashboard` → Local API Payload |
| **Segarkan** | Server Action memanggil `revalidateTag('dokter')` sesudah menyimpan |

Jadi query jalan **saat data berubah**, bukan saat halaman dibuka. Sudah diukur:
10 kunjungan berturut-turut ke `/artikel` menghasilkan **0** query tambahan, dan
mengubah jam pelayanan di dashboard membuat footer ikut berubah tanpa restart.

---

## 2. Daftar fungsi

Semua ada di `src/lib/konten/`. Semuanya `async` dan sudah menyaring data yang
tidak aktif serta mengurutkannya.

| Fungsi | Berkas | Mengembalikan |
| --- | --- | --- |
| `ambilJamPelayanan()` | `jam-pelayanan.ts` | `JamPelayanan` — jadwal + catatan |
| `ambilPengaturanSitus()` | `pengaturan-situs.ts` | `PengaturanSitus` — nama, alamat, telepon, nomor darurat, email, sosmed |
| `ambilProfil()` | `profil.ts` | `ProfilPuskesmas` — visi, misi, motto, maklumat, budaya kerja, `kelembagaan` (kode, kepala, wilayah kerja) |
| `ambilDokter()` | `dokter.ts` | `DokterPublik[]` — jadwal praktik sudah terurut Senin→Minggu; `jadwalMingguan` berisi 7 baris lengkap (hari kosong ditandai `libur`), `layanan` berisi id layanan tempatnya bertugas |
| `ambilNakes()` | `nakes.ts` | `NakesPublik[]` — 68 tenaga kesehatan, `jabatan` = jabatan fungsional lengkap |
| `ambilLayanan()` | `layanan.ts` | `LayananPublik[]` — layanan **utama** saja (tanpa induk), untuk halaman daftar; `gambar` berisi sampulnya bila ada |
| `ambilLayananDalamGedung()` | `layanan.ts` | `LayananPublik[]` |
| `ambilLayananLuarGedung()` | `layanan.ts` | `LayananPublik[]` |
| `ambilLayananDetail(slug)` | `layanan.ts` | `LayananLengkap \| null` — satu layanan + sub-layanan bertingkat + `dokter` (dokter layanan itu **dan** seluruh sub-layanannya) |
| `ambilSlugLayanan()` | `layanan.ts` | `string[]` — untuk `generateStaticParams()` |
| `ambilAngkaPelayanan(periode?)` | `angka-pelayanan.ts` | `AngkaPelayanan \| null` — 16.688 kunjungan 2025, 4 pengelompokan + persentase |
| `ambilPosyandu()` | `posyandu.ts` | `PosyanduPublik[]` — termasuk daftar layanannya |
| `ambilFasilitas()` | `fasilitas.ts` | `FasilitasPublik[]` — 68 sarana & ruangan |
| `ambilSertifikat()` | `sertifikat.ts` | `SertifikatPublik[]` — akreditasi + penghargaan |
| `ambilAkreditasi()` | `sertifikat.ts` | `SertifikatPublik[]` — akreditasi saja |
| `ambilPenghargaan()` | `sertifikat.ts` | `SertifikatPublik[]` — penghargaan saja |
| `ambilStrukturOrganisasi()` | `struktur-organisasi.ts` | `SimpulOrganisasi[]` — sudah berbentuk pohon |
| `ambilDaftarArtikel(halaman?)` | `artikel.ts` | `HalamanArtikel` — dengan paginasi |
| `ambilArtikel(slug)` | `artikel.ts` | `ArtikelLengkap \| null` |

Tipenya diekspor dari berkas yang sama — `import type { DokterPublik } from '@/lib/konten/dokter'`.

---

## 3. Contoh salin-tempel

### Daftar sederhana

```tsx
import { ambilLayananDalamGedung } from '@/lib/konten/layanan'

export const metadata = { title: 'Layanan | Puskesmas Batulicin' }

export default async function HalamanLayanan() {
    const layanan = await ambilLayananDalamGedung()

    if (layanan.length === 0) {
        return <p>Daftar layanan belum tersedia.</p>
    }

    return (
        <ul>
            {layanan.map((l) => (
                <li key={l.id}>
                    <h2>{l.nama}</h2>
                    {l.deskripsi && <p>{l.deskripsi}</p>}
                    {l.persyaratan.length > 0 && (
                        <ul>
                            {l.persyaratan.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    )
}
```

### Gambar yang mungkin belum ada

```tsx
import Image from 'next/image'
import { ambilNakes } from '@/lib/konten/nakes'

export default async function HalamanNakes() {
    const nakes = await ambilNakes()

    return nakes.map((n) => (
        <div key={n.id}>
            {n.foto ? (
                <Image src={n.foto.src} alt={n.foto.alt} width={200} height={200} />
            ) : (
                // Data nakes sudah masuk tapi fotonya menyusul. Jangan render
                // <img> dengan src kosong — pilih pengganti yang disengaja.
                <div className="avatar-inisial">{n.nama.charAt(0)}</div>
            )}
            <h3>{n.nama}</h3>
            {/* `jabatan` = jabatan fungsional lengkap ("Perawat Ahli Madya").
                Pakai `kategori` / `kodeKategori` untuk mengelompokkan. */}
            <p>{n.jabatan}</p>
        </div>
    ))
}
```

### Ukuran gambar: `src`, `srcKartu`, `srcMini`

`GambarPublik` membawa tiga alamat, bukan satu:

| Bidang | Isi | Dipakai untuk |
| --- | --- | --- |
| `src` | berkas asli, bisa 2500px | hero, gambar selebar layar |
| `srcKartu` | potongan **potret** 768×1024 | kartu berbentuk potret |
| `srcMini` | potongan **lanskap** 400×300 | petak kecil dan mendatar |

Kedua turunan itu dibuat Payload saat berkasnya diunggah (`imageSizes` di
koleksi `media`). Keduanya bisa `null` — untuk berkas lama, atau gambar yang
memang lebih kecil dari ukuran turunannya — jadi **selalu sediakan cadangan**:

```tsx
<img src={gambar.srcKartu ?? gambar.src} alt={gambar.alt} />
```

Ini bukan penghematan yang bisa ditunda. Halaman `/layanan` sempat mengunduh
**3,4 MB** gambar karena ke-19 kartunya memakai `src`, padahal tiap kartu hanya
dirender selebar ~250px. Memakai berkas asli di petak kecil tidak membuatnya
lebih tajam, hanya lebih lambat.

### Berkas yang bisa gambar atau PDF

```tsx
import { ambilAkreditasi } from '@/lib/konten/sertifikat'

const daftar = await ambilAkreditasi()

daftar.map((s) => (
    <div key={s.id}>
        <h3>{s.judul}</h3>
        {s.berkas?.gambar ? (
            <img src={s.berkas.url} alt={s.judul} />
        ) : s.berkas ? (
            <a href={s.berkas.url} target="_blank" rel="noopener noreferrer">
                Unduh {s.berkas.namaBerkas}
            </a>
        ) : null}
    </div>
))
```

### Struktur bertingkat (rekursif)

`ambilStrukturOrganisasi()` sudah mengembalikan pohon, jadi tinggal dirender
rekursif — tidak perlu menyusun hierarkinya sendiri.

```tsx
import { ambilStrukturOrganisasi, type SimpulOrganisasi } from '@/lib/konten/struktur-organisasi'

function Simpul({ simpul }: { simpul: SimpulOrganisasi }) {
    return (
        <li>
            <strong>{simpul.jabatan}</strong>
            <span>{simpul.nama ?? 'Belum terisi'}</span>
            {simpul.bawahan.length > 0 && (
                <ul>{simpul.bawahan.map((b) => <Simpul key={b.id} simpul={b} />)}</ul>
            )}
        </li>
    )
}

export default async function HalamanStruktur() {
    const akar = await ambilStrukturOrganisasi()
    return <ul>{akar.map((s) => <Simpul key={s.id} simpul={s} />)}</ul>
}
```

### Layanan: daftar → detail

Layanan berjenjang mengikuti SK (Laboratorium → Pemeriksaan Serologi → Widal
Test). `ambilLayanan()` mengembalikan **hanya layanan utama**, jadi halaman
daftar tidak dibanjiri 93 baris; rinciannya muncul di halaman detail.

```tsx
// app/(frontend)/layanan/page.tsx
const layanan = await ambilLayananDalamGedung()

{layanan.map((l) => (
    <Link key={l.id} href={`/layanan/${l.slug}`}>
        <h2>{l.nama}</h2>
        {l.jadwal && <p>{l.jadwal}</p>}
        {l.jumlahSubLayanan > 0 && <span>{l.jumlahSubLayanan} jenis layanan</span>}
    </Link>
))}
```

Halaman `/layanan` yang sebenarnya memakai `ambilLayanan()` (semua kategori) dan
menyaringnya di peramban lewat `PencarianLayanan`. Penyaringan **tidak** boleh
pindah ke server: itu memaksa halaman jadi dinamis, yang dilarang aturan §1.

Halaman detail `/layanan/[slug]` memakai `ambilLayananDetail(slug)`. Selain
sub-layanan, ia sudah membawa `dokter` — dokter yang ditautkan ke layanan itu
**atau** ke salah satu keturunannya, sehingga halaman "Laboratorium" tetap
menampilkan dokter yang hanya ditautkan ke "Pemeriksaan Serologi". Cache-nya
ditandai `TAG.layanan` **dan** `TAG.dokter`; kalau suatu saat halaman ini ikut
menampilkan data lain, tag data itu harus ikut ditambahkan — kalau tidak, admin
menyimpan tapi halaman tidak berubah.

```tsx
// app/(frontend)/layanan/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { ambilLayananDetail, ambilSlugLayanan, type LayananLengkap } from '@/lib/konten/layanan'

export async function generateStaticParams() {
    return (await ambilSlugLayanan()).map((slug) => ({ slug }))
}

function Sub({ l }: { l: LayananLengkap }) {
    return (
        <li>
            {l.nama}
            {l.subLayanan.length > 0 && (
                <ul>{l.subLayanan.map((s) => <Sub key={s.id} l={s} />)}</ul>
            )}
        </li>
    )
}

export default async function DetailLayanan({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const layanan = await ambilLayananDetail(slug)
    if (!layanan) notFound()

    return (
        <article>
            <h1>{layanan.nama}</h1>
            {layanan.jadwal && <p>{layanan.jadwal}</p>}
            <ul>{layanan.subLayanan.map((s) => <Sub key={s.id} l={s} />)}</ul>
        </article>
    )
}
```

### Angka pelayanan (grafik)

Persentase sudah dihitung di lapisan konten supaya setiap grafik memakai
pembulatan yang sama.

```tsx
const angka = await ambilAngkaPelayanan()

{angka && angka.kelompok.map((k) => (
    <section key={k.kelompok}>
        <h3>{k.label}</h3>
        {k.baris.map((b) => (
            <div key={b.label}>{b.label}: {b.jumlah} ({b.persen}%)</div>
        ))}
    </section>
))}
{angka?.sumber && <small>Sumber: {angka.sumber}</small>}
```

### Visi — atribusi wajib ikut

Visi yang tersimpan berasal dari **RPJMD Kabupaten Tanah Bumbu**, bukan rumusan
Puskesmas sendiri. `sumberVisi` harus ikut ditampilkan; tanpa itu pembaca akan
mengira Puskesmas yang merumuskannya.

```tsx
const profil = await ambilProfil()

{profil.visi && (
    <blockquote>
        <p>{profil.visi}</p>
        {profil.sumberVisi && <cite>{profil.sumberVisi}</cite>}
    </blockquote>
)}
```

### Angka yang boleh kosong

`FasilitasPublik.jumlah` bernilai `null` untuk sarana yang di sumbernya tertulis
"ada" alih-alih angka (CCTV, Wifi, Sound System, dsb). Jangan menampilkannya
sebagai 0 atau 1 — sembunyikan angkanya saja.

```tsx
<li>
    {f.nama}
    {f.jumlah !== null && <span> — {f.jumlah} unit</span>}
</li>
```

### Menandai "praktik hari ini"

```tsx
import { ambilDokter } from '@/lib/konten/dokter'
import { hariIniWita } from '@/lib/hari'

const dokter = await ambilDokter()
const hariIni = hariIniWita() // zona WITA, bukan zona server

dokter.map((d) => {
    const praktikHariIni = d.jadwal.some((j) => j.kodeHari === hariIni)
    // ...
})
```

### Komponen klien butuh data

Ambil di server, oper lewat props. Contoh nyata di
`src/app/(frontend)/layout.tsx` → `Footer`:

```tsx
// layout.tsx (server component)
const jamPelayanan = await ambilJamPelayanan()
return <Footer jamPelayanan={jamPelayanan} />

// Footer.tsx (client component)
"use client"
import type { JamPelayanan } from '@/lib/konten/jam-pelayanan'
const Footer = ({ jamPelayanan }: { jamPelayanan: JamPelayanan }) => { ... }
```

---

## 4. Keadaan kosong

Data diisi bertahap (lihat C1–C12 di `docs/PROJECT_PLAN.md`), jadi **setiap
halaman harus tetap rapi saat datanya belum ada.** Ini tanggung jawab UI, bukan
lapisan data.

| Bentuk | Saat kosong | Yang harus dilakukan UI |
| --- | --- | --- |
| `T[]` | `[]` | Tampilkan pesan, mis. "Data dokter belum tersedia." |
| `string \| null` | `null` | Sembunyikan barisnya, jangan render label kosong |
| `foto` / `berkas` | `null` | Pilih pengganti yang disengaja (inisial, siluet, atau sembunyikan) |
| `ambilArtikel(slug)` | `null` | Panggil `notFound()` |

**`foto: null` bukan kelalaian.** Data nakes sudah masuk tapi fotonya menyusul.
Lapisan data sengaja tidak mengembalikan URL placeholder — kalau ia melakukannya,
Anda kehilangan cara membedakan "belum ada foto" dari "fotonya memang gambar itu".

---

## 5. Butuh data yang belum ada di daftar?

Jangan panggil Payload langsung dari halaman — tambahkan fungsinya ke kontrak.

1. Kalau koleksinya belum ada, buat di `src/collections/`, daftarkan di
   `src/payload.config.ts`, lalu `pnpm payload generate:types`.
2. Tambahkan tag baru di `src/lib/konten/tags.ts`.
3. Buat `src/lib/konten/<nama>.ts` mengikuti pola yang sudah ada: satu tipe
   publik, satu fungsi baca yang dibungkus `unstable_cache` dengan tag itu.
4. **Sisipkan `revalidateTag`** di Server Action yang menulisnya
   (`tagRevalidate: [TAG.x]` bila modulnya memakai `buatAksiCrud`).
   Langkah ini yang paling sering terlupa, dan gejalanya membingungkan: data
   tersimpan, dashboard bilang berhasil, tapi situs publik tetap menampilkan
   yang lama sampai satu jam kemudian.
5. Tambahkan barisnya ke tabel §2.

Setelah mengubah koleksi, buat migrasinya:

```bash
pnpm payload migrate:create nama-perubahan
```

---

## 6. Mengisi data

Semua data di atas diisi lewat `/dashboard` oleh Super Admin — bukan lewat kode,
bukan lewat SQL.

Data awal (jam pelayanan SK, identitas, katalog 22 layanan) sudah dimasukkan
skrip seed:

```bash
pnpm seed                              # langsung di komputer
docker compose --profile seed up seed  # lewat Docker
```

Seed bersifat idempoten — dijalankan berkali-kali tidak menggandakan apa pun.

Data nakes, posyandu, fasilitas, sertifikat, dan struktur organisasi menyusul
dari berkas mentah di `data/sumber/` setelah pemetaan kolomnya disepakati.
