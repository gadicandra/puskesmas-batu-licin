'use client'

import { useActionState, useState } from 'react'
import { Plus, Pencil, Trash2, X, ChevronRight } from 'lucide-react'
import type { FormState } from '@/lib/dashboard/crud'
import type { MediaRingkas } from '@/app/dashboard/(app)/media/actions'
import MediaPicker from '@/components/dashboard/media/MediaPicker'
import Button from '@/components/dashboard/ui/Button'
import Field from '@/components/dashboard/ui/Field'
import Input, { Textarea, Select } from '@/components/dashboard/ui/Input'
import Badge from '@/components/dashboard/ui/Badge'
import EmptyState from '@/components/dashboard/ui/EmptyState'
import PemuatLayar from '@/components/dashboard/ui/PemuatLayar'
import { usePaginasi } from '@/components/dashboard/ui/Paginasi'
import PilihanBanyak from './PilihanBanyak'
import DaftarBaris, { type SubField } from './DaftarBaris'

export type { SubField }

export type SpesifikasiField = {
    nama: string
    label: string
    tipe:
        | 'teks'
        | 'angka'
        | 'panjang'
        | 'pilihan'
        | 'tanggal'
        | 'centang'
        | 'berkas'
        /** Relasi ke satu dokumen lain. `pilihan` disiapkan halaman. */
        | 'relasi'
        /** Relasi ke banyak dokumen, berbentuk daftar centang. */
        | 'relasiBanyak'
        /** Isian yang boleh diulang, mis. jadwal atau syarat. */
        | 'daftar'
    wajib?: boolean
    keterangan?: string
    contoh?: string
    pilihan?: { value: string; label: string }[]
    /** Kolom-kolom satu baris, khusus tipe `daftar`. */
    subFields?: SubField[]
    /** Sebutan satu baris pada tipe `daftar`, mis. "Syarat". */
    labelBaris?: string
    /** Pesan saat tidak ada yang bisa dipilih pada tipe `relasiBanyak`. */
    kosongPilihan?: string
    /** Relasi ke koleksi yang sama: buang data yang sedang diubah dari daftar
     *  pilihan supaya tidak bisa dijadikan induk/atasan dirinya sendiri. */
    bukanDiriSendiri?: boolean
    /** Khusus tipe `berkas`: berkasnya dokumen (sertifikat, piagam, surat),
     *  jadi jendela unggah mencentang "simpan apa adanya" sejak awal dan
     *  gambarnya tidak diubah ke WebP. */
    pertahankanAsli?: boolean
    /** Tampilkan kolom ini di tabel daftar */
    diTabel?: boolean
    /** Kolom tabel saja — tidak ikut dirender di form. Dipakai untuk kolom
     *  hasil olahan yang sudah disiapkan halaman (mis. nama atasan). */
    hanyaTabel?: boolean
}

export type BarisData = Record<string, unknown> & { id: number }

/** Ambil id dari nilai relasi: bisa berupa angka (depth 0) atau objek dokumen. */
function idRelasi(v: unknown): string {
    if (v === null || v === undefined) return ''
    if (typeof v === 'object' && 'id' in v) return String((v as { id: number | string }).id)
    return String(v)
}

export default function KoleksiSederhana({
    data,
    fields,
    simpanAksi,
    hapusAksi,
    labelSatuan,
    kunciJudul,
    kosongJudul,
    kosongKeterangan,
    bukaBaris,
}: {
    data: BarisData[]
    fields: SpesifikasiField[]
    simpanAksi: (prev: FormState, fd: FormData) => Promise<FormState>
    hapusAksi: (prev: FormState, fd: FormData) => Promise<FormState>
    labelSatuan: string
    kunciJudul: string
    kosongJudul: string
    kosongKeterangan: string
    /** Buat kolom pertama bisa ditekan untuk "masuk ke dalam" sebuah baris —
     *  dipakai Struktur Organisasi untuk membuka satu klaster. Tidak diisi
     *  berarti tabel biasa, seperti modul lain. */
    bukaBaris?: {
        /** Baris mana yang punya isi untuk dibuka. */
        bisa: (baris: BarisData) => boolean
        onBuka: (baris: BarisData) => void
        /** Dibacakan pembaca layar, mis. "lihat isi klaster". */
        label: string
    }
}) {
    const [stateSimpan, aksiSimpan, sedangSimpan] = useActionState<FormState, FormData>(simpanAksi, {})
    const [stateHapus, aksiHapus, sedangHapus] = useActionState<FormState, FormData>(hapusAksi, {})
    // Pesan hasil dibaca dari aksi yang PALING BARU dijalankan. Tanpa penanda
    // ini, `stateSimpan.sukses` yang lama menang atas `stateHapus.sukses` yang
    // baru, dan sesudah menghapus staf membaca "… tersimpan." — kalimat yang
    // menyesatkan persis di saat ia perlu yakin datanya benar-benar hilang.
    const [aksiTerakhir, setAksiTerakhir] = useState<'simpan' | 'hapus'>('simpan')
    const state = aksiTerakhir === 'hapus' ? stateHapus : stateSimpan

    const [formTerbuka, setFormTerbuka] = useState(false)
    const [sedangUbah, setSedangUbah] = useState<BarisData | null>(null)
    const [berkasTerpilih, setBerkasTerpilih] = useState<Record<string, MediaRingkas | null>>({})
    const [pemilihUntuk, setPemilihUntuk] = useState<string | null>(null)

    const kolomTabel = fields.filter((f) => f.diTabel)
    const kolomForm = fields.filter((f) => !f.hanyaTabel)
    const { potongan, kendali } = usePaginasi(data, labelSatuan.toLowerCase())

    const bukaForm = (baris: BarisData | null) => {
        setSedangUbah(baris)
        setBerkasTerpilih({})
        setFormTerbuka(true)
    }

    const nilaiAwal = (f: SpesifikasiField): string => {
        if (!sedangUbah) return ''
        const v = sedangUbah[f.nama]
        if (v === null || v === undefined) return ''
        if (f.tipe === 'berkas' || f.tipe === 'relasi') return idRelasi(v)
        if (f.tipe === 'tanggal') return String(v).slice(0, 10)
        return String(v)
    }

    const terpilihAwal = (f: SpesifikasiField): string[] => {
        const v = sedangUbah?.[f.nama]
        if (!Array.isArray(v)) return []
        return v.map(idRelasi).filter(Boolean)
    }

    const barisAwal = (f: SpesifikasiField): Record<string, string>[] => {
        const v = sedangUbah?.[f.nama]
        if (!Array.isArray(v)) return []
        // Hanya sub-kolom yang dikenal yang dibawa; `id` baris bawaan Payload
        // sengaja ditinggalkan karena tidak dipakai saat menyimpan ulang.
        return (v as Record<string, unknown>[]).map((baris) =>
            Object.fromEntries(
                (f.subFields ?? []).map((s) => [s.nama, baris?.[s.nama] == null ? '' : String(baris[s.nama])]),
            ),
        )
    }

    return (
        <div className="flex flex-col gap-5">
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

            {!formTerbuka && (
                <div>
                    <Button leftIcon={<Plus size={18} />} onClick={() => bukaForm(null)}>
                        Tambah {labelSatuan}
                    </Button>
                </div>
            )}

            {formTerbuka && (
                <form
                    // `key` memaksa form dibuat ulang saat berpindah data.
                    // Tanpa itu, isian yang tak terkendali tetap menampilkan
                    // nilai data sebelumnya saat tombol Ubah ditekan dua kali.
                    key={sedangUbah ? sedangUbah.id : 'baru'}
                    action={aksiSimpan}
                    onSubmit={() => setAksiTerakhir('simpan')}
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
                        {kolomForm.map((f) => {
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
                                const idAwal = nilaiAwal(f)
                                // Kunci yang sudah ada di state berarti pengguna
                                // baru saja memilih ATAU mengosongkan berkas —
                                // keduanya harus menang atas nilai lama.
                                const sudahDiubah = f.nama in berkasTerpilih
                                const dipilih = berkasTerpilih[f.nama] ?? null
                                const nilaiKirim = sudahDiubah ? (dipilih ? String(dipilih.id) : '') : idAwal
                                return (
                                    <div key={f.nama} className="sm:col-span-2">
                                        <Field label={f.label} keterangan={f.keterangan} error={error}>
                                            <input type="hidden" name={f.nama} value={nilaiKirim} />
                                            <div className="flex items-center gap-3">
                                                {dipilih && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={dipilih.thumbnailUrl} alt={dipilih.alt} className="h-16 w-16 rounded-lg object-cover" />
                                                )}
                                                <Button type="button" ukuran="sm" varian="secondary" onClick={() => setPemilihUntuk(f.nama)}>
                                                    {nilaiKirim ? 'Ganti Berkas' : 'Pilih Berkas'}
                                                </Button>
                                                {nilaiKirim && (
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

                            if (f.tipe === 'relasiBanyak') {
                                return (
                                    <div key={f.nama} className="sm:col-span-2">
                                        <Field label={f.label} keterangan={f.keterangan} error={error}>
                                            <PilihanBanyak
                                                nama={f.nama}
                                                pilihan={f.pilihan ?? []}
                                                terpilihAwal={terpilihAwal(f)}
                                                kosong={f.kosongPilihan ?? 'Belum ada pilihan yang bisa dicentang.'}
                                            />
                                        </Field>
                                    </div>
                                )
                            }

                            if (f.tipe === 'daftar') {
                                return (
                                    <div key={f.nama} className="sm:col-span-2">
                                        <Field label={f.label} keterangan={f.keterangan} error={error}>
                                            <DaftarBaris
                                                nama={f.nama}
                                                subFields={f.subFields ?? []}
                                                barisAwal={barisAwal(f)}
                                                labelBaris={f.labelBaris ?? 'Baris'}
                                            />
                                        </Field>
                                    </div>
                                )
                            }

                            return (
                                <div key={f.nama} className={f.tipe === 'panjang' ? 'sm:col-span-2' : ''}>
                                    <Field label={f.label} htmlFor={idField} wajib={f.wajib} keterangan={f.keterangan} error={error}>
                                        {f.tipe === 'panjang' ? (
                                            <Textarea id={idField} name={f.nama} defaultValue={nilaiAwal(f)} placeholder={f.contoh} required={f.wajib} />
                                        ) : f.tipe === 'pilihan' || f.tipe === 'relasi' ? (
                                            // `required` di sini yang menahan pilihan "— pilih —" terkirim.
                                            // Tanpa itu isian wajib berbentuk dropdown lolos ke server dan
                                            // baru ditolak zod — perjalanan yang jauh lebih panjang untuk
                                            // kesalahan yang bisa dicegah di tempat.
                                            <Select id={idField} name={f.nama} defaultValue={nilaiAwal(f)} required={f.wajib}>
                                                <option value="">— pilih —</option>
                                                {(f.bukanDiriSendiri && sedangUbah
                                                    ? (f.pilihan ?? []).filter((p) => p.value !== String(sedangUbah.id))
                                                    : (f.pilihan ?? [])
                                                ).map((p) => (
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
                <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white">
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
                            {potongan.map((baris) => (
                                <tr key={baris.id} className="transition hover:bg-base/40">
                                    {kolomTabel.map((k, i) => {
                                        const nilai = baris[k.nama]
                                        // Kolom pertama adalah kolom identitas
                                        // di semua modul, jadi di situlah
                                        // tombol "buka" ditempelkan.
                                        const bisaDibuka = i === 0 && Boolean(bukaBaris?.bisa(baris))
                                        return (
                                            <td key={k.nama} className="px-5 py-3 text-tertiary">
                                                {k.tipe === 'centang' ? (
                                                    <Badge nada={nilai ? 'hijau' : 'abu'}>{nilai ? 'Aktif' : 'Nonaktif'}</Badge>
                                                ) : bisaDibuka && bukaBaris ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => bukaBaris.onBuka(baris)}
                                                        className="inline-flex min-h-[36px] items-center gap-1 rounded-lg text-left font-semibold text-primary underline decoration-primary/25 underline-offset-4 transition hover:text-secondary hover:decoration-secondary"
                                                    >
                                                        {String(nilai ?? '-')}
                                                        <ChevronRight size={16} aria-hidden />
                                                        <span className="sr-only">— {bukaBaris.label}</span>
                                                    </button>
                                                ) : k.nama === kunciJudul || i === 0 ? (
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
                                                        return
                                                    }
                                                    setAksiTerakhir('hapus')
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

            {data.length > 0 && kendali}

            {/* Menyimpan/menghapus memicu revalidate, jadi tabelnya baru
                berubah beberapa saat setelah tombol ditekan. Tanpa penanda di
                tengah layar, jeda itu terbaca sebagai "tombolnya tidak jalan"
                dan staf menekannya berulang kali. Di sini layar sengaja
                dikunci: menekan tombol lain selagi data ditulis hanya membuat
                hasilnya membingungkan. */}
            {(sedangSimpan || sedangHapus) && (
                <PemuatLayar
                    umumkan
                    label={sedangHapus ? 'Menghapus data…' : 'Menyimpan data…'}
                />
            )}

            {pemilihUntuk && (
                <MediaPicker
                    pertahankanAsli={fields.find((f) => f.nama === pemilihUntuk)?.pertahankanAsli}
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
