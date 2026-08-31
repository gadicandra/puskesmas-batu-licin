import type { Field } from 'payload'

export const slugify = (input: string): string =>
    input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

/** Field slug otomatis dari field sumber (default `title`) bila dikosongkan.
 *  Slug dijamin unik: bila sudah dipakai dokumen lain, ditambahkan sufiks angka
 *  (`judul-sama-2`, `judul-sama-3`, ...) supaya penyimpanan tidak gagal. */
export const slugField = (source = 'title'): Field => ({
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: {
        position: 'sidebar',
        description: 'Dikosongkan = dibuat otomatis dari judul.',
    },
    hooks: {
        beforeValidate: [
            async ({ value, data, req, originalDoc, collection }) => {
                const base =
                    typeof value === 'string' && value.length > 0
                        ? slugify(value)
                        : (() => {
                            const src = (data as Record<string, unknown>)?.[source]
                            return typeof src === 'string' ? slugify(src) : undefined
                        })()

                if (!base) return value

                const collectionSlug = collection?.slug
                if (!collectionSlug || !req?.payload) return base

                // ID dokumen yang sedang disimpan — supaya tidak bentrok dengan dirinya sendiri.
                const currentId =
                    (originalDoc as { id?: string | number } | undefined)?.id ??
                    (data as { id?: string | number } | undefined)?.id

                let candidate = base
                for (let suffix = 2; suffix < 100; suffix++) {
                    const { docs } = await req.payload.find({
                        collection: collectionSlug as 'articles',
                        where: { slug: { equals: candidate } },
                        limit: 1,
                        depth: 0,
                        pagination: false,
                        overrideAccess: true,
                    })

                    const bentrok = docs.find((doc) => doc.id !== currentId)
                    if (!bentrok) return candidate

                    candidate = `${base}-${suffix}`
                }

                return candidate
            },
        ],
    },
})
