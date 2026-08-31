import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access'

/** Pengaturan situs umum yang tampil di public side (footer, kontak). */
export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    label: 'Pengaturan Situs',
    admin: { group: 'Pengaturan' },
    access: {
        read: () => true,
        update: isSuperAdmin,
    },
    fields: [
        { name: 'namaInstansi', type: 'text', defaultValue: 'UPTD Puskesmas Batulicin' },
        { name: 'alamat', type: 'textarea' },
        { name: 'telepon', type: 'text' },
        { name: 'email', type: 'email' },
        {
            name: 'sosialMedia',
            type: 'array',
            labels: { singular: 'Akun', plural: 'Sosial Media' },
            fields: [
                { name: 'platform', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
            ],
        },
    ],
}
