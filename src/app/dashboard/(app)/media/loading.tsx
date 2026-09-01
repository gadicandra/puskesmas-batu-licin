import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import Skeleton, { SkeletonGaleri } from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat galeri gambar">
            {/* Kotak unggah di atas galeri */}
            <Skeleton className="mb-5 h-28 w-full rounded-2xl" />
            <SkeletonGaleri />
        </KerangkaHalaman>
    )
}
