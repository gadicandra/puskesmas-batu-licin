import type { ReactNode } from 'react'

export default function Field({
    label,
    htmlFor,
    keterangan,
    error,
    wajib = false,
    children,
}: {
    label: string
    htmlFor?: string
    /** Kalimat bantuan di bawah isian. Tulis dalam bahasa sehari-hari, tanpa jargon. */
    keterangan?: string
    error?: string
    wajib?: boolean
    children: ReactNode
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={htmlFor} className="text-sm font-semibold text-primary">
                {label}
                {wajib && <span className="ml-1 text-red-600" aria-hidden>*</span>}
                {wajib && <span className="sr-only"> (wajib diisi)</span>}
            </label>
            {children}
            {keterangan && !error && <p className="text-xs leading-relaxed text-tertiary">{keterangan}</p>}
            {error && (
                <p role="alert" className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}
