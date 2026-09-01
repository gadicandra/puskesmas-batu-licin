import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dashboard/auth'
import { googleAktif } from '@/lib/dashboard/google'
import LoginForm from './LoginForm'
import TombolGoogle from './TombolGoogle'

export const metadata = {
    title: 'Masuk Dashboard | Puskesmas Batulicin',
}

export const dynamic = 'force-dynamic'

/** Pesan kegagalan login Google. Ditulis dari sudut pandang staf: apa yang
 *  terjadi dan apa yang harus dilakukan — tanpa istilah teknis OAuth. */
const PESAN_GALAT: Record<string, string> = {
    nonaktif: 'Masuk dengan Google belum diaktifkan di server ini. Gunakan email dan kata sandi.',
    dibatalkan: 'Anda membatalkan proses masuk dengan Google. Silakan coba lagi.',
    state:
        'Proses masuk terlalu lama atau terputus di tengah jalan. Klik "Masuk dengan Google" sekali lagi.',
    gagal: 'Sambungan ke Google gagal. Coba beberapa saat lagi, atau masuk dengan email dan kata sandi.',
    'belum-verifikasi':
        'Alamat email pada akun Google itu belum diverifikasi oleh Google, jadi belum bisa dipakai masuk.',
    'tidak-terdaftar':
        'Akun Google ini belum didaftarkan sebagai pengelola website. Hubungi petugas Tata Usaha Puskesmas untuk didaftarkan.',
    'bukan-google':
        'Akun ini disetel untuk masuk memakai email dan kata sandi, bukan akun Google. Gunakan formulir di bawah.',
    'akun-lain':
        'Alamat email ini sudah tertaut ke akun Google yang berbeda. Hubungi petugas Tata Usaha Puskesmas untuk memutus tautan lama.',
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ galat?: string }>
}) {
    // Sudah login? Langsung ke beranda dashboard.
    const user = await getCurrentUser()
    if (user) redirect('/dashboard')

    const { galat } = await searchParams
    const pesanGalat = galat ? PESAN_GALAT[galat] : undefined
    const pakaiGoogle = googleAktif()

    return (
        <main className="flex min-h-screen items-center justify-center bg-base px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 flex flex-col items-center text-center">
                    <Image
                        src="/logo_puskesmas.webp"
                        alt="Logo UPTD Puskesmas Batulicin"
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain"
                    />
                    <h1 className="mt-4 text-2xl font-bold text-primary">Masuk ke Dashboard</h1>
                    <p className="mt-1 text-sm text-tertiary">
                        Halaman pengelolaan isi website UPTD Puskesmas Batulicin
                    </p>
                </div>

                <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
                    {pesanGalat && (
                        <p
                            role="alert"
                            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                        >
                            {pesanGalat}
                        </p>
                    )}

                    {pakaiGoogle && (
                        <>
                            <TombolGoogle />
                            <div className="my-6 flex items-center gap-3">
                                <span className="h-px flex-1 bg-primary/10" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-tertiary">
                                    atau
                                </span>
                                <span className="h-px flex-1 bg-primary/10" />
                            </div>
                        </>
                    )}

                    <LoginForm />
                </div>

                <p className="mt-6 text-center text-sm text-tertiary">
                    Lupa kata sandi? Hubungi petugas Tata Usaha Puskesmas.
                </p>
            </div>
        </main>
    )
}
