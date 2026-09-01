import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type KelompokBudayaKerja = {
    judul: string
    keterangan: string | null
    butir: string[]
}

export type ProfilPuskesmas = {
    visi: string | null
    /** Sudah berupa larik string; kosong bila belum diisi. */
    misi: string[]
    motto: string | null
    maklumatPelayanan: string | null
    budayaKerja: KelompokBudayaKerja[]
    sejarah: string | null
}

/**
 * Profil kelembagaan: visi, misi, motto, maklumat pelayanan, budaya kerja.
 *
 * Semua nilainya boleh `null`/kosong — halaman profil harus tetap tampil rapi
 * saat sebagian belum diisi, karena pengisiannya bertahap mengikuti C1–C7 di
 * `docs/PROJECT_PLAN.md`.
 */
export const ambilProfil = unstable_cache(
    async (): Promise<ProfilPuskesmas> => {
        const payload = await getPayload({ config })
        const data = await payload.findGlobal({ slug: 'profile', depth: 0 })

        return {
            visi: data.visi?.trim() || null,
            misi: (data.misi ?? []).map((m) => m.isi).filter(Boolean),
            motto: data.motto?.trim() || null,
            maklumatPelayanan: data.maklumatPelayanan?.trim() || null,
            budayaKerja: (data.budayaKerja ?? []).map((b) => ({
                judul: b.judul,
                keterangan: b.keterangan?.trim() || null,
                butir: (b.butir ?? []).map((x) => x.isi).filter(Boolean),
            })),
            sejarah: data.sejarah?.trim() || null,
        }
    },
    ['konten:profil'],
    { tags: [TAG.profil], revalidate: UMUR_CACHE_DETIK },
)
