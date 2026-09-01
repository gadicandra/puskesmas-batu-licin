import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
    COOKIE_STATE,
    COOKIE_VERIFIER,
    ambilProfil,
    googleAktif,
    redirectUri,
    stateCocok,
    PATH_COOKIE,
} from '@/lib/dashboard/google'
import { bolehLoginGoogle } from '@/lib/dashboard/metode-login'
import { cookieSesi, terbitkanSesi } from '@/lib/dashboard/sesi'

export const dynamic = 'force-dynamic'

function kembaliDenganGalat(req: NextRequest, kode: string) {
    const res = NextResponse.redirect(new URL(`/dashboard/login?galat=${kode}`, req.url))
    bersihkanCookieSementara(res)
    return res
}

/** Cookie state/verifier dipasang dengan path terbatas, jadi penghapusannya
 *  harus menyebut path yang sama. */
function bersihkanCookieSementara(res: NextResponse) {
    res.cookies.delete({ name: COOKIE_STATE, path: PATH_COOKIE })
    res.cookies.delete({ name: COOKIE_VERIFIER, path: PATH_COOKIE })
}

/** Langkah 2 "Masuk dengan Google": Google mengembalikan pengguna ke sini.
 *
 *  Izin masuk ditentukan sepenuhnya oleh koleksi `users`: email hasil verifikasi
 *  Google harus sudah terdaftar DAN metode loginnya mengizinkan Google. Akun di
 *  luar itu ditolak — tidak ada pembuatan akun otomatis. */
export async function GET(req: NextRequest) {
    if (!googleAktif()) return kembaliDenganGalat(req, 'nonaktif')

    const params = req.nextUrl.searchParams
    if (params.get('error')) return kembaliDenganGalat(req, 'dibatalkan')

    const code = params.get('code')
    const state = params.get('state') ?? undefined
    const stateTersimpan = req.cookies.get(COOKIE_STATE)?.value
    const verifier = req.cookies.get(COOKIE_VERIFIER)?.value

    if (!code || !verifier || !stateCocok(state, stateTersimpan)) {
        return kembaliDenganGalat(req, 'state')
    }

    let profil
    try {
        profil = await ambilProfil({
            code,
            verifier,
            redirectUri: redirectUri(req.nextUrl.origin),
        })
    } catch {
        return kembaliDenganGalat(req, 'gagal')
    }

    if (!profil.emailTerverifikasi) return kembaliDenganGalat(req, 'belum-verifikasi')

    const payload = await getPayload({ config })

    // overrideAccess disengaja: pada titik ini belum ada user yang login, jadi
    // belum ada siapa pun yang bisa dijadikan aktor. Otorisasinya justru
    // dikerjakan oleh pemeriksaan di bawah.
    const { docs } = await payload.find({
        collection: 'users',
        where: { email: { equals: profil.email } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
    })
    const user = docs[0]

    if (!user) return kembaliDenganGalat(req, 'tidak-terdaftar')
    if (!bolehLoginGoogle(user.metodeLogin)) return kembaliDenganGalat(req, 'bukan-google')

    // Akun Google terikat ke `sub`, bukan ke email. Google bisa melepas sebuah
    // alamat dan memberikannya ke orang lain; tanpa ikatan ini pemilik baru
    // alamat tersebut akan mewarisi akses.
    if (user.googleSub && user.googleSub !== profil.sub) {
        return kembaliDenganGalat(req, 'akun-lain')
    }

    if (!user.googleSub) {
        await payload.update({
            collection: 'users',
            id: user.id,
            data: {
                googleSub: profil.sub,
                ...(user.name ? {} : { name: profil.nama }),
            },
            overrideAccess: true,
        })
    }

    let token: string
    try {
        token = await terbitkanSesi(user.id)
    } catch {
        return kembaliDenganGalat(req, 'gagal')
    }

    const res = NextResponse.redirect(new URL('/dashboard', req.url))
    const { name, value, ...opsi } = cookieSesi(payload, token)
    res.cookies.set(name, value, opsi)
    bersihkanCookieSementara(res)
    return res
}
