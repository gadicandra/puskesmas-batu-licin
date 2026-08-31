import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'

/** Ambil user yang sedang login dari cookie Payload. `null` bila belum login. */
export async function getCurrentUser(): Promise<User | null> {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await nextHeaders() })
    return (user as User | null) ?? null
}

/** Wajib login. Bila belum, dialihkan ke halaman masuk. */
export async function requireUser(): Promise<User> {
    const user = await getCurrentUser()
    if (!user) redirect('/dashboard/login')
    return user
}

/** Wajib superadmin. Dipakai halaman yang hanya boleh diakses pihak Puskesmas. */
export async function requireSuperAdmin(): Promise<User> {
    const user = await requireUser()
    if (user.role !== 'superadmin') redirect('/dashboard/tanpa-akses')
    return user
}

/** Apakah user boleh membuka menu khusus superadmin. */
export function isSuperAdmin(user: Pick<User, 'role'> | null): boolean {
    return user?.role === 'superadmin'
}
