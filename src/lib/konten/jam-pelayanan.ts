import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TAG, UMUR_CACHE_DETIK } from './tags'

/** Satu baris jadwal, mis. { hari: "Senin – Kamis", jam: "08.00 – 11.00" }. */
export type BarisJadwal = {
    hari: string
    jam: string
}

export type JamPelayanan = {
    jadwal: BarisJadwal[]
    /** Keterangan tambahan, mis. layanan UGD 24 jam. `null` bila dikosongkan. */
    catatan: string | null
}

/**
 * Jam pelayanan resmi Puskesmas, dikelola di `/dashboard/pengaturan`.
 *
 * Sumber kebenarannya SK B/445.61/003/PKM.Btl-Adm/I/2023, yang jadi nilai awal
 * global `operational-hours`. Jangan pernah menulis jam pelayanan langsung di
 * komponen — begitu di-hardcode, perubahan yang dilakukan staf lewat dashboard
 * berhenti berpengaruh, dan itulah jebakan yang sedang kita bereskan.
 */
export const ambilJamPelayanan = unstable_cache(
    async (): Promise<JamPelayanan> => {
        const payload = await getPayload({ config })
        const data = await payload.findGlobal({ slug: 'operational-hours', depth: 0 })

        return {
            jadwal: (data.jadwal ?? []).map((baris) => ({
                hari: baris.hari,
                jam: baris.jam,
            })),
            catatan: data.catatan?.trim() || null,
        }
    },
    ['konten:jam-pelayanan'],
    { tags: [TAG.jamPelayanan], revalidate: UMUR_CACHE_DETIK },
)
