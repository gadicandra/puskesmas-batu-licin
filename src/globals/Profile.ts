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
        { name: 'visi', type: 'textarea' },
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
