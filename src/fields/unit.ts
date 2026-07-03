import type { Field } from 'payload'
import { unitOptions } from '../lib/units'
import { superAdminFieldAccess } from '../access'

/** Field `unit` penanda kepemilikan data. Default ke unit pembuat (admin unit),
 *  dan hanya superadmin yang boleh memindahkan data ke unit lain. */
export const unitField: Field = {
    name: 'unit',
    type: 'select',
    required: true,
    options: [...unitOptions],
    admin: {
        position: 'sidebar',
        description: 'Unit pemilik data.',
    },
    defaultValue: ({ user }: { user?: unknown }) => (user as { unit?: string })?.unit,
    access: {
        update: superAdminFieldAccess,
    },
}
