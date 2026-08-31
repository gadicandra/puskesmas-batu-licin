import { requireUser } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import FormAkun from '@/components/dashboard/akun/FormAkun'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Akun Saya | Dashboard' }

export default async function AkunPage() {
    const user = await requireUser()

    return (
        <>
            <PageHeader judul="Akun Saya" keterangan="Ubah nama dan kata sandi akun Anda." />
            <FormAkun
                nama={user.name ?? ''}
                email={user.email}
                role={user.role}
                lokasi={user.lokasi ?? null}
            />
        </>
    )
}
