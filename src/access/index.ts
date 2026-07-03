import type { Access, FieldAccess } from 'payload'

// Catatan: field `role`/`unit` di-`saveToJWT`, jadi tersedia di `req.user` tanpa query.
// Type payload-types belum tentu ter-regenerate saat helper ini ditulis, sehingga
// akses properti custom di-cast longgar agar tetap compile.
type AuthUser = { id: string | number; role?: string; unit?: string } | null | undefined

const asUser = (u: unknown): AuthUser => u as AuthUser

/** Hanya user terautentikasi. */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Hanya superadmin (akses penuh Puskesmas). */
export const isSuperAdmin: Access = ({ req: { user } }) => asUser(user)?.role === 'superadmin'

/** Superadmin penuh; selain itu hanya dokumen dirinya sendiri. */
export const superAdminOrSelf: Access = ({ req: { user } }) => {
    const u = asUser(user)
    if (!u) return false
    if (u.role === 'superadmin') return true
    return { id: { equals: u.id } }
}

/**
 * Superadmin melihat/ubah semua; admin unit dibatasi hanya dokumen unit-nya
 * (koleksi wajib punya field `unit`).
 */
export const unitScoped: Access = ({ req: { user } }) => {
    const u = asUser(user)
    if (!u) return false
    if (u.role === 'superadmin') return true
    if (u.unit) return { unit: { equals: u.unit } }
    return false
}

/**
 * Publik boleh baca semua (untuk public side web), tetapi di dalam admin panel
 * admin unit hanya melihat dokumen unit-nya; superadmin melihat semua.
 */
export const publicReadUnitScoped: Access = ({ req: { user } }) => {
    const u = asUser(user)
    if (!u) return true
    if (u.role === 'superadmin') return true
    if (u.unit) return { unit: { equals: u.unit } }
    return true
}

/** Field access: hanya superadmin boleh mengubah nilai field ini. */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
    asUser(user)?.role === 'superadmin'
