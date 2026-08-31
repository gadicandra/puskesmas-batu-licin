import type { CollectionConfig } from 'payload'
import { isLoggedIn, isSuperAdmin } from '../access'

/** Log kunjungan halaman publik untuk statistik dashboard. Ditulis oleh route
 *  publik `/api/track`; dibaca hanya oleh admin. */
export const PageViews: CollectionConfig = {
    slug: 'page-views',
    labels: { singular: 'Kunjungan', plural: 'Kunjungan' },
    admin: {
        useAsTitle: 'path',
        defaultColumns: ['path', 'createdAt'],
        group: 'Analitik',
    },
    timestamps: true,
    access: {
        read: isLoggedIn,
        // Ditulis HANYA lewat route `/api/track` (memakai Local API/overrideAccess).
        // REST publik `/api/page-views` sengaja ditutup supaya tidak bisa dibanjiri.
        create: () => false,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        { name: 'path', type: 'text', required: true, index: true },
        { name: 'referrer', type: 'text' },
        { name: 'uaHash', type: 'text', index: true },
    ],
}
