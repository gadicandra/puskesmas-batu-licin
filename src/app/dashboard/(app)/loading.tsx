import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonKartuAngka, SkeletonGrafik, SkeletonTabel } from '@/components/dashboard/ui/Skeleton'

/** Kerangka beranda dashboard — dan sekaligus cadangan untuk halaman di bawah
 *  `(app)/` yang belum punya `loading.tsx` sendiri.
 *
 *  Mengikuti bentuk `page.tsx`: 4 kartu angka, lalu petak 3 kolom berisi
 *  histogram dan daftar. */
export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat beranda dashboard">
            <SkeletonKartuAngka jumlah={4} />
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <SkeletonGrafik className="lg:col-span-2" />
                <SkeletonTabel baris={4} kolom={2} />
            </div>
        </KerangkaHalaman>
    )
}
