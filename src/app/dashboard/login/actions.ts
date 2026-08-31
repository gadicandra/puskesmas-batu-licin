'use server'

import { cookies as nextCookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { generatePayloadCookie, generateExpiredPayloadCookie } from 'payload/shared'
import config from '@payload-config'

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
    try {
        const hasil = await payload.login({
            collection: 'users',
            data: { email, password },
        })
        token = hasil.token
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

    if (!token) {
        return { error: 'Gagal membuat sesi. Coba lagi.' }
    }

    const cookie = generatePayloadCookie({
        collectionAuthConfig: payload.collections.users.config.auth,
        cookiePrefix: payload.config.cookiePrefix,
        token,
        returnCookieAsObject: true,
    })

    const store = await nextCookies()
    store.set(cookie.name, cookie.value ?? '', {
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite?.toLowerCase() as 'lax' | 'none' | 'strict' | undefined,
        secure: cookie.secure,
        domain: cookie.domain,
        expires: cookie.expires ? new Date(cookie.expires) : undefined,
    })

    redirect('/dashboard')
}

/** Keluar dari dashboard: hapus cookie sesi. */
export async function logoutAction(): Promise<void> {
    const payload = await getPayload({ config })
    const cookie = generateExpiredPayloadCookie({
        collectionAuthConfig: payload.collections.users.config.auth,
        cookiePrefix: payload.config.cookiePrefix,
        returnCookieAsObject: true,
    })

    const store = await nextCookies()
    store.set(cookie.name, '', {
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite?.toLowerCase() as 'lax' | 'none' | 'strict' | undefined,
        secure: cookie.secure,
        domain: cookie.domain,
        expires: new Date(0),
    })

    redirect('/dashboard/login')
}
