import type { CollectionConfig } from 'payload'
import { isLoggedIn, unitScoped, publicReadUnitScoped } from '../access'
import { unitField } from '../fields/unit'
import { enforceUnit } from '../hooks/enforceUnit'

export const Doctors: CollectionConfig = {
    slug: 'doctors',
    labels: { singular: 'Dokter', plural: 'Dokter' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'spesialisasi', 'unit', 'aktif'],
        group: 'Layanan',
    },
    access: {
        read: publicReadUnitScoped,
        create: isLoggedIn,
        update: unitScoped,
        delete: unitScoped,
    },
    hooks: { beforeChange: [enforceUnit] },
    fields: [
        { name: 'nama', type: 'text', required: true },
        { name: 'spesialisasi', type: 'text', required: true },
        { name: 'foto', type: 'upload', relationTo: 'media' },
        { name: 'jadwalPraktik', type: 'text', admin: { description: 'mis. Senin–Jumat, 08.00–11.00' } },
        { name: 'aktif', type: 'checkbox', defaultValue: true },
        unitField,
    ],
}
