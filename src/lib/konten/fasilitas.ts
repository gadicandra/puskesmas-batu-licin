import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ringkasGambar, type GambarPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type KategoriFasilitas = 'ruang' | 'alat' | 'kendaraan' | 'penunjang'

export const LABEL_KATEGORI_FASILITAS: Record<KategoriFasilitas, string> = {
    ruang: 'Ruang & Bangunan',
    alat: 'Alat Kesehatan',
    kendaraan: 'Kendaraan',
    penunjang: 'Sarana Penunjang',
}

export type FasilitasPublik = {
    id: number
    nama: string
    kategori: KategoriFasilitas
    labelKategori: string
    deskripsi: string | null
    jumlah: number | null
    foto: GambarPublik | null
}

/** Fasilitas aktif, urut menurut `urutan` lalu nama. */
export const ambilFasilitas = unstable_cache(
    async (): Promise<FasilitasPublik[]> => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'facilities',
            where: { aktif: { equals: true } },
            sort: ['urutan', 'nama'],
            depth: 1, // resolve relasi `foto`
            limit: 300,
            pagination: false,
        })

        return docs.map((d) => ({
            id: d.id,
            nama: d.nama,
            kategori: d.kategori as KategoriFasilitas,
            labelKategori:
                LABEL_KATEGORI_FASILITAS[d.kategori as KategoriFasilitas] ?? d.kategori,
            deskripsi: d.deskripsi?.trim() || null,
            jumlah: d.jumlah ?? null,
            foto: ringkasGambar(d.foto, `Foto ${d.nama}`),
        }))
    },
    ['konten:fasilitas'],
    { tags: [TAG.fasilitas], revalidate: UMUR_CACHE_DETIK },
)
