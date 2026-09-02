'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLinkStatus } from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import PemuatLayar from '@/components/dashboard/ui/PemuatLayar'
import { menuUntuk, JUDUL_GRUP, type MenuItem } from './menu'

type UserRingkas = { nama: string; email: string; role: string; lokasi?: string | null }

function aktifkah(pathname: string, href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(`${href}/`)
}

/** Popup "sedang dibuka" saat menu diklik.
 *
 *  `loading.tsx` baru muncul setelah navigasinya dimulai; jeda sebelum itu —
 *  saat Next masih mengambil kode halaman — terasa seperti klik tidak terbaca.
 *  `useLinkStatus` (Next 15.3+) mengisi jeda itu, dan HARUS dipanggil dari
 *  komponen di dalam <Link> karena ia membaca status link terdekat. Karena itu
 *  komponen sekecil ini ada: ia dipasang di setiap baris menu.
 *
 *  Popup besar di tengah layar, bukan ikon berputar di baris menunya: ikon 18px
 *  di pinggir kiri terlalu mudah terlewat, apalagi oleh staf yang matanya
 *  sedang tertuju ke area isi. Bersambung mulus dengan popup dari
 *  `KerangkaHalaman` yang mengambil alih begitu `loading.tsx` tampil, jadi dari
 *  klik sampai halaman siap tidak ada jeda tanpa penanda. */
function PenandaPindah({ label }: { label: string }) {
    const { pending } = useLinkStatus()
    if (!pending) return null
    return <PemuatLayar label={`Membuka ${label}`} keterangan="Mohon tunggu sebentar." />
}

function DaftarMenu({ menu, pathname, onKlik }: { menu: MenuItem[]; pathname: string; onKlik?: () => void }) {
    const grup: MenuItem['grup'][] = ['utama', 'data', 'sistem']

    return (
        <nav className="flex flex-col gap-6" aria-label="Menu dashboard">
            {grup.map((g) => {
                const isi = menu.filter((m) => m.grup === g)
                if (isi.length === 0) return null
                return (
                    <div key={g} className="flex flex-col gap-1">
                        <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/40">
                            {JUDUL_GRUP[g]}
                        </p>
                        {isi.map((m) => {
                            const aktif = aktifkah(pathname, m.href)
                            return (
                                <Link
                                    key={m.href}
                                    href={m.href}
                                    onClick={onKlik}
                                    aria-current={aktif ? 'page' : undefined}
                                    className={cn(
                                        'flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition',
                                        aktif
                                            ? 'bg-white/15 font-semibold text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    )}
                                >
                                    <m.ikon size={18} className="shrink-0" aria-hidden />
                                    {m.label}
                                    <PenandaPindah label={m.label} />
                                </Link>
                            )
                        })}
                    </div>
                )
            })}
        </nav>
    )
}

export default function Shell({
    user,
    logout,
    children,
}: {
    user: UserRingkas
    logout: () => Promise<void>
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [menuPonselTerbuka, setMenuPonselTerbuka] = useState(false)
    const menu = menuUntuk(user.role)

    const labelRole = user.role === 'superadmin' ? 'Super Admin' : 'Admin'

    return (
        <div className="flex min-h-screen bg-base">
            {/* Sidebar desktop */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto bg-primary px-4 py-6 lg:flex">
                <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
                    <Image
                        src="/logo_puskesmas.webp"
                        alt=""
                        width={36}
                        height={36}
                        className="h-9 w-9 object-contain"
                    />
                    <span className="text-sm font-black leading-tight text-white">
                        UPTD Puskesmas
                        <br />
                        Batulicin
                    </span>
                </Link>
                <DaftarMenu menu={menu} pathname={pathname} />
            </aside>

            {/* Drawer ponsel */}
            {menuPonselTerbuka && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        aria-label="Tutup menu"
                        onClick={() => setMenuPonselTerbuka(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-primary px-4 py-6">
                        <div className="mb-8 flex items-center justify-between px-2">
                            <span className="text-sm font-black leading-tight text-white">
                                UPTD Puskesmas
                                <br />
                                Batulicin
                            </span>
                            <button
                                onClick={() => setMenuPonselTerbuka(false)}
                                aria-label="Tutup menu"
                                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <DaftarMenu menu={menu} pathname={pathname} onKlik={() => setMenuPonselTerbuka(false)} />
                    </aside>
                </div>
            )}

            {/* Kolom konten */}
            <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
                <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-3 border-b border-primary/10 bg-white px-4 py-3 sm:px-6">
                    <button
                        onClick={() => setMenuPonselTerbuka(true)}
                        aria-label="Buka menu"
                        className="rounded-lg p-2 text-primary hover:bg-base lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="min-w-0 flex-1 lg:flex-none">
                        <p className="truncate text-sm font-bold text-primary">{user.nama}</p>
                        <p className="truncate text-xs text-tertiary">
                            {labelRole}
                            {user.lokasi ? ` · ${user.lokasi}` : ''}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="hidden min-h-[40px] items-center gap-2 rounded-xl border border-primary/15 px-3.5 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary sm:inline-flex"
                        >
                            <ExternalLink size={16} />
                            Lihat Situs
                        </a>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-primary/15 px-3.5 text-sm font-semibold text-primary transition hover:border-red-300 hover:text-red-600"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Keluar</span>
                            </button>
                        </form>
                    </div>
                </header>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    )
}
