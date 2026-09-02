import { NextResponse, type NextRequest } from 'next/server'
import {
    COOKIE_LANJUT,
    COOKIE_STATE,
    COOKIE_VERIFIER,
    UMUR_COOKIE_DETIK,
    buatState,
    buatVerifier,
    googleAktif,
    PATH_COOKIE,
    redirectUri,
    urlOtorisasi,
} from '@/lib/dashboard/google'
import { tujuanAman } from '@/lib/dashboard/akses'

export const dynamic = 'force-dynamic'

/** Langkah 1 "Masuk dengan Google": antar pengguna ke halaman izin Google.
 *  `state` menahan CSRF, `code_verifier` (PKCE) menahan penyalahgunaan kode
 *  yang tercuri. Keduanya disimpan di cookie httpOnly berumur pendek. */
export async function GET(req: NextRequest) {
    if (!googleAktif()) {
        return NextResponse.redirect(new URL('/dashboard/login?galat=nonaktif', req.url))
    }

    const state = buatState()
    const verifier = buatVerifier()
    const balikan = redirectUri(req.nextUrl.origin)

    const res = NextResponse.redirect(urlOtorisasi({ state, verifier, redirectUri: balikan }))

    const opsi = {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: req.nextUrl.protocol === 'https:',
        path: PATH_COOKIE,
        maxAge: UMUR_COOKIE_DETIK,
    }
    res.cookies.set(COOKIE_STATE, state, opsi)
    res.cookies.set(COOKIE_VERIFIER, verifier, opsi)

    const lanjut = req.nextUrl.searchParams.get('lanjut')
    if (tujuanAman(lanjut)) res.cookies.set(COOKIE_LANJUT, lanjut as string, opsi)

    return res
}
