'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin, requireUser } from '@/lib/dashboard/auth'
import { skemaPengguna, petaError } from '@/lib/dashboard/validation'
import { pesanError } from '@/lib/dashboard/errors'
import type { FormState } from '@/lib/dashboard/crud'

const SANDI_MIN = 8

/** Cegah sistem terkunci: superadmin terakhir tidak boleh dihapus atau
 *  diturunkan rolenya. Tanpa /admin Payload, tidak ada jalan masuk lain. */
async function superadminTerakhir(idTarget: number): Promise<boolean> {
    const payload = await getPayload({ config })
    const target = await payload.findByID({ collection: 'users', id: idTarget, depth: 0 })
    if (target.role !== 'superadmin') return false
    const { totalDocs } = await payload.count({
        collection: 'users',
        where: { role: { equals: 'superadmin' } },
    })
    return totalDocs <= 1
}

export async function simpanPengguna(_prev: FormState, formData: FormData): Promise<FormState> {
    const aktor = await requireSuperAdmin()
    const id = formData.get('id') ? Number(formData.get('id')) : null
    const password = String(formData.get('password') || '')

    const hasil = skemaPengguna.safeParse({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        role: String(formData.get('role') || 'admin'),
        lokasi: String(formData.get('lokasi') || ''),
    })
    if (!hasil.success) return { fieldErrors: petaError(hasil.error) }

    if (!id && password.length < SANDI_MIN) {
        return { fieldErrors: { password: `Kata sandi minimal ${SANDI_MIN} karakter.` } }
    }
    if (password && password.length < SANDI_MIN) {
        return { fieldErrors: { password: `Kata sandi minimal ${SANDI_MIN} karakter.` } }
    }

    if (id && hasil.data.role !== 'superadmin' && (await superadminTerakhir(id))) {
        return {
            error:
                'Ini satu-satunya Super Admin. Rolenya tidak bisa diturunkan, karena tidak akan ada lagi yang bisa mengelola akun.',
        }
    }
    if (id === aktor.id && hasil.data.role !== 'superadmin') {
        return { error: 'Anda tidak bisa menurunkan role akun Anda sendiri.' }
    }

    const data = {
        name: hasil.data.name,
        email: hasil.data.email,
        role: hasil.data.role,
        lokasi: hasil.data.role === 'admin' ? hasil.data.lokasi || null : null,
        ...(password ? { password } : {}),
    }

    try {
        const payload = await getPayload({ config })
        if (id) {
            await payload.update({ collection: 'users', id, data, user: aktor, overrideAccess: false })
        } else {
            await payload.create({ collection: 'users', data, user: aktor, overrideAccess: false })
        }
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/pengguna')
    return { sukses: id ? 'Data pengguna tersimpan.' : 'Akun baru dibuat.' }
}

export async function hapusPengguna(_prev: FormState, formData: FormData): Promise<FormState> {
    const aktor = await requireSuperAdmin()
    const id = Number(formData.get('id'))
    if (!id) return { error: 'Pengguna tidak dikenali.' }

    if (id === aktor.id) return { error: 'Anda tidak bisa menghapus akun Anda sendiri.' }
    if (await superadminTerakhir(id)) {
        return {
            error:
                'Ini satu-satunya Super Admin. Akun ini tidak bisa dihapus, karena tidak akan ada lagi yang bisa mengelola sistem.',
        }
    }

    const payload = await getPayload({ config })

    // Artikel milik pengguna ini akan kehilangan penulis — beri tahu, jangan diam-diam.
    const { totalDocs } = await payload.count({
        collection: 'articles',
        where: { author: { equals: id } },
    })
    if (totalDocs > 0 && formData.get('konfirmasiArtikel') !== 'ya') {
        return {
            error: `Pengguna ini menulis ${totalDocs} artikel. Artikel tersebut akan kehilangan nama penulis. Centang persetujuan lalu hapus lagi bila memang ingin dilanjutkan.`,
        }
    }

    try {
        await payload.delete({ collection: 'users', id, user: aktor, overrideAccess: false })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/pengguna')
    return { sukses: 'Akun dihapus.' }
}

/** Ganti kata sandi sendiri — memverifikasi kata sandi lama lebih dulu. */
export async function gantiSandiSendiri(_prev: FormState, formData: FormData): Promise<FormState> {
    const user = await requireUser()
    const lama = String(formData.get('sandiLama') || '')
    const baru = String(formData.get('sandiBaru') || '')
    const ulang = String(formData.get('sandiUlang') || '')

    if (baru.length < SANDI_MIN) {
        return { fieldErrors: { sandiBaru: `Kata sandi baru minimal ${SANDI_MIN} karakter.` } }
    }
    if (baru !== ulang) {
        return { fieldErrors: { sandiUlang: 'Kata sandi ulangan tidak sama dengan yang baru.' } }
    }

    const payload = await getPayload({ config })
    try {
        await payload.login({ collection: 'users', data: { email: user.email, password: lama } })
    } catch {
        return { fieldErrors: { sandiLama: 'Kata sandi lama salah.' } }
    }

    try {
        await payload.update({
            collection: 'users',
            id: user.id,
            data: { password: baru },
            user,
            overrideAccess: false,
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    return { sukses: 'Kata sandi berhasil diganti.' }
}

export async function simpanProfilSendiri(_prev: FormState, formData: FormData): Promise<FormState> {
    const user = await requireUser()
    const nama = String(formData.get('name') || '').trim()
    if (!nama) return { fieldErrors: { name: 'Nama belum diisi.' } }

    try {
        const payload = await getPayload({ config })
        await payload.update({
            collection: 'users',
            id: user.id,
            data: { name: nama },
            user,
            overrideAccess: false,
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/akun')
    return { sukses: 'Profil tersimpan.' }
}
