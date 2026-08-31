import { requireUser } from '@/lib/dashboard/auth'
import { ambilStatistik } from '@/lib/dashboard/statistik'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import StatTile from '@/components/dashboard/ui/StatTile'
import BarChart from '@/components/dashboard/ui/BarChart'
import Card from '@/components/dashboard/ui/Card'
import EmptyState from '@/components/dashboard/ui/EmptyState'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Statistik | Dashboard' }

/** Ubah path jadi nama halaman yang bisa dibaca orang awam. */
const NAMA_HALAMAN: Record<string, string> = {
    '/': 'Beranda',
    '/artikel': 'Daftar Artikel',
    '/profil-puskesmas': 'Profil Puskesmas',
    '/struktur-organisasi': 'Struktur Organisasi',
    '/lokasi-puskesmas': 'Lokasi Puskesmas',
    '/informasi-layanan-mutu': 'Informasi Layanan & Mutu',
}

function namaHalaman(path: string): string {
    if (NAMA_HALAMAN[path]) return NAMA_HALAMAN[path]
    if (path.startsWith('/artikel/')) return `Artikel: ${path.replace('/artikel/', '').replace(/-/g, ' ')}`
    return path
}

export default async function StatistikPage() {
    await requireUser()
    const stat = await ambilStatistik()

    if (!stat.adaData) {
        return (
            <>
                <PageHeader judul="Statistik Kunjungan" />
                <EmptyState
                    judul="Belum ada data kunjungan"
                    keterangan="Statistik akan muncul otomatis setelah website mulai dikunjungi warga."
                />
            </>
        )
    }

    return (
        <>
            <PageHeader
                judul="Statistik Kunjungan"
                keterangan="Data kunjungan website. Waktu mengikuti zona WITA (Asia/Makassar)."
            />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile label="Hari ini" nilai={stat.hariIni} />
                <StatTile label="7 hari" nilai={stat.tujuhHari} />
                <StatTile label="30 hari" nilai={stat.tigaPuluhHari} />
                <StatTile label="1 tahun" nilai={stat.setahun} />
            </div>

            <div className="mt-6 flex flex-col gap-6">
                <Card judul="Kunjungan 12 bulan terakhir">
                    <BarChart data={stat.emberBulanan} tinggi={140} />
                    <p className="mt-4 text-xs leading-relaxed text-tertiary">
                        Angka ini menghitung halaman yang dibuka. Satu orang yang membuka 5 halaman
                        dihitung sebagai 5 kunjungan.
                    </p>
                </Card>

                <Card judul="Kunjungan 7 hari terakhir">
                    <BarChart data={stat.emberHarian} />
                    <p className="mt-4 text-xs leading-relaxed text-tertiary">
                        Jam paling ramai: <strong className="text-primary">{stat.jamRamai} WITA</strong> —
                        {' '}{stat.jumlahJamRamai} kunjungan selama 30 hari terakhir.
                    </p>
                </Card>

                <Card judul="Halaman paling banyak dibuka (30 hari)">
                    <ol className="flex flex-col divide-y divide-primary/10">
                        {stat.halamanTerpopuler.map((h, i) => (
                            <li key={h.path} className="flex items-center justify-between gap-3 py-3">
                                <span className="flex min-w-0 items-center gap-3">
                                    <span className="w-5 shrink-0 text-sm font-bold text-tertiary">{i + 1}</span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-primary">
                                            {namaHalaman(h.path)}
                                        </span>
                                        <span className="block truncate text-xs text-tertiary">{h.path}</span>
                                    </span>
                                </span>
                                <span className="shrink-0 text-sm font-bold text-secondary">{h.count}</span>
                            </li>
                        ))}
                    </ol>
                </Card>
            </div>
        </>
    )
}
