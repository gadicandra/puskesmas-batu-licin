import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

/** Struktur organisasi Puskesmas — memindahkan `data/struktur-organisasi.ts`
 *  ke database supaya bisa diperbarui staf tanpa menyentuh kode.
 *
 *  Hierarki dinyatakan lewat field `atasan` yang menunjuk ke dokumen lain di
 *  koleksi yang sama. Bentuk ini menahan perubahan struktur: menambah klaster
 *  atau memindahkan satu unit ke bawah pejabat lain cukup mengubah satu isian,
 *  bukan mengubah bentuk datanya. */
export const OrgChart: CollectionConfig = {
    slug: 'org-chart',
    labels: { singular: 'Jabatan', plural: 'Struktur Organisasi' },
    admin: {
        useAsTitle: 'jabatan',
        defaultColumns: ['jabatan', 'nama', 'atasan', 'urutan'],
        group: 'Profil',
    },
    access: {
        read: () => true, // tampil di public side
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    fields: [
        { name: 'jabatan', type: 'text', required: true },
        {
            name: 'nama',
            type: 'text',
            admin: { description: 'Nama pejabat. Kosongkan bila posisi sedang lowong.' },
        },
        { name: 'foto', type: 'upload', relationTo: 'media' },
        {
            name: 'atasan',
            type: 'relationship',
            relationTo: 'org-chart',
            admin: {
                description:
                    'Jabatan di atasnya. Kosongkan untuk Kepala Puskesmas (puncak struktur).',
            },
        },
        {
            name: 'urutan',
            type: 'number',
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                description: 'Urutan di antara jabatan dengan atasan yang sama.',
            },
        },
    ],
}
