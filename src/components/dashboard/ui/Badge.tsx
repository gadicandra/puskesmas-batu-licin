import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Nada = 'hijau' | 'abu' | 'merah' | 'kuning'

const NADA: Record<Nada, string> = {
    hijau: 'bg-secondary/10 text-secondary border-secondary/20',
    abu: 'bg-base text-tertiary border-primary/10',
    merah: 'bg-red-50 text-red-700 border-red-200',
    kuning: 'bg-amber-50 text-amber-700 border-amber-200',
}

export default function Badge({ nada = 'abu', children }: { nada?: Nada; children: ReactNode }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
                NADA[nada]
            )}
        >
            {children}
        </span>
    )
}
