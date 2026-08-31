import type { ReactNode } from 'react'

export default function PageHeader({
    judul,
    keterangan,
    aksi,
}: {
    judul: string
    keterangan?: string
    aksi?: ReactNode
}) {
    return (
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-primary">{judul}</h1>
                {keterangan && <p className="mt-1 text-sm text-tertiary">{keterangan}</p>}
            </div>
            {aksi && <div className="flex shrink-0 gap-2">{aksi}</div>}
        </header>
    )
}
