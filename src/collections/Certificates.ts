import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

export const Certificates: CollectionConfig = {
    slug: 'certificates',
    labels: { singular: 'Sertifikat', plural: 'Sertifikat' },
    admin: {
        useAsTitle: 'judul',
        defaultColumns: ['judul', 'jenis', 'penerbit', 'tanggal'],
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
        {
            // Akreditasi dan penghargaan tampil di tempat berbeda dan berbentuk
            // berbeda, tapi isinya sama-sama "dokumen bergambar + tanggal +
            // penerbit". Satu field pembeda lebih ringan daripada koleksi kedua,
            // dan `ambilSertifikat({ jenis })` tetap memisahkannya untuk UI.
            name: 'jenis',
            type: 'select',
            required: true,
            defaultValue: 'akreditasi',
            options: [
                { label: 'Sertifikat Akreditasi', value: 'akreditasi' },
                { label: 'Piagam Penghargaan', value: 'penghargaan' },
            ],
        },
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
