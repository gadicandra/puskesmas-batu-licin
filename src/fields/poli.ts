import type { Field } from 'payload'
import { unitOptions } from '../lib/units'

/** Poli/unit layanan terkait sebuah data (kategorisasi, bukan kontrol akses). */
export const poliField: Field = {
    name: 'poli',
    type: 'select',
    options: [...unitOptions],
    admin: {
        position: 'sidebar',
        description: 'Poli/unit layanan terkait.',
    },
}
