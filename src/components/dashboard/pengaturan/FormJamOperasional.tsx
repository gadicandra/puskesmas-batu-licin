'use client'

import { useActionState, useState } from 'react'
import { Plus, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import { simpanJamOperasional } from '@/app/dashboard/(app)/pengaturan/actions'
import type { FormState } from '@/lib/dashboard/crud'
import Button from '@/components/dashboard/ui/Button'
import Card from '@/components/dashboard/ui/Card'
import Input from '@/components/dashboard/ui/Input'
import Field from '@/components/dashboard/ui/Field'
import PemuatLayar from '@/components/dashboard/ui/PemuatLayar'

type Baris = { hari: string; jam: string }

export default function FormJamOperasional({
    jadwalAwal,
    catatanAwal,
}: {
    jadwalAwal: Baris[]
    catatanAwal: string
}) {
    const [state, aksi, pending] = useActionState<FormState, FormData>(simpanJamOperasional, {})
    const [baris, setBaris] = useState<Baris[]>(jadwalAwal.length ? jadwalAwal : [{ hari: '', jam: '' }])

    const ubah = (i: number, kunci: keyof Baris, nilai: string) =>
        setBaris((b) => b.map((x, j) => (j === i ? { ...x, [kunci]: nilai } : x)))

    return (
        <Card judul="Jam pelayanan">
            <p className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span>
                    Jam ini tampil di halaman depan situs dan dibaca warga. Pastikan sesuai SK
                    Kepala Puskesmas yang berlaku sebelum menyimpan.
                </span>
            </p>

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
                <div className="flex flex-col gap-3">
                    {baris.map((b, i) => (
                        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-end">
                            <div className="flex-1">
                                <Field label={i === 0 ? 'Hari' : ''} htmlFor={`hari-${i}`}>
                                    <Input
                                        id={`hari-${i}`}
                                        name="hari"
                                        value={b.hari}
                                        onChange={(e) => ubah(i, 'hari', e.target.value)}
                                        placeholder="Senin – Kamis"
                                    />
                                </Field>
                            </div>
                            <div className="flex-1">
                                <Field label={i === 0 ? 'Jam' : ''} htmlFor={`jam-${i}`}>
                                    <Input
                                        id={`jam-${i}`}
                                        name="jam"
                                        value={b.jam}
                                        onChange={(e) => ubah(i, 'jam', e.target.value)}
                                        placeholder="08.00 – 11.00"
                                    />
                                </Field>
                            </div>
                            <Button
                                type="button"
                                varian="danger"
                                ukuran="sm"
                                onClick={() => setBaris((x) => x.filter((_, j) => j !== i))}
                                disabled={baris.length === 1}
                                leftIcon={<Trash2 size={16} />}
                            >
                                Hapus
                            </Button>
                        </div>
                    ))}
                </div>

                <div>
                    <Button
                        type="button"
                        varian="secondary"
                        ukuran="sm"
                        leftIcon={<Plus size={16} />}
                        onClick={() => setBaris((b) => [...b, { hari: '', jam: '' }])}
                    >
                        Tambah Baris
                    </Button>
                </div>

                <Field label="Catatan tambahan" htmlFor="catatan" keterangan="Tampil di bawah tabel jam pelayanan.">
                    <Input id="catatan" name="catatan" defaultValue={catatanAwal} />
                </Field>

                <div className="flex flex-wrap gap-2">
                    <Button type="submit" loading={pending}>Simpan Jam Pelayanan</Button>
                    <Button
                        type="submit"
                        name="aksi"
                        value="kembalikan-sk"
                        varian="secondary"
                        leftIcon={<RotateCcw size={16} />}
                        onClick={(e) => {
                            if (!window.confirm('Kembalikan jadwal ke jam resmi sesuai SK? Perubahan yang belum disimpan akan hilang.')) {
                                e.preventDefault()
                            }
                        }}
                    >
                        Kembalikan ke Jadwal Resmi SK
                    </Button>
                </div>
            </form>
            {pending && <PemuatLayar umumkan label="Menyimpan jam pelayanan…" />}
        </Card>
    )
}
