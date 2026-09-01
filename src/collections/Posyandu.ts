import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { HARI } from '../lib/hari'

/** Posyandu di wilayah kerja Puskesmas Batulicin, beserta layanan yang
 *  tersedia di masing-masing. */
export const Posyandu: CollectionConfig = {
    slug: 'posyandu',
    labels: { singular: 'Posyandu', plural: 'Posyandu' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'alamat', 'penanggungJawab', 'aktif'],
        group: 'Layanan',
    },
    access: {
        read: () => true, // tampil di public side
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        { name: 'nama', type: 'text', required: true },
        { name: 'alamat', type: 'textarea' },
        {
            // Relasi ke katalog, bukan daftar teks. Nama layanan cukup diperbaiki
            // sekali di koleksi Layanan dan ikut berubah di semua posyandu.
            name: 'layanan',
            type: 'relationship',
            relationTo: 'services',
            hasMany: true,
            admin: { description: 'Layanan yang tersedia di posyandu ini.' },
        },
        {
            name: 'jadwal',
            type: 'array',
            label: 'Jadwal Kegiatan',
            labels: { singular: 'Jadwal', plural: 'Jadwal' },
            fields: [
                { name: 'hari', type: 'select', required: true, options: [...HARI] },
                {
                    name: 'keterangan',
                    type: 'text',
                    admin: { description: 'Mis. "Minggu ke-2 setiap bulan, 08.00–11.00"' },
                },
            ],
        },
        { name: 'penanggungJawab', type: 'text', label: 'Penanggung Jawab' },
        {
            name: 'kontak',
            type: 'text',
            admin: { description: 'Nomor telepon kader atau penanggung jawab. Boleh dikosongkan.' },
        },
        {
            name: 'urutan',
            type: 'number',
            defaultValue: 0,
            admin: { position: 'sidebar', description: 'Angka lebih kecil tampil lebih dulu.' },
        },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
    ],
}
