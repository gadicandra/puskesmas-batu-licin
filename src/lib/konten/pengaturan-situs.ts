import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TAG, UMUR_CACHE_DETIK } from './tags'

export type AkunSosialMedia = {
    platform: string
    url: string
}

export type PengaturanSitus = {
    namaInstansi: string
    alamat: string | null
    telepon: string | null
    email: string | null
    /** Kosong = belum ada akun resmi; footer sebaiknya menyembunyikan barisnya
     *  (lihat C9 di docs/PROJECT_PLAN.md). */
    sosialMedia: AkunSosialMedia[]
}

/**
 * Identitas dan kontak Puskesmas, dikelola di `/dashboard/pengaturan`.
 * Dipakai footer, halaman kontak, dan metadata situs.
 */
export const ambilPengaturanSitus = unstable_cache(
    async (): Promise<PengaturanSitus> => {
        const payload = await getPayload({ config })
        const data = await payload.findGlobal({ slug: 'site-settings', depth: 0 })

        return {
            namaInstansi: data.namaInstansi?.trim() || 'UPTD Puskesmas Batulicin',
            alamat: data.alamat?.trim() || null,
            telepon: data.telepon?.trim() || null,
            email: data.email?.trim() || null,
            sosialMedia: (data.sosialMedia ?? [])
                .filter((s) => s.platform && s.url)
                .map((s) => ({ platform: s.platform, url: s.url })),
        }
    },
    ['konten:pengaturan-situs'],
    { tags: [TAG.pengaturanSitus], revalidate: UMUR_CACHE_DETIK },
)
