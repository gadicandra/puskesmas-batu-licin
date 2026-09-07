import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HARI, labelHari, URUTAN_HARI, type KodeHari } from '@/lib/hari'
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

/** Satu baris tabel jadwal mingguan: tujuh hari selalu ada, hari tanpa jadwal
 *  ditandai `libur`. */
export type BarisJadwalMingguan = {
    kodeHari: KodeHari
    hari: string
    /** "13.00 – 19.00", atau `null` bila libur. */
    jam: string | null
    libur: boolean
}

export type DokterPublik = {
    id: number
    nama: string
    spesialisasi: string
    /** Sudah terurut Senin → Minggu. Hanya hari yang benar-benar ada jadwalnya. */
    jadwal: JadwalPraktik[]
    /** Tujuh baris Senin → Minggu, hari kosong terisi "Libur" — bentuk yang
     *  langsung bisa dirender sebagai tabel jadwal tanpa UI perlu menambal
     *  hari yang hilang. Dilengkapi di sini, sekali, dengan alasan yang sama
     *  seperti pengurutan jadwal di bawah. */
    jadwalMingguan: BarisJadwalMingguan[]
    /** Id layanan tempat dokter ini bertugas. Dipakai halaman
     *  `/layanan/<slug>` untuk menyusun "Tim Dokter". */
    layanan: number[]
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

        return docs.map((d) => {
            const jadwal = (d.jadwalPraktik ?? [])
                .map((j) => ({
                    kodeHari: j.hari as KodeHari,
                    hari: labelHari(j.hari),
                    jamMulai: j.jamMulai,
                    jamSelesai: j.jamSelesai,
                }))
                .sort((a, b) => (URUTAN_HARI[a.kodeHari] ?? 99) - (URUTAN_HARI[b.kodeHari] ?? 99))

            const perHari = new Map(jadwal.map((j) => [j.kodeHari, j]))

            return {
            id: d.id,
            nama: d.nama,
            spesialisasi: d.spesialisasi,
            jadwal,
            jadwalMingguan: HARI.map((h) => {
                const j = perHari.get(h.value)
                return {
                    kodeHari: h.value,
                    hari: h.label,
                    jam: j ? `${j.jamMulai} – ${j.jamSelesai}` : null,
                    libur: !j,
                }
            }),
            layanan: (d.layanan ?? [])
                .map((l) => (typeof l === 'number' ? l : l?.id))
                .filter((id): id is number => typeof id === 'number'),
            pendidikan: d.pendidikan?.trim() || null,
            nomorSTR: d.nomorSTR?.trim() || null,
            deskripsi: d.deskripsi?.trim() || null,
            poli: labelUnit(d.poli),
            foto: ringkasGambar(d.foto, `Foto ${d.nama}`),
            }
        })
    },
    ['konten:dokter'],
    { tags: [TAG.dokter], revalidate: UMUR_CACHE_DETIK },
)
