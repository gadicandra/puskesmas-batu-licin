'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/dashboard/ui/Button'
import Input, { Select } from '@/components/dashboard/ui/Input'

export type SubField = {
    nama: string
    label: string
    tipe: 'teks' | 'pilihan'
    pilihan?: { value: string; label: string }[]
    contoh?: string
}

type Baris = Record<string, string>

/** Isian yang boleh diulang — syarat layanan, jadwal posyandu. Barisnya
 *  dikirim sebagai satu isian tersembunyi berisi JSON supaya urutan dan
 *  pasangan antar-kolom tidak bisa tertukar; nama isian berulang di FormData
 *  tidak menjamin itu. */
export default function DaftarBaris({
    nama,
    subFields,
    barisAwal,
    labelBaris,
}: {
    nama: string
    subFields: SubField[]
    barisAwal: Baris[]
    labelBaris: string
}) {
    const [baris, setBaris] = useState<Baris[]>(barisAwal)

    const kosong = (): Baris => Object.fromEntries(subFields.map((s) => [s.nama, '']))
    const ubah = (i: number, kunci: string, nilai: string) =>
        setBaris((s) => s.map((b, j) => (j === i ? { ...b, [kunci]: nilai } : b)))

    return (
        <div className="flex flex-col gap-3">
            <input type="hidden" name={nama} value={JSON.stringify(baris)} />

            {baris.length === 0 && (
                <p className="rounded-xl border border-dashed border-primary/15 px-4 py-3 text-sm text-tertiary">
                    Belum ada {labelBaris.toLowerCase()}. Boleh dikosongkan.
                </p>
            )}

            {baris.map((b, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-xl border border-primary/10 bg-base/40 p-3 sm:flex-row sm:items-end">
                    {subFields.map((s) => (
                        <div key={s.nama} className="flex-1">
                            <label className="mb-1 block text-xs font-semibold text-tertiary">{s.label}</label>
                            {s.tipe === 'pilihan' ? (
                                <Select value={b[s.nama] ?? ''} onChange={(e) => ubah(i, s.nama, e.target.value)}>
                                    <option value="">— pilih —</option>
                                    {s.pilihan?.map((p) => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    value={b[s.nama] ?? ''}
                                    onChange={(e) => ubah(i, s.nama, e.target.value)}
                                    placeholder={s.contoh}
                                />
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        varian="danger"
                        ukuran="sm"
                        leftIcon={<Trash2 size={16} />}
                        onClick={() => setBaris((s) => s.filter((_, j) => j !== i))}
                    >
                        Hapus
                    </Button>
                </div>
            ))}

            <div>
                <Button type="button" varian="secondary" ukuran="sm" leftIcon={<Plus size={16} />} onClick={() => setBaris((s) => [...s, kosong()])}>
                    Tambah {labelBaris}
                </Button>
            </div>
        </div>
    )
}
