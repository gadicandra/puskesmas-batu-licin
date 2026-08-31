'use client'

import { useActionState, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { simpanPengaturanSitus } from '@/app/dashboard/(app)/pengaturan/actions'
import type { FormState } from '@/lib/dashboard/crud'
import Button from '@/components/dashboard/ui/Button'
import Card from '@/components/dashboard/ui/Card'
import Input, { Textarea } from '@/components/dashboard/ui/Input'
import Field from '@/components/dashboard/ui/Field'

type Sosial = { platform: string; url: string }

export default function FormSitus({
    awal,
}: {
    awal: {
        namaInstansi: string
        alamat: string
        telepon: string
        email: string
        sosialMedia: Sosial[]
    }
}) {
    const [state, aksi, pending] = useActionState<FormState, FormData>(simpanPengaturanSitus, {})
    const [sosial, setSosial] = useState<Sosial[]>(awal.sosialMedia)

    const ubah = (i: number, kunci: keyof Sosial, nilai: string) =>
        setSosial((s) => s.map((x, j) => (j === i ? { ...x, [kunci]: nilai } : x)))

    return (
        <Card judul="Informasi situs">
            {state.error && (
                <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {state.error}
                </p>
            )}
            {state.sukses && (
                <p role="status" className="mb-4 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                    {state.sukses}
                </p>
            )}

            <form action={aksi} className="flex flex-col gap-4">
                <Field label="Nama instansi" htmlFor="namaInstansi" keterangan="Tampil di footer setiap halaman.">
                    <Input id="namaInstansi" name="namaInstansi" defaultValue={awal.namaInstansi} />
                </Field>
                <Field label="Alamat" htmlFor="alamat" keterangan="Tampil di footer dan halaman lokasi.">
                    <Textarea id="alamat" name="alamat" defaultValue={awal.alamat} rows={2} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Telepon / WhatsApp" htmlFor="telepon">
                        <Input id="telepon" name="telepon" defaultValue={awal.telepon} placeholder="0811 4881 2882" />
                    </Field>
                    <Field label="Email" htmlFor="email">
                        <Input id="email" name="email" type="email" defaultValue={awal.email} />
                    </Field>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-primary">Media sosial</p>
                    {sosial.length === 0 && (
                        <p className="text-xs text-tertiary">Belum ada akun media sosial yang ditambahkan.</p>
                    )}
                    {sosial.map((s, i) => (
                        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                            <div className="sm:w-48">
                                <Field label={i === 0 ? 'Platform' : ''} htmlFor={`platform-${i}`}>
                                    <Input
                                        id={`platform-${i}`}
                                        name="platform"
                                        value={s.platform}
                                        onChange={(e) => ubah(i, 'platform', e.target.value)}
                                        placeholder="Instagram"
                                    />
                                </Field>
                            </div>
                            <div className="flex-1">
                                <Field label={i === 0 ? 'Alamat halaman' : ''} htmlFor={`url-${i}`}>
                                    <Input
                                        id={`url-${i}`}
                                        name="url"
                                        value={s.url}
                                        onChange={(e) => ubah(i, 'url', e.target.value)}
                                        placeholder="https://instagram.com/..."
                                    />
                                </Field>
                            </div>
                            <Button
                                type="button"
                                varian="danger"
                                ukuran="sm"
                                leftIcon={<Trash2 size={16} />}
                                onClick={() => setSosial((x) => x.filter((_, j) => j !== i))}
                            >
                                Hapus
                            </Button>
                        </div>
                    ))}
                    <div>
                        <Button
                            type="button"
                            varian="secondary"
                            ukuran="sm"
                            leftIcon={<Plus size={16} />}
                            onClick={() => setSosial((s) => [...s, { platform: '', url: '' }])}
                        >
                            Tambah Media Sosial
                        </Button>
                    </div>
                </div>

                <div>
                    <Button type="submit" loading={pending}>Simpan Pengaturan</Button>
                </div>
            </form>
        </Card>
    )
}
