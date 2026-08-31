import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { poliField } from '../fields/poli'

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
        { name: 'jadwalPraktik', type: 'text', admin: { description: 'mis. Senin–Jumat, 08.00–11.00' } },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
        poliField,
    ],
}
