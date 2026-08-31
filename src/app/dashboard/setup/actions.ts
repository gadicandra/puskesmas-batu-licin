'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { pesanError } from '@/lib/dashboard/errors'

export type SetupState = { error?: string }

/** Membuat akun Super Admin pertama. HANYA berfungsi saat belum ada satu pun
 *  pengguna — setelah itu mati sendiri. Halaman ini menggantikan layar
 *  "create first user" bawaan Payload yang ikut hilang bersama /admin. */
export async function buatAkunPertama(_prev: SetupState, formData: FormData): Promise<SetupState> {
    const payload = await getPayload({ config })

    // Penjagaan sebenarnya ada di sini, bukan di UI.
    const { totalDocs } = await payload.count({ collection: 'users' })
    if (totalDocs > 0) {
        return { error: 'Akun sudah pernah dibuat. Halaman ini tidak bisa dipakai lagi.' }
    }

    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const ulang = String(formData.get('passwordUlang') || '')

    if (!name) return { error: 'Nama belum diisi.' }
    if (!email) return { error: 'Email belum diisi.' }
    if (password.length < 8) return { error: 'Kata sandi minimal 8 karakter.' }
    if (password !== ulang) return { error: 'Kata sandi ulangan tidak sama.' }

    try {
        // Hook beforeChange di Users otomatis menjadikan akun pertama superadmin.
        await payload.create({
            collection: 'users',
            data: { name, email, password, role: 'superadmin' },
            overrideAccess: true, // belum ada user yang bisa dipakai sebagai aktor
        })
    } catch (err) {
        return { error: pesanError(err) }
    }

    redirect('/dashboard/login?baru=1')
}
