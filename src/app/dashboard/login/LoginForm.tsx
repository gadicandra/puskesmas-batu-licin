'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { loginAction, type LoginState } from './actions'
import Button from '@/components/dashboard/ui/Button'
import Field from '@/components/dashboard/ui/Field'
import Input from '@/components/dashboard/ui/Input'

export default function LoginForm() {
    const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {})
    const [lihatSandi, setLihatSandi] = useState(false)

    return (
        <form action={formAction} className="flex flex-col gap-5">
            {state.error && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                    {state.error}
                </p>
            )}

            <Field label="Email" htmlFor="email">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    placeholder="nama@puskesmas.go.id"
                />
            </Field>

            <Field label="Kata Sandi" htmlFor="password">
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={lihatSandi ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setLihatSandi((v) => !v)}
                        aria-label={lihatSandi ? 'Sembunyikan kata sandi' : 'Perlihatkan kata sandi'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-tertiary transition hover:bg-base hover:text-primary"
                    >
                        {lihatSandi ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </Field>

            <Button type="submit" loading={pending} leftIcon={<LogIn size={18} />} className="w-full">
                Masuk
            </Button>
        </form>
    )
}
