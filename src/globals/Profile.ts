import type { GlobalConfig } from 'payload'
import { isSuperAdmin } from '../access'

/** Profil kelembagaan: visi, misi, motto, budaya kerja, maklumat pelayanan.
 *
 *  Sekarang isinya masih tertulis langsung di komponen
 *  `src/components/profil/content/*`. Semua teks di sana termasuk yang wajib
 *  bisa diperbarui staf — visi dan misi berubah mengikuti RPJMD, maklumat
 *  pelayanan berubah mengikuti SK — jadi tempatnya di database, bukan di kode.
 *
 *  Dibuat sebagai global, bukan koleksi, karena isinya persis satu dokumen. */
export const Profile: GlobalConfig = {
    slug: 'profile',
    label: 'Profil Puskesmas',
    admin: { group: 'Profil' },
    access: {
        read: () => true, // publik
        update: isSuperAdmin,
    },
    fields: [
        {
            // Data kelembagaan & wilayah kerja. Angka-angka ini dikutip di
            // halaman profil dan bahan presentasi, jadi harus bisa diperbarui
            // staf tanpa menyentuh kode.
            type: 'collapsible',
            label: 'Data Kelembagaan',
            fields: [
                { name: 'kodePuskesmas', type: 'text', label: 'Kode Puskesmas' },
                { name: 'kepalaPuskesmas', type: 'text', label: 'Kepala Puskesmas' },
                {
                    name: 'kategori',
                    type: 'text',
                    admin: { description: 'Mis. Perkotaan / Pedesaan' },
                },
                {
                    name: 'jenis',
                    type: 'text',
                    admin: { description: 'Mis. Puskesmas Non Perawatan' },
                },
                { name: 'letak', type: 'text', admin: { description: 'Mis. Ibu Kota Kab/Kota' } },
                { name: 'topografi', type: 'text', admin: { description: 'Mis. Perbatasan' } },
            ],
        },
        {
            type: 'collapsible',
            label: 'Wilayah Kerja',
            fields: [
                { name: 'luasWilayah', type: 'text', admin: { description: 'Mis. 105,760 Km²' } },
                {
                    name: 'jumlahDesa',
                    type: 'text',
                    label: 'Jumlah Desa/Kelurahan',
                    admin: { description: 'Mis. 9 (7 Desa, 2 Kelurahan)' },
                },
                { name: 'jumlahRT', type: 'number', label: 'Jumlah RT' },
                { name: 'jumlahPenduduk', type: 'number', label: 'Jumlah Penduduk' },
                { name: 'jumlahKK', type: 'number', label: 'Jumlah KK' },
            ],
        },
        { name: 'visi', type: 'textarea' },
        {
            // Visi di sumber data adalah visi Kabupaten (RPJMD), bukan visi
            // Puskesmas sendiri. Atributnya wajib ikut tampil supaya pembaca
            // tidak salah mengira itu rumusan Puskesmas.
            name: 'sumberVisi',
            type: 'text',
            label: 'Sumber / Atribusi Visi',
            admin: { description: 'Mis. "Visi pembangunan Kabupaten Tanah Bumbu, RPJMD 2025–2029"' },
        },
        {
            name: 'misi',
            type: 'array',
            labels: { singular: 'Butir Misi', plural: 'Misi' },
            fields: [{ name: 'isi', type: 'textarea', required: true }],
        },
        { name: 'motto', type: 'text' },
        {
            name: 'maklumatPelayanan',
            type: 'textarea',
            label: 'Maklumat Pelayanan',
        },
        {
            name: 'budayaKerja',
            type: 'array',
            label: 'Budaya Kerja',
            labels: { singular: 'Kelompok', plural: 'Budaya Kerja' },
            fields: [
                {
                    name: 'judul',
                    type: 'text',
                    required: true,
                    admin: { description: 'Mis. "5S" atau "5R"' },
                },
                {
                    name: 'keterangan',
                    type: 'text',
                    admin: { description: 'Mis. "Pelayanan kepada masyarakat"' },
                },
                {
                    name: 'butir',
                    type: 'array',
                    labels: { singular: 'Butir', plural: 'Butir' },
                    fields: [{ name: 'isi', type: 'text', required: true }],
                },
            ],
        },
        {
            name: 'sejarah',
            type: 'textarea',
            admin: { description: 'Riwayat singkat berdirinya Puskesmas. Boleh dikosongkan.' },
        },
    ],
}
