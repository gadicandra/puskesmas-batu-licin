'use client'

import { useActionState, useState } from 'react'
import { Plus, Pencil, Trash2, X, Unlink } from 'lucide-react'
import {
    simpanPengguna,
    hapusPengguna,
    putuskanTautanGoogle,
} from '@/app/dashboard/(app)/pengguna/actions'
import type { FormState } from '@/lib/dashboard/crud'
import { LABEL_METODE_LOGIN, type MetodeLogin } from '@/lib/dashboard/metode-login'
import Button from '@/components/dashboard/ui/Button'
import Field from '@/components/dashboard/ui/Field'
import Input, { Select } from '@/components/dashboard/ui/Input'
import Badge from '@/components/dashboard/ui/Badge'
import PemuatLayar from '@/components/dashboard/ui/PemuatLayar'
import { usePaginasi } from '@/components/dashboard/ui/Paginasi'

export type PenggunaBaris = {
    id: number
    name: string
    email: string
    role: string
    metodeLogin: string
    tertautGoogle: boolean
    lokasi: string | null
}

export default function DaftarPengguna({
    data,
    idSaya,
    googleAktif,
}: {
    data: PenggunaBaris[]
    idSaya: number
    /** false bila server belum dikonfigurasi untuk login Google. */
    googleAktif: boolean
}) {
    const [stateSimpan, aksiSimpan, sedangSimpan] = useActionState<FormState, FormData>(simpanPengguna, {})
    const [stateHapus, aksiHapus, sedangHapus] = useActionState<FormState, FormData>(hapusPengguna, {})
    const [statePutus, aksiPutus, sedangPutus] = useActionState<FormState, FormData>(putuskanTautanGoogle, {})
    const [formTerbuka, setFormTerbuka] = useState(false)
    const [ubah, setUbah] = useState<PenggunaBaris | null>(null)
    const [role, setRole] = useState('admin')
    const [metode, setMetode] = useState<MetodeLogin>('sandi')
    const { potongan, kendali } = usePaginasi(data, 'pengguna')

    const buka = (p: PenggunaBaris | null) => {
        setUbah(p)
        setRole(p?.role ?? 'admin')
        setMetode((p?.metodeLogin as MetodeLogin) ?? 'sandi')
        setFormTerbuka(true)
    }

    const perluSandi = metode !== 'google'

    return (
        <div className="flex flex-col gap-5">
            {(stateSimpan.error || stateHapus.error || statePutus.error) && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {stateSimpan.error || stateHapus.error || statePutus.error}
                </p>
            )}
            {(stateSimpan.sukses || stateHapus.sukses || statePutus.sukses) && (
                <p role="status" className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                    {stateSimpan.sukses || stateHapus.sukses || statePutus.sukses}
                </p>
            )}

            {!formTerbuka && (
                <div>
                    <Button leftIcon={<Plus size={18} />} onClick={() => buka(null)}>Tambah Akun</Button>
                </div>
            )}

            {formTerbuka && (
                <form action={aksiSimpan} className="rounded-2xl border border-primary/10 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-bold text-primary">{ubah ? 'Ubah Akun' : 'Tambah Akun'}</h2>
                        <button type="button" onClick={() => setFormTerbuka(false)} aria-label="Tutup form" className="rounded-lg p-2 text-tertiary hover:bg-base">
                            <X size={20} />
                        </button>
                    </div>

                    {ubah && <input type="hidden" name="id" value={ubah.id} />}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nama" htmlFor="name" wajib error={stateSimpan.fieldErrors?.name}>
                            <Input id="name" name="name" defaultValue={ubah?.name ?? ''} required />
                        </Field>
                        <Field label="Email" htmlFor="email" wajib error={stateSimpan.fieldErrors?.email}>
                            <Input id="email" name="email" type="email" defaultValue={ubah?.email ?? ''} required />
                        </Field>
                        <Field
                            label="Cara masuk"
                            htmlFor="metodeLogin"
                            keterangan={
                                !googleAktif
                                    ? 'Masuk dengan Google belum diaktifkan di server ini.'
                                    : metode === 'google'
                                      ? 'Pengguna masuk dengan menekan tombol Google. Tidak perlu kata sandi.'
                                      : metode === 'keduanya'
                                        ? 'Pengguna boleh memilih: kata sandi, atau tombol Google.'
                                        : 'Pengguna masuk dengan email dan kata sandi seperti biasa.'
                            }
                            error={stateSimpan.fieldErrors?.metodeLogin}
                        >
                            <Select
                                id="metodeLogin"
                                name="metodeLogin"
                                value={metode}
                                disabled={!googleAktif}
                                onChange={(e) => setMetode(e.target.value as MetodeLogin)}
                            >
                                <option value="sandi">{LABEL_METODE_LOGIN.sandi}</option>
                                <option value="google">{LABEL_METODE_LOGIN.google}</option>
                                <option value="keduanya">{LABEL_METODE_LOGIN.keduanya}</option>
                            </Select>
                            {/* Select yang disabled tidak ikut terkirim — kirim nilainya lewat hidden. */}
                            {!googleAktif && <input type="hidden" name="metodeLogin" value="sandi" />}
                        </Field>
                        {perluSandi && (
                            <Field
                                label={ubah ? 'Kata sandi baru' : 'Kata sandi'}
                                htmlFor="password"
                                wajib={!ubah}
                                keterangan={ubah ? 'Kosongkan bila tidak ingin mengganti kata sandi.' : 'Minimal 8 karakter.'}
                                error={stateSimpan.fieldErrors?.password}
                            >
                                <Input id="password" name="password" type="password" autoComplete="new-password" />
                            </Field>
                        )}
                        <Field label="Hak akses" htmlFor="role" keterangan={
                            role === 'superadmin'
                                ? 'Super Admin: bisa mengelola seluruh isi website dan akun pengguna.'
                                : 'Admin: hanya bisa menulis dan mengubah artikelnya sendiri.'
                        }>
                            <Select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="admin">Admin (Unit/Jejaring)</option>
                                <option value="superadmin">Super Admin (Puskesmas)</option>
                            </Select>
                        </Field>
                        {role === 'admin' && (
                            <Field label="Unit / lokasi" htmlFor="lokasi" keterangan="Nama unit atau jejaring tempat pengguna bertugas.">
                                <Input id="lokasi" name="lokasi" defaultValue={ubah?.lokasi ?? ''} />
                            </Field>
                        )}
                    </div>

                    <div className="mt-5 flex gap-2">
                        <Button type="submit" loading={sedangSimpan}>Simpan</Button>
                        <Button type="button" varian="ghost" onClick={() => setFormTerbuka(false)}>Batal</Button>
                    </div>
                </form>
            )}

            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-primary/10 bg-base/50">
                        <tr className="text-xs uppercase tracking-wide text-tertiary">
                            <th className="px-5 py-3 font-bold">Nama</th>
                            <th className="px-5 py-3 font-bold">Email</th>
                            <th className="px-5 py-3 font-bold">Hak akses</th>
                            <th className="px-5 py-3 font-bold">Cara masuk</th>
                            <th className="px-5 py-3 text-right font-bold">Tindakan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10">
                        {potongan.map((p) => (
                            <tr key={p.id} className="transition hover:bg-base/40">
                                <td className="px-5 py-3">
                                    <span className="font-semibold text-primary">{p.name || '-'}</span>
                                    {p.id === idSaya && <span className="ml-2 text-xs text-tertiary">(Anda)</span>}
                                    {p.lokasi && <span className="block text-xs text-tertiary">{p.lokasi}</span>}
                                </td>
                                <td className="px-5 py-3 text-tertiary">{p.email}</td>
                                <td className="px-5 py-3">
                                    <Badge nada={p.role === 'superadmin' ? 'hijau' : 'abu'}>
                                        {p.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                    </Badge>
                                </td>
                                <td className="px-5 py-3 text-tertiary">
                                    {LABEL_METODE_LOGIN[(p.metodeLogin as MetodeLogin)] ?? p.metodeLogin}
                                    {p.tertautGoogle && (
                                        <span className="block text-xs text-tertiary">Sudah tertaut ke akun Google</span>
                                    )}
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Button ukuran="sm" varian="ghost" leftIcon={<Pencil size={16} />} onClick={() => buka(p)}>
                                            Ubah
                                        </Button>
                                        {p.tertautGoogle && (
                                            <form
                                                action={aksiPutus}
                                                onSubmit={(e) => {
                                                    if (
                                                        !window.confirm(
                                                            `Putuskan tautan akun Google untuk "${p.name || p.email}"? Setelah ini, akun Google mana pun dengan alamat email tersebut bisa ditautkan ulang saat masuk berikutnya.`
                                                        )
                                                    ) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                            >
                                                <input type="hidden" name="id" value={p.id} />
                                                <Button type="submit" ukuran="sm" varian="ghost" leftIcon={<Unlink size={16} />}>
                                                    Putus tautan
                                                </Button>
                                            </form>
                                        )}
                                        {p.id !== idSaya && (
                                            <form
                                                action={aksiHapus}
                                                onSubmit={(e) => {
                                                    if (!window.confirm(`Hapus akun "${p.name || p.email}"? Tindakan ini tidak bisa dibatalkan.`)) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                            >
                                                <input type="hidden" name="id" value={p.id} />
                                                <input type="hidden" name="konfirmasiArtikel" value="ya" />
                                                <Button type="submit" ukuran="sm" varian="danger" leftIcon={<Trash2 size={16} />}>
                                                    Hapus
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {kendali}

            {(sedangSimpan || sedangHapus || sedangPutus) && (
                <PemuatLayar
                    umumkan
                    label={sedangHapus ? 'Menghapus pengguna…' : sedangPutus ? 'Memutus tautan Google…' : 'Menyimpan pengguna…'}
                />
            )}
        </div>
    )
}
