import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

/** Angka kunjungan yang dilayani, dari e-Puskesmas.
 *
 *  Disimpan sebagai baris (periode + kelompok + label + jumlah), bukan sebagai
 *  satu dokumen berisi tabel. Bentuk ini yang membuat angkanya bisa dirender
 *  jadi grafik, dibandingkan antar tahun, dan ditambah tiap periode tanpa
 *  mengubah skema.
 *
 *  Jangan dikacaukan dengan koleksi `page-views`: itu statistik kunjungan
 *  WEBSITE yang dikumpulkan sendiri oleh `/api/track`. Yang ini kunjungan
 *  PASIEN ke Puskesmas, disalin dari sistem e-Puskesmas. */
export const ServiceStatistics: CollectionConfig = {
    slug: 'service-statistics',
    labels: { singular: 'Angka Pelayanan', plural: 'Angka Pelayanan' },
    admin: {
        useAsTitle: 'label',
        defaultColumns: ['periode', 'kelompok', 'label', 'jumlah'],
        group: 'Layanan',
    },
    access: {
        read: () => true, // tampil di public side
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        {
            name: 'periode',
            type: 'text',
            required: true,
            admin: { description: 'Mis. "2025". Satu periode = satu kumpulan angka.' },
        },
        {
            name: 'kelompok',
            type: 'select',
            required: true,
            options: [
                { label: 'Menurut Kelompok Umur', value: 'umur' },
                { label: 'Menurut Jaminan/Asuransi', value: 'asuransi' },
                { label: 'Menurut Poli/Klaster', value: 'poli' },
                { label: 'Menurut Status Pulang', value: 'status-pulang' },
            ],
        },
        {
            name: 'label',
            type: 'text',
            required: true,
            admin: { description: 'Mis. "Balita (0-5 Tahun)", "BPJS Kesehatan".' },
        },
        { name: 'jumlah', type: 'number', required: true },
        {
            name: 'urutan',
            type: 'number',
            defaultValue: 0,
            admin: { position: 'sidebar', description: 'Urutan tampil dalam kelompoknya.' },
        },
        {
            name: 'sumber',
            type: 'text',
            admin: {
                description:
                    'Dari mana angkanya diambil, mis. "e-Puskesmas, diakses 31 Januari 2026".',
            },
        },
    ],
}
