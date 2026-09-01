import { cookies as nextCookies } from 'next/headers'
import {
    createLocalReq,
    getFieldsToSign,
    getPayload,
    jwtSign,
    type Payload,
    type TypedUser,
} from 'payload'
import {
    addSessionToUser,
    generatePayloadCookie,
    generateExpiredPayloadCookie,
} from 'payload/shared'
import config from '@payload-config'

/** Satu tempat untuk urusan cookie sesi dashboard, dipakai oleh login kata sandi
 *  maupun login Google supaya keduanya menghasilkan sesi yang identik. */

/** Bentuk yang bisa langsung dipakai `cookies().set()` maupun
 *  `NextResponse.cookies.set()`. */
export type CookieSesi = {
    name: string
    value: string
    httpOnly?: boolean
    path?: string
    sameSite?: 'lax' | 'none' | 'strict'
    secure?: boolean
    domain?: string
    expires?: Date
}

type CookiePayload = {
    name: string
    value?: string
    httpOnly?: boolean
    path?: string
    sameSite?: string
    secure?: boolean
    domain?: string
    expires?: Date | string | number
}

function normalkan(cookie: CookiePayload, kedaluwarsa?: Date): CookieSesi {
    return {
        name: cookie.name,
        value: cookie.value ?? '',
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite?.toLowerCase() as CookieSesi['sameSite'],
        secure: cookie.secure,
        domain: cookie.domain,
        expires: kedaluwarsa ?? (cookie.expires ? new Date(cookie.expires) : undefined),
    }
}

/** Deskripsi cookie sesi untuk sebuah token — dipakai route handler yang perlu
 *  memasangnya pada `NextResponse`. */
export function cookieSesi(payload: Payload, token: string): CookieSesi {
    return normalkan(
        generatePayloadCookie({
            collectionAuthConfig: payload.collections.users.config.auth,
            cookiePrefix: payload.config.cookiePrefix,
            token,
            returnCookieAsObject: true,
        }) as CookiePayload
    )
}

/** Pasang cookie sesi Payload dari sebuah token login (untuk Server Action). */
export async function pasangCookieSesi(payload: Payload, token: string): Promise<void> {
    const { name, value, ...opsi } = cookieSesi(payload, token)
    const store = await nextCookies()
    store.set(name, value, opsi)
}

/** Hapus cookie sesi (logout). */
export async function hapusCookieSesi(payload: Payload): Promise<void> {
    const { name, ...opsi } = normalkan(
        generateExpiredPayloadCookie({
            collectionAuthConfig: payload.collections.users.config.auth,
            cookiePrefix: payload.config.cookiePrefix,
            returnCookieAsObject: true,
        }) as CookiePayload,
        new Date(0)
    )
    const store = await nextCookies()
    store.set(name, '', opsi)
}

/**
 * Terbitkan sesi Payload untuk user yang sudah diverifikasi di luar kata sandi
 * (dipakai login Google).
 *
 * Ini mengulang langkah yang sama dengan `payload.login()` — daftarkan sesi ke
 * dokumen user lalu tanda tangani JWT — memakai helper resmi yang diekspor
 * Payload (`addSessionToUser`, `getFieldsToSign`, `jwtSign`). Hasilnya token
 * `local-jwt` biasa, sehingga `payload.auth()`, masa berlaku sesi, dan logout
 * bekerja persis seperti login kata sandi. Jangan menandatangani JWT sendiri:
 * sejak Payload 3 sesi ikut dicatat di dokumen user (`auth.useSessions`), dan
 * token yang `sid`-nya tidak terdaftar akan ditolak.
 */
export async function terbitkanSesi(userId: number | string): Promise<string> {
    const payload = await getPayload({ config })
    const collectionConfig = payload.collections.users.config
    const req = await createLocalReq({}, payload)

    // `db.findOne` mengembalikan dokumen mentah (bertipe lebar) — justru itu yang
    // dibutuhkan `addSessionToUser`, karena ia ikut membaca & menulis `sessions`
    // yang tidak muncul di tipe `User` hasil generate.
    const user = (await payload.db.findOne({
        collection: 'users',
        req,
        where: { id: { equals: userId } },
    })) as TypedUser | null
    if (!user) throw new Error('Pengguna tidak ditemukan saat membuat sesi.')

    const { sid } = await addSessionToUser({ collectionConfig, payload, req, user })

    const fieldsToSign = getFieldsToSign({
        collectionConfig,
        email: user.email,
        sid,
        user,
    })

    const { token } = await jwtSign({
        fieldsToSign,
        secret: payload.secret,
        tokenExpiration: collectionConfig.auth.tokenExpiration,
    })

    return token
}
