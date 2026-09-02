import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'
import type { CollectionSlug } from 'payload'
import config from '@payload-config'
import type { z } from 'zod'
import { requireSuperAdmin } from './auth'
import { petaError } from './validation'
import { pesanError } from './errors'
import type { NamaTag } from '@/lib/konten/tags'

export type FormState = {
    error?: string
    fieldErrors?: Record<string, string>
    sukses?: string
}

/** Pabrik server action CRUD untuk koleksi sederhana (Dokter, Tenaga Medis,
 *  Vaksin, Sertifikat). Semua mutasi memakai `overrideAccess: false` sehingga
 *  aturan di `src/access` tetap jadi penegak sebenarnya — helper ini hanya
 *  menghapus pengulangan, bukan menggantikan access control. */
export function buatAksiCrud<S extends z.ZodType>({
    collection,
    skema,
    pathRevalidate = [],
    tagRevalidate = [],
    kosongkanJadiNull = [],
    labelData,
}: {
    collection: CollectionSlug
    skema: S
    /** Path publik yang ikut disegarkan setelah data berubah. */
    pathRevalidate?: string[]
    /** Tag konten yang cache-nya dibuang setelah data berubah — inilah yang
     *  membuat halaman publik ikut berubah begitu admin menyimpan. Tanpa ini,
     *  data tersimpan tapi situs tetap menampilkan yang lama sampai
     *  `UMUR_CACHE_DETIK` habis. Lihat docs/KONTRAK-DATA.md. */
    tagRevalidate?: NamaTag[]
    /** Field yang isian kosongnya berarti "kosongkan", bukan "biarkan seperti
     *  semula". Tanpa daftar ini isian kosong dibuang sebelum dikirim, sehingga
     *  relasi atau foto yang sudah terisi tidak pernah bisa dilepas lagi —
     *  gagal tanpa pesan galat: tombol Simpan sukses, nilainya tetap. */
    kosongkanJadiNull?: string[]
    labelData: string
}) {
    const segarkan = () => {
        revalidatePath(`/dashboard/${collection}`)
        pathRevalidate.forEach((p) => revalidatePath(p))
        tagRevalidate.forEach((t) => revalidateTag(t))
    }

    async function simpan(_prev: FormState, formData: FormData): Promise<FormState> {
        const user = await requireSuperAdmin()
        const id = formData.get('id') ? Number(formData.get('id')) : null

        const mentah: Record<string, unknown> = {}
        formData.forEach((nilai, kunci) => {
            if (kunci === 'id') return
            if (nilai === '') {
                if (kosongkanJadiNull.includes(kunci)) mentah[kunci] = null
                return
            }
            mentah[kunci] = nilai
        })
        // Checkbox tidak terkirim saat tidak dicentang — jadikan boolean eksplisit.
        if (formData.has('_checkbox_aktif')) mentah.aktif = formData.get('aktif') === 'on'

        const hasil = skema.safeParse(mentah)
        if (!hasil.success) return { fieldErrors: petaError(hasil.error) }

        try {
            const payload = await getPayload({ config })
            if (id) {
                await payload.update({
                    collection,
                    id,
                    data: hasil.data as never,
                    user,
                    overrideAccess: false,
                })
            } else {
                await payload.create({
                    collection,
                    data: hasil.data as never,
                    user,
                    overrideAccess: false,
                })
            }
        } catch (err) {
            return { error: pesanError(err) }
        }

        segarkan()
        return { sukses: `${labelData} tersimpan.` }
    }

    async function hapus(_prev: FormState, formData: FormData): Promise<FormState> {
        const user = await requireSuperAdmin()
        const id = Number(formData.get('id'))
        if (!id) return { error: 'Data tidak dikenali.' }

        try {
            const payload = await getPayload({ config })
            await payload.delete({ collection, id, user, overrideAccess: false })
        } catch (err) {
            return { error: pesanError(err) }
        }

        segarkan()
        return { sukses: `${labelData} dihapus.` }
    }

    return { simpan, hapus }
}
