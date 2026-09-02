import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import { SkeletonForm } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat akun saya">
            <div className="flex flex-col gap-5">
                <SkeletonForm isian={2} />
                <SkeletonForm isian={3} />
            </div>
        </KerangkaHalaman>
    )
}
