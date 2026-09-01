import { createHash, randomBytes, timingSafeEqual } from 'crypto'

/** Alur "Masuk dengan Google" (OAuth 2.0 + OpenID Connect), ditulis langsung
 *  tanpa pustaka pihak ketiga karena yang dibutuhkan hanya satu alur baku:
 *  authorization code + PKCE. */

const URL_OTORISASI = 'https://accounts.google.com/o/oauth2/v2/auth'
const URL_TOKEN = 'https://oauth2.googleapis.com/token'

export const COOKIE_STATE = 'pkm_google_state'
export const COOKIE_VERIFIER = 'pkm_google_verifier'
/** Cukup untuk menyelesaikan satu kali login; sengaja pendek. */
export const UMUR_COOKIE_DETIK = 10 * 60
/** Cookie sementara dibatasi ke halaman login saja, dan path ini harus dipakai
 *  ulang saat menghapusnya. */
export const PATH_COOKIE = '/dashboard/login'

export type ProfilGoogle = {
    /** Penanda tetap akun Google. Tidak berubah walau email diganti. */
    sub: string
    email: string
    emailTerverifikasi: boolean
    nama: string | null
}

export function googleAktif(): boolean {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

function kredensial() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET belum diisi di .env')
    }
    return { clientId, clientSecret }
}

/** URL balikan yang didaftarkan di Google Cloud Console. `APP_URL` dipakai lebih
 *  dulu agar tetap benar di balik proxy/kontainer; origin request jadi cadangan
 *  supaya dev di localhost tidak perlu konfigurasi tambahan. */
export function redirectUri(originRequest: string): string {
    const dasar = (process.env.APP_URL || originRequest).replace(/\/+$/, '')
    return `${dasar}/dashboard/login/google/callback`
}

export function buatState(): string {
    return randomBytes(32).toString('base64url')
}

export function buatVerifier(): string {
    return randomBytes(48).toString('base64url')
}

function challengeDari(verifier: string): string {
    return createHash('sha256').update(verifier).digest('base64url')
}

/** Perbandingan state tahan timing attack, aman untuk panjang yang berbeda. */
export function stateCocok(a: string | undefined, b: string | undefined): boolean {
    if (!a || !b) return false
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
}

export function urlOtorisasi(args: {
    state: string
    verifier: string
    redirectUri: string
}): string {
    const { clientId } = kredensial()
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: args.redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state: args.state,
        code_challenge: challengeDari(args.verifier),
        code_challenge_method: 'S256',
        // Selalu tampilkan pemilih akun: komputer di Puskesmas sering dipakai bergantian.
        prompt: 'select_account',
    })
    return `${URL_OTORISASI}?${params.toString()}`
}

/** Tukar authorization code jadi profil Google. */
export async function ambilProfil(args: {
    code: string
    verifier: string
    redirectUri: string
}): Promise<ProfilGoogle> {
    const { clientId, clientSecret } = kredensial()

    const res = await fetch(URL_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: args.code,
            code_verifier: args.verifier,
            grant_type: 'authorization_code',
            redirect_uri: args.redirectUri,
        }),
        cache: 'no-store',
    })

    if (!res.ok) {
        throw new Error(`Google menolak penukaran kode (HTTP ${res.status}).`)
    }

    const data = (await res.json()) as { id_token?: string }
    if (!data.id_token) throw new Error('Google tidak mengirim id_token.')

    return bacaIdToken(data.id_token, clientId)
}

/** Baca klaim id_token.
 *
 *  Tanda tangannya tidak diverifikasi ulang, dan itu memang aman di sini: token
 *  ini kita ambil sendiri langsung dari endpoint token Google lewat HTTPS dengan
 *  client secret — bukan diterima dari browser. Google mendokumentasikan jalur
 *  ini sebagai jalur yang tidak memerlukan validasi tanda tangan. Klaim yang
 *  menentukan identitas tetap diperiksa. */
function bacaIdToken(idToken: string, clientId: string): ProfilGoogle {
    const bagian = idToken.split('.')
    if (bagian.length !== 3) throw new Error('Bentuk id_token tidak dikenali.')

    const klaim = JSON.parse(Buffer.from(bagian[1], 'base64url').toString('utf8')) as {
        iss?: string
        aud?: string
        exp?: number
        sub?: string
        email?: string
        email_verified?: boolean | string
        name?: string
    }

    const penerbitSah = klaim.iss === 'https://accounts.google.com' || klaim.iss === 'accounts.google.com'
    if (!penerbitSah) throw new Error('Penerbit id_token bukan Google.')
    if (klaim.aud !== clientId) throw new Error('id_token ditujukan untuk aplikasi lain.')
    if (!klaim.exp || klaim.exp * 1000 <= Date.now()) throw new Error('id_token sudah kedaluwarsa.')
    if (!klaim.sub || !klaim.email) throw new Error('id_token tidak memuat identitas akun.')

    return {
        sub: klaim.sub,
        email: klaim.email.trim().toLowerCase(),
        emailTerverifikasi: klaim.email_verified === true || klaim.email_verified === 'true',
        nama: klaim.name?.trim() || null,
    }
}
