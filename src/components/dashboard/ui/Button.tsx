import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Varian = 'primary' | 'secondary' | 'ghost' | 'danger'
type Ukuran = 'sm' | 'md'

const VARIAN: Record<Varian, string> = {
    primary: 'bg-secondary text-white hover:bg-secondary/90 border-transparent',
    secondary: 'bg-white text-primary border-primary/15 hover:border-secondary hover:text-secondary',
    ghost: 'bg-transparent text-tertiary border-transparent hover:bg-base hover:text-primary',
    danger: 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300',
}

const UKURAN: Record<Ukuran, string> = {
    // min-h 44px = target sentuh nyaman (lihat PRODUCT.md: ramah lansia & ponsel)
    sm: 'min-h-[40px] px-3.5 text-sm gap-1.5',
    md: 'min-h-[44px] px-5 text-sm gap-2',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    varian?: Varian
    ukuran?: Ukuran
    loading?: boolean
    leftIcon?: ReactNode
    children?: ReactNode
}

export default function Button({
    varian = 'primary',
    ukuran = 'md',
    loading = false,
    leftIcon,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center rounded-xl border font-semibold transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-60',
                VARIAN[varian],
                UKURAN[ukuran],
                className
            )}
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : leftIcon}
            {children}
        </button>
    )
}
