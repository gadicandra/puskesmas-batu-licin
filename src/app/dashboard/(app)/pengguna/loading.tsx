import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonTabel } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat daftar pengguna">
            <SkeletonTabel baris={4} kolom={5} />
        </KerangkaHalaman>
    )
}
