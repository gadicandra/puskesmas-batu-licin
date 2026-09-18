import type { Payload, PayloadRequest } from 'payload'

/** Format foto yang boleh dipasang pada posyandu.
 *
 *  Koleksi `media` dipakai bersama dan sengaja menerima `image/*` serta PDF
 *  (untuk pindaian sertifikat), jadi batasannya dipasang di sini, pada isian
 *  yang memakainya — bukan di `media`. JPG dan PNG yang diunggah lewat
 *  dashboard biasanya sudah berubah jadi WebP oleh `keWebp()`, tapi tetap
 *  diterima untuk berkas lama dan unggahan lewat jalur lain. */
export const TIPE_FOTO_POSYANDU = ['image/jpeg', 'image/png', 'image/webp'] as const

/** Sama dengan `upload.limits.fileSize` di payload.config.ts. */
export const UKURAN_MAKS_FOTO_POSYANDU = 5_000_000

function idDari(nilai: unknown): number | null {
    if (nilai === null || nilai === undefined || nilai === '') return null
    if (typeof nilai === 'object' && 'id' in nilai) return Number((nilai as { id: unknown }).id)
    const id = Number(nilai)
    return Number.isFinite(id) ? id : null
}

/**
 * Periksa berkas media yang akan dipasang sebagai foto posyandu.
 *
 * Mengembalikan pesan yang bisa ditindaklanjuti staf, atau `null` bila berkasnya
 * boleh dipakai (termasuk bila fotonya memang dikosongkan). Dipakai dua tempat:
 * `validate` di koleksi (penjaga sebenarnya, berlaku untuk REST dan Local API)
 * dan server action dashboard (supaya pesannya tampil di bawah isian foto,
 * bukan diganti pesan umum oleh `pesanError`).
 */
export async function periksaFotoPosyandu(
    payload: Payload,
    nilai: unknown,
    req?: PayloadRequest,
): Promise<string | null> {
    const id = idDari(nilai)
    if (id === null) return null

    const media = await payload.findByID({
        collection: 'media',
        id,
        depth: 0,
        disableErrors: true,
        overrideAccess: true,
        req,
    })

    if (!media) return 'Berkas foto tidak ditemukan. Pilih ulang fotonya atau kosongkan.'

    if (!TIPE_FOTO_POSYANDU.includes(media.mimeType as (typeof TIPE_FOTO_POSYANDU)[number])) {
        return 'Foto posyandu harus berupa gambar JPG, PNG, atau WebP. Pilih berkas gambar lain.'
    }

    if ((media.filesize ?? 0) > UKURAN_MAKS_FOTO_POSYANDU) {
        return 'Ukuran foto melebihi 5 MB. Pilih foto yang lebih kecil.'
    }

    return null
}
