import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function Card({
    judul,
    aksi,
    className,
    children,
}: {
    judul?: string
    aksi?: ReactNode
    className?: string
    children: ReactNode
}) {
    return (
        <section className={cn('rounded-2xl border border-primary/10 bg-white', className)}>
            {(judul || aksi) && (
                <header className="flex items-center justify-between gap-3 border-b border-primary/10 px-5 py-4">
                    {judul && <h2 className="text-sm font-bold uppercase tracking-wide text-tertiary">{judul}</h2>}
                    {aksi}
                </header>
            )}
            <div className="p-5">{children}</div>
        </section>
    )
}
