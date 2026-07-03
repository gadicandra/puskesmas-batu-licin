import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'
import { poliField } from '../fields/poli'

export const Vaccines: CollectionConfig = {
    slug: 'vaccines',
    labels: { singular: 'Vaksin', plural: 'Vaksin' },
    admin: {
        useAsTitle: 'nama',
        defaultColumns: ['nama', 'jenis', 'stok', 'poli'],
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
        { name: 'jenis', type: 'text', admin: { description: 'mis. Campak, Polio, DPT-HB-Hib' } },
        {
            name: 'stok',
            type: 'number',
            required: true,
            defaultValue: 0,
            min: 0,
            admin: { description: 'Jumlah dosis tersedia.' },
        },
        { name: 'satuan', type: 'text', defaultValue: 'dosis' },
        { name: 'keterangan', type: 'textarea' },
        poliField,
    ],
}
