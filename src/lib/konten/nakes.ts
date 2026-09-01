import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { labelUnit } from '@/lib/units'
import { ringkasGambar, type GambarPublik } from './media'
import { TAG, UMUR_CACHE_DETIK } from './tags'

const LABEL_JABATAN: Record<string, string> = {
    dokter: 'Dokter',
    perawat: 'Perawat',
    bidan: 'Bidan',
    apoteker: 'Apoteker',
    analis: 'Analis Laboratorium',
    gizi: 'Ahli Gizi',
    sanitarian: 'Sanitarian',
    administrasi: 'Tenaga Administrasi',
    lainnya: 'Lainnya',
}

export type NakesPublik = {
    id: number
    nama: string
    /** Sudah berupa label siap tampil ("Analis Laboratorium"), bukan kode. */
    jabatan: string
    /** Kode jabatan, untuk mengelompokkan atau menyaring di UI. */
    kodeJabatan: string
    /** Nama poli/unit siap tampil. `null` bila tidak diisi. */
    poli: string | null
    /** `null` bila fotonya belum ada — UI yang memutuskan penggantinya. */
    foto: GambarPublik | null
}

/**
 * Tenaga medis yang berstatus aktif, urut menurut nama.
 *
 * Yang tidak aktif disaring di sini, bukan di UI: menonaktifkan seseorang lewat
 * dashboard harus cukup untuk menghilangkannya dari situs, tanpa perlu setiap
 * halaman mengingat untuk menyaringnya sendiri.
 */
export const ambilNakes = unstable_cache(
    async (): Promise<NakesPublik[]> => {
        const payload = await getPayload({ config })
        const { docs } = await payload.find({
            collection: 'medical-staff',
            where: { aktif: { equals: true } },
            sort: 'nama',
            depth: 1, // resolve relasi `foto`
            limit: 500,
            pagination: false,
        })

        return docs.map((d) => ({
            id: d.id,
            nama: d.nama,
            jabatan: LABEL_JABATAN[d.jabatan] ?? d.jabatan,
            kodeJabatan: d.jabatan,
            poli: labelUnit(d.poli),
            foto: ringkasGambar(d.foto, `Foto ${d.nama}`),
        }))
    },
    ['konten:nakes'],
    { tags: [TAG.nakes], revalidate: UMUR_CACHE_DETIK },
)
