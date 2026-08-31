import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// text-base (16px) mencegah zoom otomatis di iOS saat isian difokus.
const DASAR =
    'w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-base text-primary placeholder:text-tertiary/60 transition focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:bg-base disabled:text-tertiary'

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={cn(DASAR, 'min-h-[44px]', className)} />
}

export function Textarea({ className, rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} rows={rows} className={cn(DASAR, 'resize-y leading-relaxed', className)} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select {...props} className={cn(DASAR, 'min-h-[44px] cursor-pointer', className)}>
            {children}
        </select>
    )
}
