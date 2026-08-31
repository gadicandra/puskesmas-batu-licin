import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export const metadata = { title: 'Tanpa Akses | Dashboard' }

export default function TanpaAksesPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center">
            <ShieldAlert size={48} className="text-tertiary" />
            <h1 className="mt-4 text-2xl font-bold text-primary">Anda tidak punya akses ke halaman ini</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-tertiary">
                Halaman tersebut hanya bisa dibuka oleh Super Admin Puskesmas. Bila Anda merasa ini
                keliru, hubungi petugas Tata Usaha.
            </p>
            <Link
                href="/dashboard"
                className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-secondary px-5 text-sm font-semibold text-white transition hover:bg-secondary/90"
            >
                Kembali ke Beranda Dashboard
            </Link>
        </main>
    )
}
