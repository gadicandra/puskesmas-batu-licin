'use client'

import type { ReactNode } from 'react'
import Button, { type ButtonProps } from './Button'

/** Tombol submit yang meminta konfirmasi dulu. Pesannya WAJIB menyebut nama
 *  data yang akan dihapus — bukan "Anda yakin?" (lihat docs/DASHBOARD.md §2). */
export default function ConfirmSubmit({
    pesan,
    children,
    ...props
}: ButtonProps & { pesan: string; children: ReactNode }) {
    return (
        <Button
            {...props}
            type="submit"
            onClick={(e) => {
                if (!window.confirm(pesan)) e.preventDefault()
            }}
        >
            {children}
        </Button>
    )
}
