import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { ringkasBerkas, type BerkasPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type JenisSertifikat = 'akreditasi' | 'penghargaan'

export type SertifikatPublik = {
    id: number
    judul: string
    jenis: JenisSertifikat
    penerbit: string | null
    /** ISO 8601. Formatnya diserahkan ke UI supaya bisa disesuaikan konteks
     *  ("2023" di kartu ringkas, "12 Januari 2023" di halaman detail). */
    tanggal: string | null
    keterangan: string | null
    /** Bisa gambar atau PDF — periksa `.gambar` sebelum merender. */
    berkas: BerkasPublik | null
}

async function muat(jenis?: JenisSertifikat): Promise<SertifikatPublik[]> {
    const payload = await getPayload({ config })
    const where: Where = jenis ? { jenis: { equals: jenis } } : {}

    const { docs } = await payload.find({
        collection: 'certificates',
        where,
        sort: '-tanggal',
        depth: 1, // resolve relasi `berkas`
        limit: 200,
        pagination: false,
    })

    return docs.map((d) => ({
        id: d.id,
        judul: d.judul,
        jenis: d.jenis as JenisSertifikat,
        penerbit: d.penerbit?.trim() || null,
        tanggal: d.tanggal ?? null,
        keterangan: d.keterangan?.trim() || null,
        berkas: ringkasBerkas(d.berkas, d.judul),
    }))
}

/** Semua sertifikat & penghargaan, terbaru dulu. */
export const ambilSertifikat = unstable_cache(
    async () => muat(),
    ['konten:sertifikat:semua'],
    { tags: [TAG.sertifikat], revalidate: UMUR_CACHE_DETIK },
)

/** Sertifikat akreditasi saja. */
export const ambilAkreditasi = unstable_cache(
    async () => muat('akreditasi'),
    ['konten:sertifikat:akreditasi'],
    { tags: [TAG.sertifikat], revalidate: UMUR_CACHE_DETIK },
)

/** Piagam penghargaan saja. */
export const ambilPenghargaan = unstable_cache(
    async () => muat('penghargaan'),
    ['konten:sertifikat:penghargaan'],
    { tags: [TAG.sertifikat], revalidate: UMUR_CACHE_DETIK },
)
