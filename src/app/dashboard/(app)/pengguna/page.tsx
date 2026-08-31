import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import DaftarPengguna, { type PenggunaBaris } from '@/components/dashboard/pengguna/DaftarPengguna'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pengguna | Dashboard' }

export default async function PenggunaPage() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
        collection: 'users',
        sort: 'name',
        limit: 200,
        depth: 0,
        pagination: false,
        user,
        overrideAccess: false,
    })

    const data: PenggunaBaris[] = docs.map((u) => ({
        id: u.id,
        name: u.name ?? '',
        email: u.email,
        role: u.role,
        lokasi: u.lokasi ?? null,
    }))

    return (
        <>
            <PageHeader
                judul="Pengguna"
                keterangan="Akun yang bisa masuk ke dashboard ini."
            />
            <DaftarPengguna data={data} idSaya={user.id} />
        </>
    )
}
