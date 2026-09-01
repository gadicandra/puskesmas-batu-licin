/** Cara sebuah akun boleh masuk ke dashboard.
 *
 *  Daftar akun Google yang diizinkan TIDAK disimpan terpisah: koleksi `users`
 *  sendirilah daftarnya. Login Google hanya berhasil bila emailnya sudah
 *  terdaftar di /dashboard/pengguna dan metodenya mengizinkan Google. Dengan
 *  begitu hak akses (role) dan izin masuk tidak mungkin desinkron. */

export const METODE_LOGIN = ['sandi', 'google', 'keduanya'] as const

export type MetodeLogin = (typeof METODE_LOGIN)[number]

export const METODE_LOGIN_DEFAULT: MetodeLogin = 'sandi'

/** Label ditulis untuk staf non-teknis — tanpa istilah "OAuth"/"SSO". */
export const LABEL_METODE_LOGIN: Record<MetodeLogin, string> = {
    sandi: 'Email + kata sandi',
    google: 'Akun Google',
    keduanya: 'Email + kata sandi, atau akun Google',
}

export const opsiMetodeLogin = METODE_LOGIN.map((value) => ({
    label: LABEL_METODE_LOGIN[value],
    value,
}))

export function bolehLoginGoogle(metode: string | null | undefined): boolean {
    return metode === 'google' || metode === 'keduanya'
}

export function bolehLoginSandi(metode: string | null | undefined): boolean {
    // Akun lama (dibuat sebelum fitur ini) belum punya nilai — perlakukan sebagai 'sandi'
    // supaya tidak ada yang mendadak terkunci saat migrasi.
    return metode !== 'google'
}
