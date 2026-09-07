import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'
import { alamatLogin, peranRute } from './akses'

/** Ambil user yang sedang login dari cookie Payload. `null` bila belum login. */
export async function getCurrentUser(): Promise<User | null> {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await nextHeaders() })
    return (user as User | null) ?? null
}

/** Alamat yang sedang dibuka, dititipkan `src/middleware.ts` lewat header
 *  `x-rute`. Server Component tidak punya cara lain membaca pathname-nya
 *  sendiri. `null` bila middleware tidak berjalan (mis. saat dipanggil dari
 *  skrip), dan pemanggilnya harus tetap jalan tanpa itu. */
async function ruteSekarang(): Promise<string | null> {
    return (await nextHeaders()).get('x-rute')
}

/** Wajib login. Bila belum, dialihkan ke halaman masuk — dengan membawa alamat
 *  yang tadi diminta, supaya sesudah masuk staf mendarat di tempat yang ia klik
 *  dan tidak perlu mencarinya lagi dari beranda. */
export async function requireUser(): Promise<User> {
    const user = await getCurrentUser()
    if (!user) redirect(alamatLogin(await ruteSekarang()))
    return user
}

/** Wajib superadmin. Dipakai halaman yang hanya boleh diakses pihak Puskesmas. */
export async function requireSuperAdmin(): Promise<User> {
    const user = await requireUser()
    if (user.role !== 'superadmin') redirect('/dashboard/tanpa-akses')
    return user
}

/**
 * Penjaga peran berdasarkan ALAMAT, bukan berdasarkan halaman yang menuliskan
 * penjaganya sendiri. Dipasang sekali di `dashboard/(app)/layout.tsx` sehingga
 * berlaku untuk seluruh rute di bawahnya — termasuk halaman baru yang lupa
 * memanggil `requireSuperAdmin`, yang sebelumnya bisa dibuka admin unit hanya
 * dengan mengetik alamatnya.
 *
 * Peran tiap rute dibaca dari `akses.ts`, daftar yang sama yang dipakai menu
 * sidebar — jadi menu yang disembunyikan dan rute yang dijaga tidak mungkin
 * berbeda.
 */
export async function requireAkses(): Promise<User> {
    const user = await requireUser()
    const rute = await ruteSekarang()
    // Tanpa header rute, penjaga ini tidak punya dasar menilai; `requireUser`
    // di atas dan penjaga di tiap halaman tetap berlaku.
    if (!rute) return user
    if (peranRute(rute) === 'superadmin' && user.role !== 'superadmin') {
        redirect('/dashboard/tanpa-akses')
    }
    return user
}

/** Apakah user boleh membuka menu khusus superadmin. */
export function isSuperAdmin(user: Pick<User, 'role'> | null): boolean {
    return user?.role === 'superadmin'
}
