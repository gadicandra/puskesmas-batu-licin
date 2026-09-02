import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonTabel } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat data vaksin">
            <SkeletonTabel baris={6} kolom={5} />
        </KerangkaHalaman>
    )
}
