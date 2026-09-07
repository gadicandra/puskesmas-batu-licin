import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { poliField } from '../fields/poli'
import { HARI } from '../lib/hari'

export const Doctors: CollectionConfig = {
    slug: 'doctors',
    labels: { singular: 'Dokter', plural: 'Dokter' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'spesialisasi', 'poli', 'aktif'],
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
        { name: 'spesialisasi', type: 'text', required: true },
        { name: 'foto', type: 'upload', relationTo: 'media' },
        {
            // Terstruktur, bukan teks bebas. Teks seperti "Senin–Jumat, 08.00–11.00"
            // tidak bisa dirender jadi tabel jadwal, diurutkan, atau dipakai
            // menjawab "dokter siapa yang praktik hari ini" — padahal justru itu
            // yang dibutuhkan halaman dokter.
            name: 'jadwalPraktik',
            type: 'array',
            label: 'Jadwal Praktik',
            labels: { singular: 'Jadwal', plural: 'Jadwal Praktik' },
            fields: [
                { name: 'hari', type: 'select', required: true, options: [...HARI] },
                {
                    name: 'jamMulai',
                    type: 'text',
                    required: true,
                    admin: { description: 'Format 24 jam, mis. 08.00' },
                },
                {
                    name: 'jamSelesai',
                    type: 'text',
                    required: true,
                    admin: { description: 'Format 24 jam, mis. 11.00' },
                },
            ],
        },
        {
            name: 'pendidikan',
            type: 'text',
            admin: { description: 'Pendidikan terakhir, mis. S1 Kedokteran Universitas Lambung Mangkurat' },
        },
        {
            name: 'nomorSTR',
            type: 'text',
            label: 'Nomor STR',
            admin: { description: 'Surat Tanda Registrasi. Kosongkan bila belum tersedia.' },
        },
        {
            name: 'deskripsi',
            type: 'textarea',
            admin: { description: 'Perkenalan singkat yang tampil di halaman profil dokter.' },
        },
        {
            // Relasi sungguhan ke koleksi `services`, bukan menumpang `poli`.
            // `poli` adalah daftar select statis di lib/units.ts yang tidak
            // punya slug dan tidak sinkron dengan isi `services`; memetakannya
            // lewat kecocokan nama akan diam-diam mengosongkan "Tim Dokter" di
            // halaman layanan begitu ada nama yang diubah.
            name: 'layanan',
            type: 'relationship',
            relationTo: 'services',
            hasMany: true,
            label: 'Bertugas di layanan',
            admin: {
                description:
                    'Dokter akan tampil di halaman layanan yang dipilih. Boleh lebih dari satu.',
            },
        },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
        poliField,
    ],
}
