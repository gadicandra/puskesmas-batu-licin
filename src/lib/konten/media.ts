import type { Media } from '@/payload-types'

/** Bentuk gambar yang siap dipakai UI: `src` dan `alt` selalu ada.
 *
 *  `src` adalah berkas aslinya — pakai untuk hero atau apa pun yang tampil
 *  selebar layar. Untuk petak kecil, pakai turunan di bawah: berkas asli
 *  berukuran 2500px yang dirender di kotak 250px membuat halaman berat tanpa
 *  terlihat lebih tajam. Halaman daftar layanan sempat mengunduh 3,4 MB gambar
 *  karena hal ini. */
export type GambarPublik = {
    src: string
    alt: string
    lebar: number | null
    tinggi: number | null
    /** Potongan **potret** 768×1024 buatan Payload — untuk kartu berbentuk
     *  potret. `null` bila turunannya belum ada (berkas lama, atau gambar yang
     *  lebih kecil dari itu). Pemakainya wajib menyediakan cadangan `src`. */
    srcKartu: string | null
    /** Potongan **lanskap** 400×300 — untuk petak kecil dan mendatar. Aturan
     *  cadangan `src` sama seperti `srcKartu`. */
    srcMini: string | null
}

/** Nilai field `upload` dari Payload sebelum diringkas.
 *  `depth: 1` membuatnya berupa objek; tanpa itu ia hanya berupa angka id. */
type NilaiUpload = number | Media | null | undefined

/**
 * Ubah field upload Payload jadi `GambarPublik`, atau `null` bila gambarnya
 * memang belum ada.
 *
 * Sengaja mengembalikan `null` dan BUKAN URL placeholder. Keputusan tampilan
 * saat foto kosong — inisial nama, siluet, atau menyembunyikan elemennya —
 * milik UI. Kalau lapisan ini memaksakan placeholder, pemakainya kehilangan
 * cara membedakan "belum ada foto" dari "fotonya memang gambar itu".
 */
export function ringkasGambar(nilai: NilaiUpload, altCadangan: string): GambarPublik | null {
    // Angka = relasi belum di-resolve. Penyebabnya selalu sama: query lupa
    // `depth: 1`. Lebih baik dianggap tidak ada daripada merender URL rusak.
    if (!nilai || typeof nilai === 'number') return null
    if (!nilai.url) return null

    return {
        src: nilai.url,
        alt: nilai.alt?.trim() || altCadangan,
        lebar: nilai.width ?? null,
        tinggi: nilai.height ?? null,
        srcKartu: nilai.sizes?.card?.url || null,
        srcMini: nilai.sizes?.thumbnail?.url || null,
    }
}

/** Berkas unggahan yang bisa berupa gambar ATAU PDF (mis. sertifikat). */
export type BerkasPublik = {
    url: string
    namaBerkas: string
    /** `image/jpeg`, `application/pdf`, dst. */
    tipe: string | null
    /** Benar bila berkas ini gambar, jadi UI bisa memilih antara `<img>` dan
     *  tautan unduh tanpa menebak dari ekstensi nama berkas. */
    gambar: boolean
    ukuranByte: number | null
}

export function ringkasBerkas(nilai: NilaiUpload, namaCadangan: string): BerkasPublik | null {
    if (!nilai || typeof nilai === 'number') return null
    if (!nilai.url) return null

    const tipe = nilai.mimeType ?? null
    return {
        url: nilai.url,
        namaBerkas: nilai.filename?.trim() || namaCadangan,
        tipe,
        gambar: Boolean(tipe?.startsWith('image/')),
        ukuranByte: nilai.filesize ?? null,
    }
}
