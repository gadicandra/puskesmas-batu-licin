import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

export const Certificates: CollectionConfig = {
    slug: 'certificates',
    labels: { singular: 'Sertifikat', plural: 'Sertifikat' },
    admin: {
        useAsTitle: 'judul',
        defaultColumns: ['judul', 'penerbit', 'tanggal'],
        group: 'Profil',
    },
    access: {
        read: () => true, // tampil di public side
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        { name: 'judul', type: 'text', required: true },
        { name: 'penerbit', type: 'text' },
        { name: 'tanggal', type: 'date' },
        {
            name: 'berkas',
            type: 'upload',
            relationTo: 'media',
            required: true,
            admin: { description: 'Scan/berkas sertifikat (gambar atau PDF).' },
        },
        { name: 'keterangan', type: 'textarea' },
    ],
}
