'use client'

import { useActionState } from 'react'
import { simpanProfilSendiri, gantiSandiSendiri } from '@/app/dashboard/(app)/pengguna/actions'
import type { FormState } from '@/lib/dashboard/crud'
import Button from '@/components/dashboard/ui/Button'
import Card from '@/components/dashboard/ui/Card'
import Field from '@/components/dashboard/ui/Field'
import Input from '@/components/dashboard/ui/Input'
import Badge from '@/components/dashboard/ui/Badge'
import PemuatLayar from '@/components/dashboard/ui/PemuatLayar'

function Pesan({ state }: { state: FormState }) {
    if (state.error) {
        return (
            <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {state.error}
            </p>
        )
    }
    if (state.sukses) {
        return (
            <p role="status" className="mb-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                {state.sukses}
            </p>
        )
    }
    return null
}

export default function FormAkun({
    nama,
    email,
    role,
    lokasi,
}: {
    nama: string
    email: string
    role: string
    lokasi: string | null
}) {
    const [stateProfil, aksiProfil, sedangProfil] = useActionState<FormState, FormData>(simpanProfilSendiri, {})
    const [stateSandi, aksiSandi, sedangSandi] = useActionState<FormState, FormData>(gantiSandiSendiri, {})

    return (
        <div className="flex max-w-2xl flex-col gap-6">
            <Card judul="Profil">
                <Pesan state={stateProfil} />
                <form action={aksiProfil} className="flex flex-col gap-4">
                    <Field label="Nama" htmlFor="name" wajib error={stateProfil.fieldErrors?.name}>
                        <Input id="name" name="name" defaultValue={nama} required />
                    </Field>
                    <Field label="Email" keterangan="Email hanya bisa diubah oleh Super Admin lewat menu Pengguna.">
                        <Input value={email} disabled />
                    </Field>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">Hak akses:</span>
                        <Badge nada={role === 'superadmin' ? 'hijau' : 'abu'}>
                            {role === 'superadmin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                        {lokasi && <span className="text-sm text-tertiary">· {lokasi}</span>}
                    </div>
                    <div>
                        <Button type="submit" loading={sedangProfil}>Simpan Profil</Button>
                    </div>
                </form>
            </Card>

            <Card judul="Ganti kata sandi">
                <Pesan state={stateSandi} />
                <form action={aksiSandi} className="flex flex-col gap-4">
                    <Field label="Kata sandi lama" htmlFor="sandiLama" wajib error={stateSandi.fieldErrors?.sandiLama}>
                        <Input id="sandiLama" name="sandiLama" type="password" autoComplete="current-password" required />
                    </Field>
                    <Field
                        label="Kata sandi baru"
                        htmlFor="sandiBaru"
                        wajib
                        keterangan="Minimal 8 karakter. Gunakan gabungan huruf dan angka."
                        error={stateSandi.fieldErrors?.sandiBaru}
                    >
                        <Input id="sandiBaru" name="sandiBaru" type="password" autoComplete="new-password" required />
                    </Field>
                    <Field label="Ulangi kata sandi baru" htmlFor="sandiUlang" wajib error={stateSandi.fieldErrors?.sandiUlang}>
                        <Input id="sandiUlang" name="sandiUlang" type="password" autoComplete="new-password" required />
                    </Field>
                    <div>
                        <Button type="submit" loading={sedangSandi}>Ganti Kata Sandi</Button>
                    </div>
                </form>
            </Card>
            {(sedangProfil || sedangSandi) && (
                <PemuatLayar
                    umumkan
                    label={sedangSandi ? 'Mengganti kata sandi…' : 'Menyimpan profil…'}
                />
            )}
        </div>
    )
}
