import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonTabel } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat data layanan">
            <SkeletonTabel baris={8} kolom={5} />
        </KerangkaHalaman>
    )
}
