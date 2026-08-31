import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import SetupForm from './SetupForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pengaturan Awal | Puskesmas Batulicin' }

export default async function SetupPage() {
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({ collection: 'users' })

    // Sudah ada akun → halaman ini tidak berlaku lagi.
    if (totalDocs > 0) redirect('/dashboard/login')

    return (
        <main className="flex min-h-screen items-center justify-center bg-base px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-primary">Pengaturan Awal</h1>
                    <p className="mt-2 text-sm leading-relaxed text-tertiary">
                        Belum ada akun di sistem ini. Buat akun Super Admin pertama untuk mulai
                        mengelola website Puskesmas. Halaman ini otomatis nonaktif setelah akun dibuat.
                    </p>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
                    <SetupForm />
                </div>
            </div>
        </main>
    )
}
