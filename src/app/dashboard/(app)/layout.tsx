import { requireAkses } from '@/lib/dashboard/auth'
import { logoutAction } from '../login/actions'
import Shell from '@/components/dashboard/shell/Shell'

export const metadata = {
    title: 'Dashboard | Puskesmas Batulicin',
}

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Penjaga rute: belum login → halaman masuk; peran kurang → halaman 403.
    // Aturannya dibaca dari `lib/dashboard/akses.ts`, daftar yang sama yang
    // dipakai menu sidebar. Penegak sebenarnya tetap access control Payload di
    // setiap server action lewat `overrideAccess: false`.
    const user = await requireAkses()

    return (
        <Shell
            user={{
                nama: user.name || user.email,
                email: user.email,
                role: user.role,
                lokasi: user.lokasi,
            }}
            logout={logoutAction}
        >
            {children}
        </Shell>
    )
}
