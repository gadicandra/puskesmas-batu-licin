'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import { pesanError } from '@/lib/dashboard/errors'
import { petaError, skemaTanggapanPengaduan } from '@/lib/dashboard/validation'
import type { FormState } from '@/lib/dashboard/crud'

/** Pengaduan tidak memakai `buatAksiCrud`: staf tidak pernah membuat atau
 *  mengubah isi pengaduan — yang datang dari warga tetap apa adanya. Yang boleh
 *  diubah hanya dua hal, status dan tanggapan, dan itu sengaja dibatasi di sini
 *  supaya isi aduan tidak mungkin ikut tersunting lewat form dashboard.
 *
 *  Tidak ada `revalidateTag`: pengaduan tidak pernah tampil di situs publik
 *  (`read: isSuperAdmin` di koleksinya), jadi tidak ada cache konten yang perlu
 *  dibuang. */
export async function tanggapiPengaduan(_prev: FormState, formData: FormData): Promise<FormState> {
    const user = await requireSuperAdmin()

    const id = Number(formData.get('id'))
    if (!id) return { error: 'Pengaduan tidak dikenali. Muat ulang halaman lalu coba lagi.' }

    const hasil = skemaTanggapanPengaduan.safeParse({
        status: formData.get('status'),
        tanggapan: formData.get('tanggapan') ?? '',
    })
    if (!hasil.success) return { fieldErrors: petaError(hasil.error) }

    try {
        const payload = await getPayload({ config })
        await payload.update({
            collection: 'complaints',
            id,
            data: hasil.data,
            user,
            overrideAccess: false,
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/pengaduan')
    revalidatePath('/dashboard')
    return { sukses: 'Tanggapan tersimpan.' }
}
