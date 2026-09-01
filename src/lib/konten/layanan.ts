import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type KategoriLayanan = 'dalam-gedung' | 'luar-gedung' | 'posyandu'

export const LABEL_KATEGORI_LAYANAN: Record<KategoriLayanan, string> = {
    'dalam-gedung': 'Dalam Gedung',
    'luar-gedung': 'Luar Gedung (UKM)',
    posyandu: 'Posyandu',
}

export type LayananPublik = {
    id: number
    nama: string
    kategori: KategoriLayanan
    /** Label kategori siap tampil. */
    labelKategori: string
    deskripsi: string | null
    /** Sudah berupa larik string; kosong bila tidak ada syarat khusus. */
    persyaratan: string[]
}

async function muat(kategori?: KategoriLayanan): Promise<LayananPublik[]> {
    const payload = await getPayload({ config })
    const where: Where = kategori
        ? { and: [{ aktif: { equals: true } }, { kategori: { equals: kategori } }] }
        : { aktif: { equals: true } }

    const { docs } = await payload.find({
        collection: 'services',
        where,
        // `urutan` diisi staf untuk menonjolkan layanan tertentu; nama jadi
        // pemecah seri supaya urutannya tetap sama di setiap pemuatan.
        sort: ['urutan', 'nama'],
        depth: 0,
        limit: 200,
        pagination: false,
    })

    return docs.map((d) => ({
        id: d.id,
        nama: d.nama,
        kategori: d.kategori as KategoriLayanan,
        labelKategori: LABEL_KATEGORI_LAYANAN[d.kategori as KategoriLayanan] ?? d.kategori,
        deskripsi: d.deskripsi?.trim() || null,
        persyaratan: (d.persyaratan ?? []).map((p) => p.isi).filter(Boolean),
    }))
}

/** Semua layanan aktif. */
export const ambilLayanan = unstable_cache(async () => muat(), ['konten:layanan:semua'], {
    tags: [TAG.layanan],
    revalidate: UMUR_CACHE_DETIK,
})

/** Layanan dalam gedung — yang dilayani di gedung Puskesmas. */
export const ambilLayananDalamGedung = unstable_cache(
    async () => muat('dalam-gedung'),
    ['konten:layanan:dalam-gedung'],
    { tags: [TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)

/** Layanan luar gedung (UKM esensial & pengembangan). */
export const ambilLayananLuarGedung = unstable_cache(
    async () => muat('luar-gedung'),
    ['konten:layanan:luar-gedung'],
    { tags: [TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)
