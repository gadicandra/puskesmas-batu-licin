import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { labelHari, URUTAN_HARI, type KodeHari } from '@/lib/hari'
import { labelUnit } from '@/lib/units'
import { ringkasGambar, type GambarPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type JadwalPraktik = {
    /** Kode hari (`senin`…`minggu`) — bandingkan dengan `hariIniWita()` dari
     *  `@/lib/hari` untuk menandai "praktik hari ini". */
    kodeHari: KodeHari
    /** Label siap tampil, mis. "Senin". */
    hari: string
    jamMulai: string
    jamSelesai: string
}

export type DokterPublik = {
    id: number
    nama: string
    spesialisasi: string
    /** Sudah terurut Senin → Minggu. */
    jadwal: JadwalPraktik[]
    pendidikan: string | null
    nomorSTR: string | null
    deskripsi: string | null
    poli: string | null
    /** `null` bila fotonya belum ada — UI yang memutuskan penggantinya. */
    foto: GambarPublik | null
}

/**
 * Dokter yang berstatus aktif, urut menurut nama, jadwalnya sudah diurutkan
 * Senin → Minggu.
 *
 * Pengurutan jadwal dikerjakan di sini, bukan di UI: urutan hari sama untuk
 * setiap tempat yang menampilkannya, jadi tidak ada alasan mengulanginya —
 * dan mengulang berarti membuka peluang dua halaman mengurutkan berbeda.
 */
export const ambilDokter = unstable_cache(
    async (): Promise<DokterPublik[]> => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'doctors',
            where: { aktif: { equals: true } },
            sort: 'nama',
            depth: 1, // resolve relasi `foto`
            limit: 200,
            pagination: false,
        })

        return docs.map((d) => ({
            id: d.id,
            nama: d.nama,
            spesialisasi: d.spesialisasi,
            jadwal: (d.jadwalPraktik ?? [])
                .map((j) => ({
                    kodeHari: j.hari as KodeHari,
                    hari: labelHari(j.hari),
                    jamMulai: j.jamMulai,
                    jamSelesai: j.jamSelesai,
                }))
                .sort((a, b) => (URUTAN_HARI[a.kodeHari] ?? 99) - (URUTAN_HARI[b.kodeHari] ?? 99)),
            pendidikan: d.pendidikan?.trim() || null,
            nomorSTR: d.nomorSTR?.trim() || null,
            deskripsi: d.deskripsi?.trim() || null,
            poli: labelUnit(d.poli),
            foto: ringkasGambar(d.foto, `Foto ${d.nama}`),
        }))
    },
    ['konten:dokter'],
    { tags: [TAG.dokter], revalidate: UMUR_CACHE_DETIK },
)
