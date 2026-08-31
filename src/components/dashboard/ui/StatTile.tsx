import type { ReactNode } from 'react'

export default function StatTile({
    label,
    nilai,
    sub,
    ikon,
}: {
    label: string
    nilai: string | number
    sub?: string
    ikon?: ReactNode
}) {
    return (
        <div className="rounded-2xl border border-primary/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-tertiary">{label}</p>
                {ikon && <span className="text-secondary">{ikon}</span>}
            </div>
            <p className="mt-2 text-3xl font-black leading-none text-primary">{nilai}</p>
            {sub && <p className="mt-1.5 text-xs text-tertiary">{sub}</p>}
        </div>
    )
}
