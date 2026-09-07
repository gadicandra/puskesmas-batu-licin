import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonForm } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat pengaturan">
            <div className="flex flex-col gap-5">
                {/* Jam operasional, lalu informasi situs */}
                <SkeletonForm isian={6} />
                <SkeletonForm isian={4} />
            </div>
        </KerangkaHalaman>
    )
}
