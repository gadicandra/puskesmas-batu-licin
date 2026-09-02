import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { poliField } from '../fields/poli'

export const MedicalStaff: CollectionConfig = {
    slug: 'medical-staff',
    labels: { singular: 'Tenaga Medis', plural: 'Tenaga Medis' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'jabatanLengkap', 'jabatan', 'aktif'],
        group: 'Layanan',
    },
    access: {
        read: () => true,
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        { name: 'nama', type: 'text', required: true },
        {
            name: 'jabatan',
            type: 'select',
            required: true,
            options: [
                { label: 'Dokter', value: 'dokter' },
                { label: 'Perawat', value: 'perawat' },
                { label: 'Bidan', value: 'bidan' },
                { label: 'Apoteker', value: 'apoteker' },
                { label: 'Analis Laboratorium', value: 'analis' },
                { label: 'Ahli Gizi', value: 'gizi' },
                { label: 'Sanitarian', value: 'sanitarian' },
                { label: 'Tenaga Administrasi', value: 'administrasi' },
                { label: 'Lainnya', value: 'lainnya' },
            ],
        },
        {
            // Jabatan fungsional lengkap seperti tertulis di dokumen kepegawaian,
            // mis. "Perawat Ahli Madya". `jabatan` di atas hanya kategori kasar
            // untuk mengelompokkan & menyaring; jenjangnya ada di sini. Tanpa
            // field ini, "Pranata Lab. Kes. Penyelia" menyusut jadi "analis"
            // dan jenjang yang jadi identitas profesionalnya hilang.
            name: 'jabatanLengkap',
            type: 'text',
            label: 'Jabatan Fungsional Lengkap',
            admin: { description: 'Mis. "Perawat Ahli Madya". Inilah yang tampil di situs.' },
        },
        { name: 'foto', type: 'upload', relationTo: 'media' },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
        poliField,
    ],
}
