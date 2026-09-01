import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

/** Fasilitas yang tersedia di Puskesmas — ruang, alat, dan sarana penunjang. */
export const Facilities: CollectionConfig = {
    slug: 'facilities',
    labels: { singular: 'Fasilitas', plural: 'Fasilitas' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'kategori', 'jumlah', 'aktif'],
        group: 'Profil',
    },
    access: {
        read: () => true, // tampil di public side
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        { name: 'nama', type: 'text', required: true },
        {
            name: 'kategori',
            type: 'select',
            required: true,
            defaultValue: 'ruang',
            options: [
                { label: 'Ruang Pelayanan', value: 'ruang' },
                { label: 'Ruang Kantor', value: 'kantor' },
                { label: 'Alat Kesehatan', value: 'alat' },
                { label: 'Kendaraan', value: 'kendaraan' },
                { label: 'Sarana Penunjang', value: 'penunjang' },
            ],
        },
        { name: 'deskripsi', type: 'textarea' },
        {
            name: 'jumlah',
            type: 'number',
            admin: { description: 'Banyaknya unit. Kosongkan bila tidak relevan.' },
        },
        { name: 'foto', type: 'upload', relationTo: 'media' },
        {
            name: 'urutan',
            type: 'number',
            defaultValue: 0,
            admin: { position: 'sidebar', description: 'Angka lebih kecil tampil lebih dulu.' },
        },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
    ],
}
