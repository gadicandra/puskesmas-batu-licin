import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { labelHari, URUTAN_HARI, type KodeHari } from '@/lib/hari'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type JadwalPosyandu = {
    kodeHari: KodeHari
    hari: string
    keterangan: string | null
}

/** Layanan sudah diringkas jadi id + nama; kalau butuh deskripsi & syaratnya,
 *  ambil dari `ambilLayanan()` dan cocokkan berdasarkan `id`. Sengaja tidak
 *  disalin utuh ke sini supaya daftar posyandu tetap ringan. */
export type LayananRingkas = {
    id: number
    nama: string
}

export type PosyanduPublik = {
    id: number
    nama: string
    alamat: string | null
    layanan: LayananRingkas[]
    /** Sudah terurut Senin → Minggu. */
    jadwal: JadwalPosyandu[]
    penanggungJawab: string | null
    kontak: string | null
}

/**
 * Posyandu aktif beserta layanan yang tersedia di masing-masing.
 *
 * Relasi `layanan` menunjuk ke koleksi `services`, jadi nama layanan di sini
 * selalu sama dengan yang tampil di halaman Layanan — memperbaiki satu nama
 * cukup di satu tempat.
 */
export const ambilPosyandu = unstable_cache(
    async (): Promise<PosyanduPublik[]> => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'posyandu',
            where: { aktif: { equals: true } },
            sort: ['urutan', 'nama'],
            depth: 1, // resolve relasi `layanan`
            limit: 300,
            pagination: false,
        })

        return docs.map((d) => ({
            id: d.id,
            nama: d.nama,
            alamat: d.alamat?.trim() || null,
            layanan: (d.layanan ?? [])
                // Angka = relasi belum ter-resolve (depth kurang). Dilewati
                // daripada merender entri tanpa nama.
                .filter((l): l is Exclude<typeof l, number> => typeof l !== 'number')
                .map((l) => ({ id: l.id, nama: l.nama })),
            jadwal: (d.jadwal ?? [])
                .map((j) => ({
                    kodeHari: j.hari as KodeHari,
                    hari: labelHari(j.hari),
                    keterangan: j.keterangan?.trim() || null,
                }))
                .sort((a, b) => (URUTAN_HARI[a.kodeHari] ?? 99) - (URUTAN_HARI[b.kodeHari] ?? 99)),
            penanggungJawab: d.penanggungJawab?.trim() || null,
            kontak: d.kontak?.trim() || null,
        }))
    },
    ['konten:posyandu'],
    { tags: [TAG.posyandu, TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)
