import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '../access'

/** Jam operasional Puskesmas — dikelola admin, ditampilkan di public side.
 *  Nilai default mengikuti SK B/445.61/003/PKM.Btl-Adm/I/2023. */
export const OperationalHours: GlobalConfig = {
    slug: 'operational-hours',
    label: 'Jam Operasional',
    admin: { group: 'Pengaturan' },
    access: {
        read: () => true, // publik
        update: isLoggedIn,
    },
    fields: [
        {
            name: 'jadwal',
            type: 'array',
            label: 'Jadwal Dalam Gedung',
            labels: { singular: 'Hari', plural: 'Jadwal' },
            required: true,
            defaultValue: [
                { hari: 'Senin – Kamis', jam: '08.00 – 11.00' },
                { hari: 'Jumat', jam: '07.30 – 10.30' },
                { hari: 'Sabtu', jam: '08.00 – 11.00' },
            ],
            fields: [
                { name: 'hari', type: 'text', required: true },
                { name: 'jam', type: 'text', required: true },
            ],
        },
        {
            name: 'catatan',
            type: 'text',
            defaultValue: 'UGD & UGD Kebidanan melayani 24 jam, Senin–Minggu.',
        },
    ],
}
