'use client'

import { useActionState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { buatAkunPertama, type SetupState } from './actions'
import Button from '@/components/dashboard/ui/Button'
import Field from '@/components/dashboard/ui/Field'
import Input from '@/components/dashboard/ui/Input'

export default function SetupForm() {
    const [state, aksi, pending] = useActionState<SetupState, FormData>(buatAkunPertama, {})

    return (
        <form action={aksi} className="flex flex-col gap-5">
            {state.error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {state.error}
                </p>
            )}

            <Field label="Nama lengkap" htmlFor="name" wajib>
                <Input id="name" name="name" required />
            </Field>
            <Field label="Email" htmlFor="email" wajib keterangan="Dipakai untuk masuk ke dashboard.">
                <Input id="email" name="email" type="email" autoComplete="username" required />
            </Field>
            <Field label="Kata sandi" htmlFor="password" wajib keterangan="Minimal 8 karakter.">
                <Input id="password" name="password" type="password" autoComplete="new-password" required />
            </Field>
            <Field label="Ulangi kata sandi" htmlFor="passwordUlang" wajib>
                <Input id="passwordUlang" name="passwordUlang" type="password" autoComplete="new-password" required />
            </Field>

            <Button type="submit" loading={pending} leftIcon={<ShieldCheck size={18} />} className="w-full">
                Buat Akun Super Admin
            </Button>
        </form>
    )
}
