import type { LucideIcon } from 'lucide-react'
import { butuhSuperAdmin } from '@/lib/dashboard/akses'
import {
    LayoutDashboard,
    Newspaper,
    Images,
    BarChart3,
    Stethoscope,
    Users2,
    Syringe,
    Award,
    ClipboardList,
    Baby,
    Building2,
    Network,
    MessageSquareWarning,
    Settings,
    UserCog,
    CircleUser,
} from 'lucide-react'

export type MenuItem = {
    label: string
    href: string
    ikon: LucideIcon
    grup: 'utama' | 'data' | 'sistem'
}

/** Menu sidebar. Label sengaja memakai bahasa sehari-hari, bukan istilah teknis
 *  ("Galeri Gambar", bukan "Media"). Lihat docs/DASHBOARD.md §2. */
export const MENU: MenuItem[] = [
    { label: 'Beranda', href: '/dashboard', ikon: LayoutDashboard, grup: 'utama' },
    { label: 'Artikel', href: '/dashboard/artikel', ikon: Newspaper, grup: 'utama' },
    { label: 'Galeri Gambar', href: '/dashboard/media', ikon: Images, grup: 'utama' },
    { label: 'Statistik', href: '/dashboard/statistik', ikon: BarChart3, grup: 'utama' },

    { label: 'Pengaduan', href: '/dashboard/pengaduan', ikon: MessageSquareWarning, grup: 'data' },
    { label: 'Dokter', href: '/dashboard/dokter', ikon: Stethoscope, grup: 'data' },
    { label: 'Tenaga Medis', href: '/dashboard/tenaga-medis', ikon: Users2, grup: 'data' },
    { label: 'Vaksin', href: '/dashboard/vaksin', ikon: Syringe, grup: 'data' },
    { label: 'Sertifikat', href: '/dashboard/sertifikat', ikon: Award, grup: 'data' },
    { label: 'Layanan', href: '/dashboard/layanan', ikon: ClipboardList, grup: 'data' },
    { label: 'Posyandu', href: '/dashboard/posyandu', ikon: Baby, grup: 'data' },
    { label: 'Fasilitas', href: '/dashboard/fasilitas', ikon: Building2, grup: 'data' },
    { label: 'Struktur Organisasi', href: '/dashboard/struktur-organisasi', ikon: Network, grup: 'data' },

    { label: 'Pengaturan', href: '/dashboard/pengaturan', ikon: Settings, grup: 'sistem' },
    { label: 'Pengguna', href: '/dashboard/pengguna', ikon: UserCog, grup: 'sistem' },
    { label: 'Akun Saya', href: '/dashboard/akun', ikon: CircleUser, grup: 'sistem' },
]

export const JUDUL_GRUP: Record<MenuItem['grup'], string> = {
    utama: 'Konten',
    data: 'Data Layanan',
    sistem: 'Sistem',
}

/** Menu yang boleh dilihat sebuah peran.
 *
 *  Peran tiap rute TIDAK ditulis ulang di sini — dibaca dari
 *  `lib/dashboard/akses.ts`, daftar yang sama yang dipakai penjaga rute di
 *  `dashboard/(app)/layout.tsx`. Dulu keduanya terpisah, dan menu yang
 *  disembunyikan tanpa rute yang dijaga adalah pengaman semu: alamatnya masih
 *  bisa diketik sendiri. */
export function menuUntuk(role: string | null | undefined): MenuItem[] {
    if (role === 'superadmin') return MENU
    return MENU.filter((m) => !butuhSuperAdmin(m.href))
}
