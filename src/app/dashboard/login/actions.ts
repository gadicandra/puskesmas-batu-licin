'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { bolehLoginSandi } from '@/lib/dashboard/metode-login'
import { pasangCookieSesi, hapusCookieSesi } from '@/lib/dashboard/sesi'

export type LoginState = { error?: string }

/** Masuk ke dashboard. Memakai auth Payload (hash password, JWT) lalu memasang
 *  cookie sesi yang sama dengan yang dipakai Local API `payload.auth()`. */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')

    if (!email || !password) {
        return { error: 'Email dan kata sandi wajib diisi.' }
    }

    const payload = await getPayload({ config })

    let token: string | undefined
    let metodeLogin: string | null | undefined
    try {
        const hasil = await payload.login({
            collection: 'users',
            data: { email, password },
        })
        token = hasil.token
        metodeLogin = hasil.user?.metodeLogin
    } catch (err) {
        const pesan = err instanceof Error ? err.message : ''
        // Payload mengunci akun setelah beberapa kali gagal (maxLoginAttempts).
        if (/locked/i.test(pesan)) {
            return {
                error:
                    'Akun terkunci sementara karena terlalu banyak percobaan masuk. Coba lagi dalam 10 menit.',
            }
        }
        // Sengaja tidak membedakan "email salah" dan "kata sandi salah".
        return { error: 'Email atau kata sandi salah.' }
    }

    // Diperiksa setelah kata sandi terbukti benar, supaya pesan ini tidak bisa
    // dipakai menebak akun mana yang ada.
    if (!bolehLoginSandi(metodeLogin)) {
        return {
            error:
                'Akun ini disetel untuk masuk memakai akun Google. Gunakan tombol "Masuk dengan Google" di atas.',
        }
    }

    if (!token) {
        return { error: 'Gagal membuat sesi. Coba lagi.' }
    }

    await pasangCookieSesi(payload, token)
    redirect('/dashboard')
}

/** Keluar dari dashboard: hapus cookie sesi. */
export async function logoutAction(): Promise<void> {
    const payload = await getPayload({ config })
    await hapusCookieSesi(payload)
    redirect('/dashboard/login')
}
