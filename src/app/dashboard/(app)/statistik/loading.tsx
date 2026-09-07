import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonKartuAngka, SkeletonGrafik, SkeletonTabel } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat statistik pengunjung">
            <SkeletonKartuAngka jumlah={3} />
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <SkeletonGrafik />
                <SkeletonGrafik />
            </div>
            <div className="mt-5">
                <SkeletonTabel baris={5} kolom={2} />
            </div>
        </KerangkaHalaman>
    )
}
