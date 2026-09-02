import KerangkaHalaman from '@/components/dashboard/ui/KerangkaHalaman'
import Skeleton from '@/components/dashboard/ui/Skeleton'

export default function Loading() {
    return (
        <KerangkaHalaman label="Memuat artikel" tanpaJudul>
            {/* Bilah aksi yang menempel di atas */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                <Skeleton className="h-11 w-28 rounded-xl" />
                <Skeleton className="h-11 w-32 rounded-xl" />
                <Skeleton className="ml-auto h-11 w-24 rounded-xl" />
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    {/* Editor WYSIWYG */}
                    <Skeleton className="h-[26rem] w-full rounded-2xl" />
                </div>
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-44 w-full rounded-2xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
            </div>
        </KerangkaHalaman>
    )
}
