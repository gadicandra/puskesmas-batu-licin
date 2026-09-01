import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonTabel } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat data sertifikat">
            <SkeletonTabel baris={5} kolom={4} />
        </KerangkaHalaman>
    )
}
