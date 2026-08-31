import type { ReactNode } from 'react'

export default function EmptyState({
    judul,
    keterangan,
    aksi,
}: {
    judul: string
    keterangan: string
    aksi?: ReactNode
}) {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-primary/15 bg-white px-6 py-14 text-center">
            <p className="text-base font-bold text-primary">{judul}</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-tertiary">{keterangan}</p>
            {aksi && <div className="mt-5">{aksi}</div>}
        </div>
    )
}
