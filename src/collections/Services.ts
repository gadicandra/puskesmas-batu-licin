import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { slugField } from '../fields/slug'

/** Katalog layanan kesehatan — satu sumber untuk semua tempat yang menyebut
 *  nama layanan (halaman Layanan, daftar layanan tiap Posyandu, dsb).
 *
 *  Sengaja jadi koleksi tersendiri, bukan daftar teks di dalam Posyandu:
 *  "Imunisasi" yang sama dilayani banyak posyandu, dan mengganti namanya harus
 *  cukup sekali. Bentuk ini juga yang memungkinkan pertanyaan dijawab dua arah
 *  — "layanan apa saja di Posyandu Melati" DAN "posyandu mana yang melayani
 *  imunisasi".
 *
 *  Daftar awalnya mengikuti SK B/445.61/003/PKM.Btl-Adm/I/2023. */
export const Services: CollectionConfig = {
    slug: 'services',
    labels: { singular: 'Layanan', plural: 'Layanan' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'kategori', 'induk', 'urutan', 'aktif'],
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
        slugField('nama'),
        {
            // Jenjang layanan dinyatakan lewat relasi ke koleksi ini sendiri,
            // pola yang sama dengan `org-chart`. SK memang berjenjang:
            // Laboratorium → Pemeriksaan Serologi → Widal Test, dan
            // UKM Esensial → Pelayanan KIA-KB → Posyandu Balita.
            //
            // Halaman daftar hanya menampilkan layanan tanpa induk; sub-layanan
            // muncul di halaman detail masing-masing.
            name: 'induk',
            type: 'relationship',
            relationTo: 'services',
            label: 'Bagian dari',
            admin: {
                description:
                    'Kosongkan bila ini layanan utama. Isi bila ini rincian dari layanan lain.',
            },
        },
        {
            name: 'jadwal',
            type: 'text',
            admin: {
                description:
                    'Mis. "Senin–Kamis 08.00–11.00", "24 jam", "Sesuai Jadwal", "Jika ada kasus".',
            },
        },
        {
            name: 'kategori',
            type: 'select',
            required: true,
            defaultValue: 'dalam-gedung',
            options: [
                { label: 'Dalam Gedung', value: 'dalam-gedung' },
                { label: 'Luar Gedung (UKM)', value: 'luar-gedung' },
                { label: 'Posyandu', value: 'posyandu' },
            ],
        },
        {
            // Satu gambar, dipakai dua kali: sebagai sampul kartu di /layanan
            // dan sebagai latar hero di /layanan/<slug>. Sengaja bukan dua
            // field terpisah — mengisi dua foto per layanan hampir pasti tidak
            // akan dikerjakan, dan yang kedua akan terus kosong.
            name: 'gambar',
            type: 'upload',
            relationTo: 'media',
            label: 'Foto layanan',
            admin: {
                description:
                    'Tampil sebagai sampul di halaman Layanan. Boleh dikosongkan.',
            },
        },
        {
            name: 'deskripsi',
            type: 'textarea',
            admin: { description: 'Penjelasan singkat untuk warga. Hindari istilah medis yang tidak umum.' },
        },
        {
            name: 'persyaratan',
            type: 'array',
            label: 'Syarat & Berkas yang Dibawa',
            labels: { singular: 'Syarat', plural: 'Syarat' },
            fields: [{ name: 'isi', type: 'text', required: true }],
            admin: { description: 'Mis. "Kartu BPJS", "KTP asli". Satu baris satu syarat.' },
        },
        {
            name: 'urutan',
            type: 'number',
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                description: 'Angka lebih kecil tampil lebih dulu. Isi 0 bila tidak ingin diatur.',
            },
        },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
    ],
}
