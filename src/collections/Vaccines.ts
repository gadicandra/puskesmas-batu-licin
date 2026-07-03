import type { CollectionConfig } from 'payload'
import { isLoggedIn, unitScoped, publicReadUnitScoped } from '../access'
import { unitField } from '../fields/unit'
import { enforceUnit } from '../hooks/enforceUnit'

export const Vaccines: CollectionConfig = {
    slug: 'vaccines',
    labels: { singular: 'Vaksin', plural: 'Vaksin' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'jenis', 'stok', 'unit'],
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
        { name: 'jenis', type: 'text', admin: { description: 'mis. Campak, Polio, DPT-HB-Hib' } },
        {
            name: 'stok',
            type: 'number',
            required: true,
            defaultValue: 0,
            min: 0,
            admin: { description: 'Jumlah dosis tersedia.' },
        },
        {
            name: 'satuan',
            type: 'text',
            defaultValue: 'dosis',
        },
        { name: 'keterangan', type: 'textarea' },
        unitField,
    ],
}
