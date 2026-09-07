'use client'

import { useActionState, useState } from 'react'
import { ChevronDown, ChevronUp, User, Phone } from 'lucide-react'
import type { FormState } from '@/lib/dashboard/crud'
import Badge from '@/components/dashboard/ui/Badge'
import Button from '@/components/dashboard/ui/Button'
import Field from '@/components/dashboard/ui/Field'
import { Textarea, Select } from '@/components/dashboard/ui/Input'
import EmptyState from '@/components/dashboard/ui/EmptyState'
import PemuatLayar from '@/components/dashboard/ui/PemuatLayar'
import { usePaginasi } from '@/components/dashboard/ui/Paginasi'
import { tanggapiPengaduan } from '@/app/dashboard/(app)/pengaduan/actions'

export type PengaduanRingkas = {
    id: number
    ringkasan: string
    isi: string
    nama: string
    kontak: string
    kategori: string
    labelKategori: string
    status: 'baru' | 'diproses' | 'selesai'
    tanggapan: string
    waktu: string
}

export const STATUS = [
    { value: 'baru', label: 'Baru' },
    { value: 'diproses', label: 'Sedang Diproses' },
    { value: 'selesai', label: 'Selesai' },
] as const

const NADA_STATUS = { baru: 'kuning', diproses: 'abu', selesai: 'hijau' } as const

export default function DaftarPengaduan({ data }: { data: PengaduanRingkas[] }) {
    const [state, aksi, sedangSimpan] = useActionState<FormState, FormData>(tanggapiPengaduan, {})
    const [terbuka, setTerbuka] = useState<number | null>(null)
    const { potongan, kendali } = usePaginasi(data, 'pengaduan')

    if (data.length === 0) {
        return (
            <EmptyState
                judul="Belum ada pengaduan masuk"
                keterangan="Pengaduan yang dikirim warga lewat situs akan muncul di sini."
            />
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {state.error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {state.error}
                </p>
            )}
            {state.sukses && (
                <p role="status" className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                    {state.sukses}
                </p>
            )}

            {potongan.map((p) => {
                const dibuka = terbuka === p.id
                return (
                    <article key={p.id} className="rounded-2xl border border-primary/10 bg-white">
                        <button
                            type="button"
                            onClick={() => setTerbuka(dibuka ? null : p.id)}
                            aria-expanded={dibuka}
                            className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                        >
                            <div className="min-w-0">
                                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                    <Badge nada={NADA_STATUS[p.status]}>
                                        {STATUS.find((s) => s.value === p.status)?.label ?? p.status}
                                    </Badge>
                                    <Badge>{p.labelKategori}</Badge>
                                    <span className="text-xs text-tertiary">{p.waktu}</span>
                                </div>
                                <p className="font-semibold text-primary">{p.ringkasan}</p>
                                {!dibuka && <p className="mt-1 line-clamp-2 text-sm text-tertiary">{p.isi}</p>}
                            </div>
                            <span className="mt-1 shrink-0 text-tertiary">
                                {dibuka ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </span>
                        </button>

                        {dibuka && (
                            <div className="border-t border-primary/10 px-5 py-4">
                                <p className="whitespace-pre-line text-sm leading-relaxed text-primary">{p.isi}</p>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-tertiary">
                                    <span className="inline-flex items-center gap-1.5">
                                        <User size={16} aria-hidden />
                                        {p.nama || 'Tanpa nama (anonim)'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Phone size={16} aria-hidden />
                                        {p.kontak || 'Tidak meninggalkan kontak'}
                                    </span>
                                </div>

                                {/* `key` memaksa isian kembali ke nilai tersimpan setiap kali
                                    kartu ditutup lalu dibuka lagi — tanpa itu tanggapan yang
                                    diketik lalu dibatalkan masih tertinggal di kotaknya. */}
                                <form key={p.id} action={aksi} className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <input type="hidden" name="id" value={p.id} />

                                    <Field label="Status penanganan" htmlFor={`status-${p.id}`} wajib>
                                        <Select id={`status-${p.id}`} name="status" defaultValue={p.status}>
                                            {STATUS.map((s) => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </Select>
                                    </Field>

                                    <div className="sm:col-span-2">
                                        <Field
                                            label="Tanggapan Puskesmas"
                                            htmlFor={`tanggapan-${p.id}`}
                                            keterangan="Ditulis untuk pengadu. Sebutkan apa yang sudah atau akan dilakukan."
                                        >
                                            <Textarea id={`tanggapan-${p.id}`} name="tanggapan" defaultValue={p.tanggapan} rows={4} />
                                        </Field>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Button type="submit" loading={sedangSimpan}>Simpan Tanggapan</Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </article>
                )
            })}

            {kendali}

            {sedangSimpan && <PemuatLayar umumkan label="Menyimpan tanggapan…" />}
        </div>
    )
}
