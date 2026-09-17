import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { labelHari, URUTAN_HARI, type KodeHari } from '@/lib/hari'
import { ringkasGambar, type GambarPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type JadwalPosyandu = {
    kodeHari: KodeHari
    hari: string
    polaMinggu: string | null
    jamMulai: string | null
    jamSelesai: string | null
    keterangan: string | null
    /** Sudah digabung siap tampil, mis. "Senin, Minggu ke-1". */
    labelJadwal: string
    /** Rentang jam siap tampil, mis. "08:00 - 11:00". `null` bila jamnya belum
     *  diisi DAN tidak ada catatan pengganti — UI yang memutuskan apakah
     *  barisnya disembunyikan. */
    labelWaktu: string | null
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
    deskripsi: string | null
    foto: GambarPublik | null
    desa: string | null
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
            depth: 1, // resolve relasi `layanan` dan `foto`
            limit: 300,
            pagination: false,
        })

        return docs.map((d) => ({
            id: d.id,
            nama: d.nama,
            deskripsi: d.deskripsi?.trim() || null,
            foto: ringkasGambar(d.foto, `Kegiatan ${d.nama}`),
            desa: d.desa?.trim() || null,
            alamat: d.alamat?.trim() || null,
            layanan: (d.layanan ?? [])
                // Angka = relasi belum ter-resolve (depth kurang). Dilewati
                // daripada merender entri tanpa nama.
                .filter((l): l is Exclude<typeof l, number> => typeof l !== 'number')
                .map((l) => ({ id: l.id, nama: l.nama })),
            jadwal: (d.jadwal ?? [])
                .map((j) => {
                    const hari = labelHari(j.hari)
                    const polaMinggu = j.polaMinggu?.trim() || null
                    const jamMulai = j.jamMulai?.trim() || null
                    const jamSelesai = j.jamSelesai?.trim() || null
                    const keterangan = j.keterangan?.trim() || null

                    return {
                        kodeHari: j.hari as KodeHari,
                        hari,
                        polaMinggu,
                        jamMulai,
                        jamSelesai,
                        keterangan,
                        labelJadwal: [hari, polaMinggu].filter(Boolean).join(', '),
                        // Catatan bebas dipakai sebagai cadangan supaya data
                        // yang diketik sebelum jam dipecah jadi dua isian tetap
                        // muncul di situs, bukan hilang diam-diam.
                        labelWaktu:
                            jamMulai && jamSelesai ? `${jamMulai} - ${jamSelesai}` : jamMulai || keterangan,
                    }
                })
                .sort((a, b) => (URUTAN_HARI[a.kodeHari] ?? 99) - (URUTAN_HARI[b.kodeHari] ?? 99)),
            penanggungJawab: d.penanggungJawab?.trim() || null,
            kontak: d.kontak?.trim() || null,
        }))
    },
    ['konten:posyandu'],
    { tags: [TAG.posyandu, TAG.layanan], revalidate: UMUR_CACHE_DETIK },
)
