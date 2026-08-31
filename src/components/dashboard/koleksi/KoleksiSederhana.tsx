'use client'

import { useActionState, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import type { FormState } from '@/lib/dashboard/crud'
import type { MediaRingkas } from '@/app/dashboard/(app)/media/actions'
import MediaPicker from '@/components/dashboard/media/MediaPicker'
import Button from '@/components/dashboard/ui/Button'
import Field from '@/components/dashboard/ui/Field'
import Input, { Textarea, Select } from '@/components/dashboard/ui/Input'
import Badge from '@/components/dashboard/ui/Badge'
import EmptyState from '@/components/dashboard/ui/EmptyState'

export type SpesifikasiField = {
    nama: string
    label: string
    tipe: 'teks' | 'angka' | 'panjang' | 'pilihan' | 'tanggal' | 'centang' | 'berkas'
    wajib?: boolean
    keterangan?: string
    contoh?: string
    pilihan?: { value: string; label: string }[]
    /** Tampilkan kolom ini di tabel daftar */
    diTabel?: boolean
}

export type BarisData = Record<string, unknown> & { id: number }

export default function KoleksiSederhana({
    data,
    fields,
    simpanAksi,
    hapusAksi,
    labelSatuan,
    kunciJudul,
    kosongJudul,
    kosongKeterangan,
}: {
    data: BarisData[]
    fields: SpesifikasiField[]
    simpanAksi: (prev: FormState, fd: FormData) => Promise<FormState>
    hapusAksi: (prev: FormState, fd: FormData) => Promise<FormState>
    labelSatuan: string
    kunciJudul: string
    kosongJudul: string
    kosongKeterangan: string
}) {
    const [stateSimpan, aksiSimpan, sedangSimpan] = useActionState<FormState, FormData>(simpanAksi, {})
    const [stateHapus, aksiHapus] = useActionState<FormState, FormData>(hapusAksi, {})
    const [formTerbuka, setFormTerbuka] = useState(false)
    const [sedangUbah, setSedangUbah] = useState<BarisData | null>(null)
    const [berkasTerpilih, setBerkasTerpilih] = useState<Record<string, MediaRingkas | null>>({})
    const [pemilihUntuk, setPemilihUntuk] = useState<string | null>(null)

    const kolomTabel = fields.filter((f) => f.diTabel)

    const bukaForm = (baris: BarisData | null) => {
        setSedangUbah(baris)
        setBerkasTerpilih({})
        setFormTerbuka(true)
    }

    const nilaiAwal = (f: SpesifikasiField): string => {
        if (!sedangUbah) return ''
        const v = sedangUbah[f.nama]
        if (v === null || v === undefined) return ''
        if (f.tipe === 'berkas') {
            return typeof v === 'object' && v !== null && 'id' in v ? String((v as { id: number }).id) : String(v)
        }
        if (f.tipe === 'tanggal') return String(v).slice(0, 10)
        return String(v)
    }

    return (
        <div className="flex flex-col gap-5">
            {(stateSimpan.error || stateHapus.error) && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {stateSimpan.error || stateHapus.error}
                </p>
            )}
            {(stateSimpan.sukses || stateHapus.sukses) && (
                <p role="status" className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                    {stateSimpan.sukses || stateHapus.sukses}
                </p>
            )}

            {!formTerbuka && (
                <div>
                    <Button leftIcon={<Plus size={18} />} onClick={() => bukaForm(null)}>
                        Tambah {labelSatuan}
                    </Button>
                </div>
            )}

            {formTerbuka && (
                <form
                    action={aksiSimpan}
                    className="rounded-2xl border border-primary/10 bg-white p-5"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-bold text-primary">
                            {sedangUbah ? `Ubah ${labelSatuan}` : `Tambah ${labelSatuan}`}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setFormTerbuka(false)}
                            aria-label="Tutup form"
                            className="rounded-lg p-2 text-tertiary hover:bg-base hover:text-primary"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {sedangUbah && <input type="hidden" name="id" value={sedangUbah.id} />}

                    <div className="grid gap-4 sm:grid-cols-2">
                        {fields.map((f) => {
                            const idField = `f-${f.nama}`
                            const error = stateSimpan.fieldErrors?.[f.nama]

                            if (f.tipe === 'centang') {
                                const tercentang = sedangUbah ? Boolean(sedangUbah[f.nama]) : true
                                return (
                                    <div key={f.nama} className="sm:col-span-2">
                                        <input type="hidden" name="_checkbox_aktif" value="1" />
                                        <label className="flex min-h-[44px] items-center gap-3 text-sm font-medium text-primary">
                                            <input
                                                type="checkbox"
                                                name={f.nama}
                                                defaultChecked={tercentang}
                                                className="h-5 w-5 rounded border-primary/30 accent-[var(--color-secondary)]"
                                            />
                                            {f.label}
                                        </label>
                                        {f.keterangan && <p className="mt-1 text-xs text-tertiary">{f.keterangan}</p>}
                                    </div>
                                )
                            }

                            if (f.tipe === 'berkas') {
                                const dipilih = berkasTerpilih[f.nama]
                                const idAwal = nilaiAwal(f)
                                return (
                                    <div key={f.nama} className="sm:col-span-2">
                                        <Field label={f.label} keterangan={f.keterangan} error={error}>
                                            <input type="hidden" name={f.nama} value={dipilih ? dipilih.id : idAwal} />
                                            <div className="flex items-center gap-3">
                                                {dipilih && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={dipilih.thumbnailUrl} alt={dipilih.alt} className="h-16 w-16 rounded-lg object-cover" />
                                                )}
                                                <Button type="button" ukuran="sm" varian="secondary" onClick={() => setPemilihUntuk(f.nama)}>
                                                    {dipilih || idAwal ? 'Ganti Berkas' : 'Pilih Berkas'}
                                                </Button>
                                                {(dipilih || idAwal) && (
                                                    <Button
                                                        type="button"
                                                        ukuran="sm"
                                                        varian="ghost"
                                                        onClick={() => setBerkasTerpilih((s) => ({ ...s, [f.nama]: null }))}
                                                    >
                                                        Kosongkan
                                                    </Button>
                                                )}
                                            </div>
                                        </Field>
                                    </div>
                                )
                            }

                            return (
                                <div key={f.nama} className={f.tipe === 'panjang' ? 'sm:col-span-2' : ''}>
                                    <Field label={f.label} htmlFor={idField} wajib={f.wajib} keterangan={f.keterangan} error={error}>
                                        {f.tipe === 'panjang' ? (
                                            <Textarea id={idField} name={f.nama} defaultValue={nilaiAwal(f)} placeholder={f.contoh} />
                                        ) : f.tipe === 'pilihan' ? (
                                            <Select id={idField} name={f.nama} defaultValue={nilaiAwal(f)}>
                                                <option value="">— pilih —</option>
                                                {f.pilihan?.map((p) => (
                                                    <option key={p.value} value={p.value}>{p.label}</option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Input
                                                id={idField}
                                                name={f.nama}
                                                type={f.tipe === 'angka' ? 'number' : f.tipe === 'tanggal' ? 'date' : 'text'}
                                                min={f.tipe === 'angka' ? 0 : undefined}
                                                defaultValue={nilaiAwal(f)}
                                                placeholder={f.contoh}
                                                required={f.wajib}
                                            />
                                        )}
                                    </Field>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-5 flex gap-2">
                        <Button type="submit" loading={sedangSimpan}>Simpan</Button>
                        <Button type="button" varian="ghost" onClick={() => setFormTerbuka(false)}>Batal</Button>
                    </div>
                </form>
            )}

            {data.length === 0 ? (
                <EmptyState judul={kosongJudul} keterangan={kosongKeterangan} />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-primary/10 bg-base/50">
                            <tr className="text-xs uppercase tracking-wide text-tertiary">
                                {kolomTabel.map((k) => (
                                    <th key={k.nama} className="px-5 py-3 font-bold">{k.label}</th>
                                ))}
                                <th className="px-5 py-3 text-right font-bold">Tindakan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/10">
                            {data.map((baris) => (
                                <tr key={baris.id} className="transition hover:bg-base/40">
                                    {kolomTabel.map((k) => {
                                        const nilai = baris[k.nama]
                                        return (
                                            <td key={k.nama} className="px-5 py-3 text-tertiary">
                                                {k.tipe === 'centang' ? (
                                                    <Badge nada={nilai ? 'hijau' : 'abu'}>{nilai ? 'Aktif' : 'Nonaktif'}</Badge>
                                                ) : k.nama === kunciJudul ? (
                                                    <span className="font-semibold text-primary">{String(nilai ?? '-')}</span>
                                                ) : (
                                                    String(nilai ?? '-')
                                                )}
                                            </td>
                                        )
                                    })}
                                    <td className="px-5 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button ukuran="sm" varian="ghost" onClick={() => bukaForm(baris)} leftIcon={<Pencil size={16} />}>
                                                Ubah
                                            </Button>
                                            <form
                                                action={aksiHapus}
                                                onSubmit={(e) => {
                                                    const nama = String(baris[kunciJudul] ?? '')
                                                    if (!window.confirm(`Hapus ${labelSatuan.toLowerCase()} "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                            >
                                                <input type="hidden" name="id" value={baris.id} />
                                                <Button type="submit" ukuran="sm" varian="danger" leftIcon={<Trash2 size={16} />}>
                                                    Hapus
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pemilihUntuk && (
                <MediaPicker
                    onTutup={() => setPemilihUntuk(null)}
                    onPilih={(m) => {
                        setBerkasTerpilih((s) => ({ ...s, [pemilihUntuk]: m }))
                        setPemilihUntuk(null)
                    }}
                />
            )}
        </div>
    )
}
