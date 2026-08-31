import type { LucideIcon } from 'lucide-react'
import {
    LayoutDashboard,
    Newspaper,
    Images,
    BarChart3,
    Stethoscope,
    Users2,
    Syringe,
    Award,
    MessageSquareWarning,
    Settings,
    UserCog,
    CircleUser,
} from 'lucide-react'

export type MenuItem = {
    label: string
    href: string
    ikon: LucideIcon
    /** true = hanya superadmin yang melihat menu ini */
    khususSuperAdmin?: boolean
    grup: 'utama' | 'data' | 'sistem'
}

/** Menu sidebar. Label sengaja memakai bahasa sehari-hari, bukan istilah teknis
 *  ("Galeri Gambar", bukan "Media"). Lihat docs/DASHBOARD.md §2. */
export const MENU: MenuItem[] = [
    { label: 'Beranda', href: '/dashboard', ikon: LayoutDashboard, grup: 'utama' },
    { label: 'Artikel', href: '/dashboard/artikel', ikon: Newspaper, grup: 'utama' },
    { label: 'Galeri Gambar', href: '/dashboard/media', ikon: Images, grup: 'utama' },
    { label: 'Statistik', href: '/dashboard/statistik', ikon: BarChart3, grup: 'utama' },

    { label: 'Pengaduan', href: '/dashboard/pengaduan', ikon: MessageSquareWarning, khususSuperAdmin: true, grup: 'data' },
    { label: 'Dokter', href: '/dashboard/dokter', ikon: Stethoscope, khususSuperAdmin: true, grup: 'data' },
    { label: 'Tenaga Medis', href: '/dashboard/tenaga-medis', ikon: Users2, khususSuperAdmin: true, grup: 'data' },
    { label: 'Vaksin', href: '/dashboard/vaksin', ikon: Syringe, khususSuperAdmin: true, grup: 'data' },
    { label: 'Sertifikat', href: '/dashboard/sertifikat', ikon: Award, khususSuperAdmin: true, grup: 'data' },

    { label: 'Pengaturan', href: '/dashboard/pengaturan', ikon: Settings, khususSuperAdmin: true, grup: 'sistem' },
    { label: 'Pengguna', href: '/dashboard/pengguna', ikon: UserCog, khususSuperAdmin: true, grup: 'sistem' },
    { label: 'Akun Saya', href: '/dashboard/akun', ikon: CircleUser, grup: 'sistem' },
]

export const JUDUL_GRUP: Record<MenuItem['grup'], string> = {
    utama: 'Konten',
    data: 'Data Layanan',
    sistem: 'Sistem',
}

export function menuUntuk(role: string | null | undefined): MenuItem[] {
    if (role === 'superadmin') return MENU
    return MENU.filter((m) => !m.khususSuperAdmin)
}
