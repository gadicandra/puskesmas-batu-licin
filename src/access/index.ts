import type { Access, FieldAccess } from 'payload'

// Field `role` di-`saveToJWT`, jadi tersedia di `req.user` tanpa query.
// Cast longgar karena payload-types bisa belum ter-regenerate saat helper ditulis.
type AuthUser = { id: string | number; role?: string } | null | undefined
const asUser = (u: unknown): AuthUser => u as AuthUser

/** Hanya user terautentikasi. */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Hanya superadmin (Puskesmas) — akses penuh. */
export const isSuperAdmin: Access = ({ req: { user } }) => asUser(user)?.role === 'superadmin'

/** Superadmin penuh; selain itu hanya dokumen dirinya sendiri (untuk koleksi Users). */
export const superAdminOrSelf: Access = ({ req: { user } }) => {
    const u = asUser(user)
    if (!u) return false
    if (u.role === 'superadmin') return true
    return { id: { equals: u.id } }
}

/** Superadmin boleh semua; admin biasa hanya dokumen yang ia tulis (field `author`). */
export const superAdminOrAuthor: Access = ({ req: { user } }) => {
    const u = asUser(user)
    if (!u) return false
    if (u.role === 'superadmin') return true
    return { author: { equals: u.id } }
}

/** Field access: hanya superadmin boleh mengubah nilai field ini (mis. `role`). */
export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
    asUser(user)?.role === 'superadmin'
