'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { TAG } from '@/lib/konten/tags'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import { pesanError } from '@/lib/dashboard/errors'
import type { FormState } from '@/lib/dashboard/crud'
import { JADWAL_SK, CATATAN_SK } from '@/lib/dashboard/jadwal-sk'

export async function simpanJamOperasional(_prev: FormState, formData: FormData): Promise<FormState> {
    const user = await requireSuperAdmin()

    if (formData.get('aksi') === 'kembalikan-sk') {
        try {
            const payload = await getPayload({ config })
            await payload.updateGlobal({
                slug: 'operational-hours',
                data: { jadwal: JADWAL_SK, catatan: CATATAN_SK },
                user,
                overrideAccess: false,
            })
        } catch (err) {
            return { error: pesanError(err) }
        }
        revalidatePath('/dashboard/pengaturan')
        revalidatePath('/')
        revalidateTag(TAG.jamPelayanan)
        return { sukses: 'Jadwal dikembalikan sesuai SK.' }
    }

    const hari = formData.getAll('hari').map(String)
    const jam = formData.getAll('jam').map(String)

    const jadwal = hari
        .map((h, i) => ({ hari: h.trim(), jam: (jam[i] ?? '').trim() }))
        .filter((b) => b.hari && b.jam)

    if (jadwal.length === 0) {
        return { error: 'Minimal satu baris jadwal harus diisi (hari dan jam).' }
    }

    try {
        const payload = await getPayload({ config })
        await payload.updateGlobal({
            slug: 'operational-hours',
            data: { jadwal, catatan: String(formData.get('catatan') || '') },
            user,
            overrideAccess: false,
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/pengaturan')
    revalidatePath('/')
    revalidateTag(TAG.jamPelayanan)
    return { sukses: 'Jam operasional tersimpan dan sudah diperbarui di situs.' }
}

export async function simpanPengaturanSitus(_prev: FormState, formData: FormData): Promise<FormState> {
    const user = await requireSuperAdmin()

    const platform = formData.getAll('platform').map(String)
    const url = formData.getAll('url').map(String)
    const sosialMedia = platform
        .map((p, i) => ({ platform: p.trim(), url: (url[i] ?? '').trim() }))
        .filter((s) => s.platform && s.url)

    try {
        const payload = await getPayload({ config })
        await payload.updateGlobal({
            slug: 'site-settings',
            data: {
                namaInstansi: String(formData.get('namaInstansi') || ''),
                alamat: String(formData.get('alamat') || ''),
                telepon: String(formData.get('telepon') || ''),
                email: String(formData.get('email') || ''),
                sosialMedia,
            },
            user,
            overrideAccess: false,
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/pengaturan')
    revalidatePath('/')
    revalidateTag(TAG.pengaturanSitus)
    return { sukses: 'Pengaturan situs tersimpan.' }
}
