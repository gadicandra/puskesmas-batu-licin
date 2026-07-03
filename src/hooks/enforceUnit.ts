import type { CollectionBeforeChangeHook } from 'payload'

/** Paksa `unit` = unit milik user non-superadmin, agar admin unit tidak bisa
 *  membuat/memindahkan data ke unit lain lewat request yang dimodifikasi. */
export const enforceUnit: CollectionBeforeChangeHook = ({ req, data }) => {
    const user = req.user as { role?: string; unit?: string } | undefined
    if (user && user.role !== 'superadmin' && user.unit) {
        return { ...data, unit: user.unit }
    }
    return data
}
