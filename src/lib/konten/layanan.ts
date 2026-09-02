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
    /** Alamat halaman detail: `/layanan/<slug>`. */
    slug: string
    kategori: KategoriLayanan
    labelKategori: string
    deskripsi: string | null
    /** Mis. "Senin–Kamis 08.00–11.00", "24 jam", "Sesuai Jadwal". */
    jadwal: string | null
    persyaratan: string[]
    /** Banyaknya sub-layanan langsung. Berguna untuk memberi petunjuk
     *  "lihat 5 jenis pemeriksaan" di kartu daftar. */
    jumlahSubLayanan: number
}

/** Satu layanan beserta sub-layanannya, tersusun rekursif — untuk halaman
 *  detail `/layanan/<slug>`. */
export type LayananLengkap = LayananPublik & {
    subLayanan: LayananLengkap[]
}

type DokLayanan = {
    id: number
    nama: string
    slug?: string | null
    kategori: string
    deskripsi?: string | null
    jadwal?: string | null
    persyaratan?: { isi: string }[] | null
    induk?: number | { id: number } | null
    urutan?: number | null
}

function idInduk(d: DokLayanan): number | null {
    if (d.induk == null) return null
    return typeof d.induk === 'number' ? d.induk : d.induk.id
}

function ringkas(d: DokLayanan, jumlahSub: number): LayananPublik {
    const kategori = d.kategori as KategoriLayanan
    return {
        id: d.id,
        nama: d.nama,
        slug: d.slug ?? String(d.id),
        kategori,
        labelKategori: LABEL_KATEGORI_LAYANAN[kategori] ?? d.kategori,
        deskripsi: d.deskripsi?.trim() || null,
        jadwal: d.jadwal?.trim() || null,
        persyaratan: (d.persyaratan ?? []).map((p) => p.isi).filter(Boolean),
        jumlahSubLayanan: jumlahSub,
    }
}

async function semuaLayanan(): Promise<DokLayanan[]> {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
        collection: 'services',
        where: { aktif: { equals: true } },
        sort: ['urutan', 'nama'],
        depth: 0, // `induk` cukup berupa id
        limit: 500,
        pagination: false,
    })
    return docs as unknown as DokLayanan[]
}

/**
 * Layanan tingkat teratas saja — yang TIDAK punya induk. Inilah yang tampil di
 * halaman daftar `/layanan`; rincian seperti "Widal Test" tidak ikut muncul di
 * sana, melainkan di halaman detail induknya.
 */
function muatDaftar(kategori?: KategoriLayanan) {
    return async (): Promise<LayananPublik[]> => {
        const semua = await semuaLayanan()
        const jumlahAnak = new Map<number, number>()
        for (const d of semua) {
            const induk = idInduk(d)
            if (induk !== null) jumlahAnak.set(induk, (jumlahAnak.get(induk) ?? 0) + 1)
        }
        return semua
            .filter((d) => idInduk(d) === null)
            .filter((d) => !kategori || d.kategori === kategori)
            .map((d) => ringkas(d, jumlahAnak.get(d.id) ?? 0))
    }
}

/** Semua layanan utama (tanpa induk), lintas kategori. */
export const ambilLayanan = unstable_cache(muatDaftar(), ['konten:layanan:semua'], {
    tags: [TAG.layanan],
    revalidate: UMUR_CACHE_DETIK,
})

/** Layanan utama dalam gedung. */
export const ambilLayananDalamGedung = unstable_cache(
    muatDaftar('dalam-gedung'),
    ['konten:layanan:dalam-gedung'],
    { tags: [TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)

/** Layanan utama luar gedung (UKM). */
export const ambilLayananLuarGedung = unstable_cache(
    muatDaftar('luar-gedung'),
    ['konten:layanan:luar-gedung'],
    { tags: [TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)

/**
 * Satu layanan menurut slug-nya, lengkap dengan sub-layanan bertingkat —
 * untuk halaman detail. `null` bila tidak ada; pemanggil yang memutuskan
 * memanggil `notFound()`.
 */
export function ambilLayananDetail(slug: string): Promise<LayananLengkap | null> {
    return unstable_cache(
        async (): Promise<LayananLengkap | null> => {
            const semua = await semuaLayanan()
            const akar = semua.find((d) => (d.slug ?? String(d.id)) === slug)
            if (!akar) return null

            const anakDari = new Map<number | null, DokLayanan[]>()
            for (const d of semua) {
                const kunci = idInduk(d)
                const daftar = anakDari.get(kunci) ?? []
                daftar.push(d)
                anakDari.set(kunci, daftar)
            }

            // `dikunjungi` menahan perulangan tak berujung bila ada siklus
            // (A induk B, B induk A) yang tidak dicegah oleh form.
            const dikunjungi = new Set<number>()
            const susun = (d: DokLayanan): LayananLengkap => {
                dikunjungi.add(d.id)
                const anak = (anakDari.get(d.id) ?? []).filter((a) => !dikunjungi.has(a.id))
                return {
                    ...ringkas(d, anak.length),
                    subLayanan: anak.map(susun),
                }
            }

            return susun(akar)
        },
        ['konten:layanan:detail', slug],
        { tags: [TAG.layanan], revalidate: UMUR_CACHE_DETIK },
    )()
}

/** Seluruh slug layanan utama — untuk `generateStaticParams()` di
 *  `/layanan/[slug]`. */
export const ambilSlugLayanan = unstable_cache(
    async (): Promise<string[]> => {
        const semua = await semuaLayanan()
        return semua.filter((d) => idInduk(d) === null).map((d) => d.slug ?? String(d.id))
    },
    ['konten:layanan:slug'],
    { tags: [TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)
