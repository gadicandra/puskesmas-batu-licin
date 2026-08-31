import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dashboard/auth'
import LoginForm from './LoginForm'

export const metadata = {
    title: 'Masuk Dashboard | Puskesmas Batulicin',
}

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
    // Sudah login? Langsung ke beranda dashboard.
    const user = await getCurrentUser()
    if (user) redirect('/dashboard')

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
                    <LoginForm />
                </div>

                <p className="mt-6 text-center text-sm text-tertiary">
                    Lupa kata sandi? Hubungi petugas Tata Usaha Puskesmas.
                </p>
            </div>
        </main>
    )
}
