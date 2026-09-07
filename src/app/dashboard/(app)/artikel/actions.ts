'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { TAG } from '@/lib/konten/tags'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/dashboard/auth'
import { skemaArtikel, petaError } from '@/lib/dashboard/validation'
import { bersihkanHtml, htmlKosong, ringkasanOtomatis } from '@/lib/dashboard/html'
import { pesanError } from '@/lib/dashboard/errors'

export type ArtikelState = {
    error?: string
    fieldErrors?: Record<string, string>
    sukses?: string
}

type Aksi = 'simpan' | 'terbitkan' | 'batalkan-terbit'

function bacaForm(formData: FormData) {
    return {
        title: String(formData.get('title') || ''),
        slug: String(formData.get('slug') || ''),
        excerpt: String(formData.get('excerpt') || ''),
        content: String(formData.get('content') || ''),
        category: String(formData.get('category') || 'berita'),
        cover: formData.get('cover') ? Number(formData.get('cover')) : null,
        publishedDate: String(formData.get('publishedDate') || ''),
    }
}

/** Menyimpan artikel (baru maupun ubah). Selalu lewat access control Payload
 *  dengan `overrideAccess: false` — admin unit hanya bisa menyentuh miliknya. */
export async function simpanArtikel(
    _prev: ArtikelState,
    formData: FormData
): Promise<ArtikelState> {
    const user = await requireUser()
    const id = formData.get('id') ? Number(formData.get('id')) : null
    const aksi = (String(formData.get('aksi') || 'simpan') as Aksi) ?? 'simpan'

    const mentah = bacaForm(formData)
    const hasil = skemaArtikel.safeParse(mentah)
    if (!hasil.success) {
        return { fieldErrors: petaError(hasil.error) }
    }

    const isi = bersihkanHtml(hasil.data.content ?? '')

    if (aksi === 'terbitkan' && htmlKosong(isi)) {
        return {
            fieldErrors: {
                content: 'Isi artikel masih kosong. Tulis isinya dulu sebelum diterbitkan.',
            },
        }
    }

    const status: 'published' | 'draft' | undefined =
        aksi === 'terbitkan' ? 'published' : aksi === 'batalkan-terbit' ? 'draft' : undefined

    const data = {
        title: hasil.data.title,
        // Slug dikosongkan = dibuat otomatis dari judul oleh hook slugField,
        // termasuk penambahan sufiks angka bila bentrok.
        ...(hasil.data.slug ? { slug: hasil.data.slug } : {}),
        excerpt: hasil.data.excerpt || ringkasanOtomatis(isi),
        content: isi,
        category: hasil.data.category,
        cover: hasil.data.cover ?? null,
        ...(hasil.data.publishedDate
            ? { publishedDate: new Date(hasil.data.publishedDate).toISOString() }
            : {}),
        ...(status ? { _status: status } : {}),
    }

    const payload = await getPayload({ config })
    let idBaru = id

    try {
        if (id) {
            await payload.update({
                collection: 'articles',
                id,
                data,
                user,
                overrideAccess: false,
                draft: status !== 'published',
            })
        } else {
            const dibuat = await payload.create({
                collection: 'articles',
                data: { ...data, _status: status ?? 'draft' },
                user,
                overrideAccess: false,
            })
            idBaru = dibuat.id
        }
    } catch (err) {
        return { error: pesanError(err) }
    }

    revalidatePath('/dashboard/artikel')
    revalidatePath('/artikel')
    revalidateTag(TAG.artikel)
    revalidatePath('/')

    if (!id && idBaru) redirect(`/dashboard/artikel/${idBaru}?tersimpan=1`)

    return {
        sukses:
            aksi === 'terbitkan'
                ? 'Artikel diterbitkan dan sudah tampil di situs.'
                : aksi === 'batalkan-terbit'
                    ? 'Artikel ditarik dari situs dan kembali jadi draf.'
                    : 'Artikel tersimpan.',
    }
}

/** Hapus artikel. */
export async function hapusArtikel(formData: FormData): Promise<void> {
    const user = await requireUser()
    const id = Number(formData.get('id'))
    if (!id) return

    const payload = await getPayload({ config })
    await payload.delete({ collection: 'articles', id, user, overrideAccess: false })

    revalidatePath('/dashboard/artikel')
    revalidatePath('/artikel')
    revalidateTag(TAG.artikel)
    redirect('/dashboard/artikel')
}
